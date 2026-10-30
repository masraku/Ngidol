/**
 * Reset (or create) an admin account's password.
 *
 * Talks straight to the database, so it works even when you are locked out
 * of the admin panel. The password is read from a hidden prompt and is never
 * written to disk, to your shell history, or to the terminal.
 *
 *   node script/reset-admin-password.js you@example.com
 *
 * Requires DATABASE_URL in .env (the same one the app uses).
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

function askHidden(question) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const onData = (char) => {
      // Re-print the prompt without echoing what was typed.
      if (['\n', '\r', '\u0004'].includes(char.toString('utf8'))) return;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(question);
    };

    process.stdin.on('data', onData);

    rl.question(question, (answer) => {
      process.stdin.removeListener('data', onData);
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });

    rl.on('error', reject);
  });
}

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node script/reset-admin-password.js <admin-email>');
    process.exitCode = 1;
    return;
  }

  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    console.log(`Found admin: ${existing.name} <${existing.email}>`);
  } else {
    console.log(`No admin with that email. A new one will be created.`);
  }

  const password = await askHidden('New password: ');
  const confirm = await askHidden('Confirm password: ');

  if (password !== confirm) {
    console.error('Passwords do not match. Nothing was changed.');
    process.exitCode = 1;
    return;
  }

  if (password.length < 12) {
    console.error('Use at least 12 characters. Nothing was changed.');
    process.exitCode = 1;
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  if (existing) {
    await prisma.admin.update({ where: { email }, data: { password: hashed } });
    console.log('Password updated.');
  } else {
    const name = email.split('@')[0];
    await prisma.admin.create({ data: { email, name, password: hashed } });
    console.log(`Admin created as "${name}".`);
  }
}

main()
  .catch((error) => {
    console.error('Failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
