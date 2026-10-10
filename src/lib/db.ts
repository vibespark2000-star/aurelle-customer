import mongoose from "mongoose";

/**
 * Cached MongoDB connection.
 *
 * Returns the mongoose instance when the database is reachable, or `null` when it is not.
 * API routes treat `null` as "use the in-memory fallback store" (see lib/memoryStore.ts).
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) global.mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.warn("⚠️ MONGODB_URI is not set. Using in-memory fallback store.");
    return null;
  }

  if (!cached.promise) {
    const allowInvalidTls = process.env.MONGODB_TLS_ALLOW_INVALID === "true";

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 15000,
        ...(allowInvalidTls && { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true }),
      })
      .then((m) => {
        console.log("✅ Connected to MongoDB.");
        return m;
      })
      .catch((err) => {
        console.warn("⚠️ MongoDB unavailable. Using in-memory fallback store:", err.message);
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
