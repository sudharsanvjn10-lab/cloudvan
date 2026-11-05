const { readFileSync } = require('node:fs');

function databaseOptions() {
  const { DATABASE_URL, DB_CA_CERT, DATABASE_CA, DB_CA_PATH, DB_SSL, NODE_ENV } = process.env;
  if (!DATABASE_URL) return {};

  const uri = new URL(DATABASE_URL);
  const sslMode = uri.searchParams.get('ssl-mode');
  const sslRequested = uri.searchParams.has('ssl') || (sslMode && sslMode.toUpperCase() !== 'DISABLED');
  uri.searchParams.delete('ssl-mode');
  uri.searchParams.delete('ssl');

  const ca = DB_CA_CERT || DATABASE_CA || (DB_CA_PATH && readFileSync(DB_CA_PATH, 'utf8'));
  const useTls = NODE_ENV === 'production' || DB_SSL === 'true' || sslRequested || ca;

  return {
    uri: uri.toString(),
    ssl: useTls ? { ca: ca || undefined, rejectUnauthorized: true, verifyIdentity: true } : undefined
  };
}

module.exports = { databaseOptions };
