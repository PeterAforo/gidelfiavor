// One-time admin password reset / admin creation.
// Usage (from the project root): node server/scripts/set-admin-password.js
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env'), quiet: true });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted || s.includes('\n') || s.includes('\r')) rl.output.write(muted ? '\n' : s);
};

const ask = (question, hidden = false) => new Promise((resolve) => {
  rl.output.write(question);
  muted = hidden;
  rl.question('', (answer) => {
    muted = false;
    resolve(answer.trim());
  });
});

try {
  const email = ((await ask('Admin email [admin@gidelfiavor.com]: ')) || 'admin@gidelfiavor.com').toLowerCase();
  const password = await ask('New password (min 12 chars): ', true);
  if (password.length < 12) throw new Error('Password must be at least 12 characters');
  const confirm = await ask('Repeat new password: ', true);
  if (password !== confirm) throw new Error('Passwords do not match');

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO admin_users (email, password, name) VALUES ($1, $2, 'Admin')
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`,
    [email, hash]
  );
  await pool.end();
  console.log(`Password updated for ${email}`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
