# Cloud Vantage Solutions — Production Deployment Prerequisites & Security Runbook

> **CRITICAL DEPLOYMENT GATEWAY**  
> Before pushing code to production or triggering live deploys on Render / AWS / Cloud hosts, the following prerequisites and security measures MUST be fulfilled.

---

## 1. Production JWT Secret Configuration & Rotation (Mandatory)
* **Status:** Enforced at startup (`server/server.js` fails closed if missing or < 32 chars).
* **Requirement:** Generate a cryptographically secure random string with at least 32 characters (64+ recommended).
* **Command to generate:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
* **Host Variable:** Set `JWT_SECRET` in your hosting dashboard (e.g. Render Web Service Environment).
* **Rotation Policy:** When rotating `JWT_SECRET` in production:
  1. All existing user sessions will automatically be invalidated.
  2. Users will be required to re-authenticate with their credentials.

---

## 2. SuperAdmin Account Bootstrap (Mandatory for First Deployment)
* **Default Seeds Removed:** Hardcoded admin seeds (`admin@cloudvantage.com / Admin@123`) have been completely purged from the codebase and migrations.
* **Initial Bootstrap Options:**
  * **Option A (Environment Variables during first startup):**
    ```env
    BOOTSTRAP_ADMIN_EMAIL=admin@your-company.com
    BOOTSTRAP_ADMIN_PASSWORD=YourStrongUniquePassword123!
    ```
  * **Option B (Dedicated CLI tool):**
    ```bash
    node server/bootstrap-admin.js admin@your-company.com YourStrongUniquePassword123! SuperAdmin
    ```
* **Password Policy:** Minimum 10 characters required for admin accounts. Passwords are securely hashed with `bcrypt` (12 rounds).
* **Session Invalidation:** Changing passwords via `/api/admin/change-password` or deleting accounts immediately revokes all active JWT tokens via `token_version` increment.

---

## 3. Database TLS/SSL Certificate Verification
* **Vulnerability Mitigated:** Insecure `rejectUnauthorized: false` has been replaced with strict CA certificate verification.
* **Production Config:**
  * If your cloud MySQL provider (Aiven, PlanetScale, AWS RDS) provides a CA certificate:
    * Set `DB_CA_CERT` (PEM string) OR
    * Place the certificate file on disk and set `DB_CA_PATH=/etc/ssl/certs/aiven-ca.pem`.
  * The server will automatically enforce `rejectUnauthorized: true`.

---

## 4. Production CORS Domain Review
* **Default Allowed Origins:**
  * `http://localhost:4200`
  * `http://127.0.0.1:4200`
  * `http://localhost:3000`
  * `https://cloudvan-ui.onrender.com`
  * `https://sudharsanvjn10-lab.github.io`
* **Additional Domains:**
  * Set `CORS_ALLOWED_ORIGINS` in your environment (comma-separated, e.g. `https://cloud-vantage.com,https://api.cloud-vantage.com`).

---

## 5. Live SMTP Email Configuration
* **Configuration:**
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=hr@cloud-vantage.com
  SMTP_PASS=your-app-password
  ADMIN_ALERT_EMAIL=alerts@cloud-vantage.com
  ```
* **Fallback Behavior:** If SMTP credentials are not set, mock mode safely records submissions without logging PII (recipient email masked, message body suppressed). Form submission and database storage succeed independently of email dispatch.

---

## 6. Pre-deployment Verification Checklist
- [x] Repeatable non-destructive database migrations verified (`node --check server/setup-db.js`).
- [x] Stale session invalidation verified against password change and user deletion.
- [x] Read-only `/api/jobs` endpoint verified (preserves real empty list `[]`).
- [x] All 21 Angular unit tests pass in headless mode (`ng test --watch=false --browsers=ChromeHeadless`).
- [x] Angular production build passes with zero errors (`ng build`).
- [x] Local integration tests pass with 40/40 assertions (`node scripts/test-local-integration.js`).
- [x] CI workflow added (`.github/workflows/ci.yml`).
