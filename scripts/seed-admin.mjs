#!/usr/bin/env node
/**
 * Seed an admin user in MongoDB.
 *
 * Usage:
 *   node scripts/seed-admin.mjs                       # uses defaults
 *   ADMIN_EMAIL=foo@bar.com ADMIN_PASSWORD=secret123 node scripts/seed-admin.mjs
 *
 * The email must also be listed in the ADMIN_EMAILS env var for /admin access.
 */
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Tiny .env.local loader (no dotenv dependency)
try {
  const envFile = readFileSync(join(__dirname, "..", ".env.local"), "utf8");
  for (const line of envFile.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "dave_electrical";
const adminEmail = process.env.ADMIN_EMAIL || "admin@daveelectrical.co.uk";
const adminPassword = process.env.ADMIN_PASSWORD || "DaveAdmin@2026";
const adminName = process.env.ADMIN_NAME || "Dave Admin";

if (!uri) {
  console.error("MONGODB_URI is missing. Set it in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);
const users = db.collection("users");

await users.createIndex({ email: 1 }, { unique: true });
const passwordHash = await bcrypt.hash(adminPassword, 10);

const existing = await users.findOne({ email: adminEmail.toLowerCase() });
if (existing) {
  await users.updateOne(
    { _id: existing._id },
    { $set: { passwordHash, name: adminName, role: "admin" } },
  );
  console.log(`✔ Reset password for existing user ${adminEmail}`);
} else {
  await users.insertOne({
    _id: new ObjectId(),
    name: adminName,
    email: adminEmail.toLowerCase(),
    passwordHash,
    role: "admin",
    createdAt: new Date(),
  });
  console.log(`✔ Created admin user ${adminEmail}`);
}

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
if (!adminEmails.includes(adminEmail.toLowerCase())) {
  console.warn(
    `\n⚠  ${adminEmail} is NOT in your ADMIN_EMAILS env var. Add it to grant /admin access:`,
  );
  console.warn(
    `   ADMIN_EMAILS=${[...adminEmails, adminEmail].join(",")}\n`,
  );
}

console.log("\nAdmin credentials:");
console.log(`   Email:    ${adminEmail}`);
console.log(`   Password: ${adminPassword}`);
console.log(`   Login at: /login   then go to /admin\n`);

await client.close();
