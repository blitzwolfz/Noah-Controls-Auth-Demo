import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const dbPath = resolve(process.cwd(), process.env.BETTER_AUTH_DB_PATH || './data/better-auth.sqlite');
mkdirSync(dirname(dbPath), { recursive: true });

export const auth = betterAuth({
  database: new Database(dbPath),
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-change-me',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
  basePath: '/api/better-auth',
  trustedOrigins: [process.env.FRONTEND_ORIGIN || 'http://localhost:5173'],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    crossSubDomainCookies: { enabled: false },
    defaultCookieAttributes: { sameSite: 'lax', secure: false },
  },
});
