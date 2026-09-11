#!/usr/bin/env node
/**
 * Local development database for Dave Cleaning Services.
 *
 * Spins up a self-contained MongoDB (via mongodb-memory-server) on a fixed
 * port with a persistent data directory, so the full app (admin, quotes,
 * orders) works on localhost with NO Docker and NO system Mongo install.
 *
 * Usage:  npm run dev:db      (leave running in its own terminal)
 * Then:   npm run seed:admin  and  npm run dev
 *
 * For production, set a real MONGODB_URI (e.g. MongoDB Atlas) instead.
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "..", ".localdb");
mkdirSync(dbPath, { recursive: true });

const PORT = Number(process.env.LOCAL_DB_PORT || 27017);

const mongod = await MongoMemoryServer.create({
  instance: {
    port: PORT,
    dbPath,
    storageEngine: "wiredTiger",
  },
});

console.log("\n🧼  Dave Cleaning — local MongoDB is running");
console.log(`   URI:    ${mongod.getUri()}`);
console.log(`   Data:   ${dbPath}`);
console.log("   Add to .env.local:  MONGODB_URI=mongodb://127.0.0.1:" + PORT);
console.log("\n   Leave this terminal open. Ctrl+C to stop.\n");

const shutdown = async () => {
  await mongod.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
