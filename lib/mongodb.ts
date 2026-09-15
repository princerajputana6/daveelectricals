import { MongoClient, type Db } from "mongodb";

const DEFAULT_DB = "dave_electrical";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Lazily creates (and caches) the MongoClient connection.
 * Throws only when called at runtime — never at import time, so the Next.js
 * build can complete even before env vars are populated (e.g. on Vercel before
 * the first request).
 */
function getClientPromise(): Promise<MongoClient> {
  if (global._mongoClientPromise) return global._mongoClientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your environment variables (Vercel → Project Settings → Environment Variables, or .env.local for local development).",
    );
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  const promise = client.connect();

  if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = promise;
  }

  return promise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || DEFAULT_DB);
}

export default getClientPromise;
