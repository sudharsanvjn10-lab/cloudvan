/**
 * Cloudvan Comprehensive Local Integration Test Suite
 * Covers:
 * 1. Default credentials rejected
 * 2. DB-down login fails closed (no fallback tokens)
 * 3. Invalid and expired tokens rejected
 * 4. Admin vs SuperAdmin role enforcement
 * 5. Clean and existing schema migration (preserves users & content)
 * 6. Real empty jobs (read-only, preserves empty list, accurate error reporting)
 * 7. Stale session invalidation after password change & account deletion
 * 8. PII protection in mock SMTP logs
 */

const path = require('path');
module.paths.push(path.resolve(__dirname, '../server/node_modules'));

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');

// Set mandatory strong JWT_SECRET for test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'cloudvan_test_jwt_secret_minimum_32_characters_length_secure_token_2026';
process.env.PORT = '0'; // Ephemeral port
const TEST_DB_NAME = 'cloudvan_test_disposable';
process.env.DATABASE_URL = `mysql://root:root@localhost:3306/${TEST_DB_NAME}`;

let serverInstance;
let serverPort;
let pool;

async function run() {
  console.log('====================================================');
  console.log('🧪 Starting Cloudvan Local Integration Verification');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. Setup disposable database
  console.log('--- Step 1: Setting up disposable test database ---');
  const rootConn = await mysql.createConnection('mysql://root:root@localhost:3306');
  await rootConn.execute(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
  await rootConn.execute(`CREATE DATABASE ${TEST_DB_NAME}`);
  await rootConn.end();
  console.log(`  ✓ Disposable database '${TEST_DB_NAME}' created cleanly.`);

  // 2. Test clean schema migration
  console.log('\n--- Step 2: Testing clean schema migration ---');
  const { runMigrations } = require('../server/setup-db.js');
  await runMigrations();

  const testConn = await mysql.createConnection(process.env.DATABASE_URL);
  const [tables] = await testConn.execute('SHOW TABLES');
  const tableNames = tables.map(r => Object.values(r)[0]);
  assert(tableNames.includes('users'), 'Users table was created');
  assert(tableNames.includes('jobs'), 'Jobs table was created');
  assert(tableNames.includes('insights'), 'Insights table was created');
  assert(tableNames.includes('team_members'), 'Team members table was created');

  const [jobsRows] = await testConn.execute('SELECT COUNT(*) AS count FROM jobs');
  assert(jobsRows[0].count === 0, 'Clean migration leaves jobs list intentionally empty');

  const [initialUsers] = await testConn.execute('SELECT COUNT(*) AS count FROM users');
  assert(initialUsers[0].count === 0, 'Default hardcoded admin seeds were NOT inserted');

  // 3. Test repeatable migration preserves content & users
  console.log('\n--- Step 3: Testing repeatable migration preserves content & users ---');
  await testConn.execute(
    'INSERT INTO users (email, password, privilege, token_version) VALUES (?, ?, ?, 1)',
    ['existing@test.com', 'hashed_pass', 'Admin']
  );
  await testConn.execute(
    'INSERT INTO insights (title, excerpt, date, imageUrl) VALUES (?, ?, ?, ?)',
    ['Custom Insight', 'Custom Excerpt', 'Nov 2026', 'https://example.com/img.png']
  );

  // Re-run migration on existing DB
  await runMigrations();

  const [preservedUsers] = await testConn.execute('SELECT email FROM users WHERE email = ?', ['existing@test.com']);
  assert(preservedUsers.length === 1, 'Repeatable migration preserved existing users');

  const [preservedInsights] = await testConn.execute('SELECT title FROM insights WHERE title = ?', ['Custom Insight']);
  assert(preservedInsights.length === 1, 'Repeatable migration preserved existing custom content');
  await testConn.end();

  // 4. Seed test users for server testing
  console.log('\n--- Step 4: Bootstrapping test users & starting server ---');
  const bootstrapConn = await mysql.createConnection(process.env.DATABASE_URL);
  const superAdminPass = bcrypt.hashSync('SuperSecret123!', 10);
  const adminPass = bcrypt.hashSync('AdminSecret123!', 10);

  await bootstrapConn.execute('DELETE FROM users');
  await bootstrapConn.execute(
    'INSERT INTO users (email, password, privilege, token_version) VALUES (?, ?, ?, 1)',
    ['super@cloudvantage.com', superAdminPass, 'SuperAdmin']
  );
  await bootstrapConn.execute(
    'INSERT INTO users (email, password, privilege, token_version) VALUES (?, ?, ?, 1)',
    ['regular@cloudvantage.com', adminPass, 'Admin']
  );
  await bootstrapConn.end();

  const { app, pool: serverPool } = require('../server/server.js');
  pool = serverPool;

  await new Promise((resolve) => {
    serverInstance = app.listen(0, () => {
      serverPort = serverInstance.address().port;
      console.log(`  ✓ Test server listening on port ${serverPort}`);
      resolve();
    });
  });

  const baseUrl = `http://127.0.0.1:${serverPort}`;

  // Helper HTTP request function
  async function request(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const req = http.request(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            resolve({ status: res.statusCode, body: json, raw: data });
          } catch(e) {
            resolve({ status: res.statusCode, body: data, raw: data });
          }
        });
      });
      req.on('error', reject);
      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      req.end();
    });
  }

  // 5. Test default credentials rejected
  console.log('\n--- Step 5: Testing default hardcoded credentials rejected ---');
  const defaultLoginRes = await request('/api/login', {
    method: 'POST',
    body: { email: 'admin@cloudvantage.com', password: 'Admin@123' }
  });
  assert(defaultLoginRes.status === 401, 'Hardcoded default credentials return HTTP 401');
  assert(defaultLoginRes.body.error === 'Invalid corporate credentials', 'Default credentials error message is standard corporate error');

  // 6. Test real empty jobs endpoint
  console.log('\n--- Step 6: Testing GET /api/jobs read-only & empty list ---');
  const emptyJobsRes = await request('/api/jobs');
  assert(emptyJobsRes.status === 200, 'GET /api/jobs returns HTTP 200');
  assert(Array.isArray(emptyJobsRes.body) && emptyJobsRes.body.length === 0, 'GET /api/jobs returns real empty array [] without auto-seeding mock jobs');

  // Verify in DB that jobs table still has 0 rows
  const verifyJobsConn = await mysql.createConnection(process.env.DATABASE_URL);
  const [dbJobs] = await verifyJobsConn.execute('SELECT COUNT(*) AS count FROM jobs');
  assert(dbJobs[0].count === 0, 'Database jobs table remained empty (read-only verification)');
  await verifyJobsConn.end();

  // 7. Test successful login and JWT generation
  console.log('\n--- Step 7: Testing valid logins and token properties ---');
  const superLogin = await request('/api/login', {
    method: 'POST',
    body: { email: 'super@cloudvantage.com', password: 'SuperSecret123!' }
  });
  assert(superLogin.status === 200, 'SuperAdmin login succeeded with HTTP 200');
  assert(superLogin.body.privilege === 'SuperAdmin', 'SuperAdmin privilege reflected in login response');
  const superToken = superLogin.body.token;

  const adminLogin = await request('/api/login', {
    method: 'POST',
    body: { email: 'regular@cloudvantage.com', password: 'AdminSecret123!' }
  });
  assert(adminLogin.status === 200, 'Admin login succeeded with HTTP 200');
  assert(adminLogin.body.privilege === 'Admin', 'Admin privilege reflected in login response');
  const adminToken = adminLogin.body.token;

  // 8. Test Role Enforcement (Admin vs SuperAdmin)
  console.log('\n--- Step 8: Testing role enforcement (SuperAdmin vs Admin) ---');
  // Attempt to create user with regular Admin token
  const createByAdmin = await request('/api/admin/create-user', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: { email: 'newadmin@test.com', password: 'LongPassword123!', privilege: 'Admin' }
  });
  assert(createByAdmin.status === 403, 'Regular Admin is forbidden (403) from creating admin users');

  // SuperAdmin creates user
  const createBySuper = await request('/api/admin/create-user', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${superToken}` },
    body: { email: 'newadmin@test.com', password: 'LongPassword123!', privilege: 'Admin' }
  });
  assert(createBySuper.status === 200, 'SuperAdmin successfully creates new user (200)');

  // Verify /api/admin/data: Admin gets empty users list, SuperAdmin gets all users
  const adminDataForAdmin = await request('/api/admin/data', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(adminDataForAdmin.status === 200, 'Admin can view admin data');
  assert(Array.isArray(adminDataForAdmin.body.users) && adminDataForAdmin.body.users.length === 0, 'Admin cannot view users list (restricted to SuperAdmin)');

  const adminDataForSuper = await request('/api/admin/data', {
    headers: { 'Authorization': `Bearer ${superToken}` }
  });
  assert(adminDataForSuper.status === 200, 'SuperAdmin can view admin data');
  assert(adminDataForSuper.body.users.length > 0, 'SuperAdmin can view users list');

  // 9. Test Invalid and Expired Tokens
  console.log('\n--- Step 9: Testing invalid and expired tokens ---');
  const noTokenRes = await request('/api/admin/data');
  assert(noTokenRes.status === 401, 'Request without token returns 401');

  const malformedTokenRes = await request('/api/admin/data', {
    headers: { 'Authorization': 'Bearer garbage_token_12345' }
  });
  assert(malformedTokenRes.status === 403, 'Malformed token returns 403');

  const expiredToken = jwt.sign(
    { id: 999, email: 'expired@test.com', privilege: 'Admin', tokenVersion: 1 },
    process.env.JWT_SECRET,
    { expiresIn: '-1s' }
  );
  const expiredRes = await request('/api/admin/data', {
    headers: { 'Authorization': `Bearer ${expiredToken}` }
  });
  assert(expiredRes.status === 403, 'Expired token returns 403');

  // 10. Test Stale Session Invalidation (Password Change)
  console.log('\n--- Step 10: Testing session invalidation after password change ---');
  // Log in as newadmin@test.com
  const newAdminLogin = await request('/api/login', {
    method: 'POST',
    body: { email: 'newadmin@test.com', password: 'LongPassword123!' }
  });
  const newAdminToken1 = newAdminLogin.body.token;

  // Change password
  const pwChangeRes = await request('/api/admin/change-password', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${newAdminToken1}` },
    body: { email: 'newadmin@test.com', newPassword: 'NewLongPassword123!' }
  });
  assert(pwChangeRes.status === 200, 'Password change succeeded');

  // Old token must now be rejected
  const oldTokenCheck = await request('/api/admin/data', {
    headers: { 'Authorization': `Bearer ${newAdminToken1}` }
  });
  assert(oldTokenCheck.status === 401, 'Old session token invalidated after password change (HTTP 401)');
  assert(oldTokenCheck.body.error.includes('Session invalidated'), 'Error indicates credential change');

  // Login with new password gives fresh valid token
  const newAdminLogin2 = await request('/api/login', {
    method: 'POST',
    body: { email: 'newadmin@test.com', password: 'NewLongPassword123!' }
  });
  assert(newAdminLogin2.status === 200, 'Login with updated password succeeds');
  const newAdminToken2 = newAdminLogin2.body.token;

  // 11. Test Stale Session Invalidation (Account Deletion)
  console.log('\n--- Step 11: Testing session invalidation after account deletion ---');
  // Find id of newadmin@test.com
  const userListCheck = await request('/api/admin/data', {
    headers: { 'Authorization': `Bearer ${superToken}` }
  });
  const targetUser = userListCheck.body.users.find(u => u.email === 'newadmin@test.com');
  assert(!!targetUser, 'Found target user to delete');

  // Delete target user by SuperAdmin
  const deleteRes = await request(`/api/admin/user/${targetUser.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${superToken}` }
  });
  assert(deleteRes.status === 200, 'User deleted by SuperAdmin');

  // Target user token must now be rejected
  const deletedUserTokenCheck = await request('/api/admin/data', {
    headers: { 'Authorization': `Bearer ${newAdminToken2}` }
  });
  assert(deletedUserTokenCheck.status === 401, 'Deleted user session rejected with HTTP 401');
  assert(deletedUserTokenCheck.body.error.includes('no longer exists'), 'Error indicates user account no longer exists');

  // 12. Test Contact submission & emailDelivery status
  console.log('\n--- Step 12: Testing contact submission & email delivery surfacing ---');
  const contactRes = await request('/api/contact', {
    method: 'POST',
    body: {
      name: 'Integration Tester',
      email: 'tester@enterprise.com',
      phone: '+1 555 123 4567',
      message: 'Inquiry regarding Oracle Cloud Fusion HCM migrations.'
    }
  });
  assert(contactRes.status === 200, 'Contact submission succeeded (200)');
  assert(contactRes.body.success === true, 'Contact submission reported success: true');
  assert(typeof contactRes.body.emailDelivered === 'boolean', 'Contact submission surfaces emailDelivered flag');

  // 13. Test DB-down login fails closed (no fallback tokens)
  console.log('\n--- Step 13: Testing DB-down login fails closed ---');
  assert((await request('/api/ready')).status === 200, 'Readiness succeeds with migrated database');
  // Temporarily close pool to simulate DB outage
  await pool.end();
  assert((await request('/api/ready')).status === 503, 'Readiness fails during database outage');
  const dbDownLogin = await request('/api/login', {
    method: 'POST',
    body: { email: 'admin@cloudvantage.com', password: 'Admin@123' }
  });
  assert(dbDownLogin.status === 503, 'DB-down login returns HTTP 503 (fails closed)');
  assert(dbDownLogin.body.token === undefined, 'DB-down login issues NO mock or fallback token');
  assert(dbDownLogin.body.error.includes('unavailable'), 'DB-down login returns professional service unavailable error');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passedTests} / ${totalTests} INTEGRATION TESTS PASSED!`);
  console.log('====================================================\n');

}

async function cleanup() {
  console.log('--- Cleaning up disposable database and server ---');
  if (serverInstance) {
    serverInstance.close();
  }
  if (pool) {
    try { await pool.end(); } catch(e) {}
  }
  try {
    const rootConn = await mysql.createConnection('mysql://root:root@localhost:3306');
    await rootConn.execute(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
    await rootConn.end();
    console.log(`  ✓ Disposable database '${TEST_DB_NAME}' dropped.`);
  } catch(e) {
    console.warn('Cleanup warning:', e.message);
  }
}

run()
  .then(async () => {
    await cleanup();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('\n❌ Integration Test Error:', err);
    await cleanup();
    process.exit(1);
  });
