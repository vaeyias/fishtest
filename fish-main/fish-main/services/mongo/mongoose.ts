// https://medium.com/@oruchan.asar/nextjs-13-app-backend-development-d044c804c3
import mongoose, { type Mongoose } from "mongoose";


interface ICached {
    conn: Mongoose | null,
    promise: Promise<Mongoose> | null;
}
let cached: ICached = { conn: null, promise: null };

/**
 * Mongoose client.
 * 
 * @returns Promise that resolves into a cached Mongoose connection.
 */
export async function mongooseConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  // create a new promise to attempt connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}