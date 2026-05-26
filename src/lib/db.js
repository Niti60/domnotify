import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function getConnectionError(error) {
  const errorStr = error.toString();
  
  if (errorStr.includes('querySrv EREFUSED')) {
    return `DNS Resolution Failed: Cannot resolve MongoDB SRV records.
    
This is a network issue in your environment (Docker/WSL/Hyper-V).

SOLUTIONS:
1. Use local MongoDB for development:
   - Install MongoDB Community Edition
   - Update .env.local: MONGODB_URI="mongodb://localhost:27017/domnotify"
   
2. Or get direct connection string from MongoDB Atlas:
   - Go to Atlas Dashboard → Clusters → Connect
   - Choose "MongoDB for VS Code" or "Compass"
   - Copy connection string and update .env.local
   
3. Or fix DNS resolution:
   - Check your network/firewall settings
   - Restart DNS service
   - Use public DNS (8.8.8.8, 1.1.1.1)

Current URI: ${MONGODB_URI}`;
  }
  
  if (errorStr.includes('ECONNREFUSED')) {
    return 'MongoDB Connection Refused: Check if MongoDB is running and accessible.';
  }
  
  if (errorStr.includes('auth fail') || errorStr.includes('Unauthorized')) {
    return 'MongoDB Authentication Failed: Check username and password in MONGODB_URI.';
  }
  
  if (errorStr.includes('Timeout') || errorStr.includes('timed out')) {
    return 'MongoDB Connection Timeout: Cluster may be paused or unreachable. Check IP whitelist in MongoDB Atlas.';
  }
  
  return errorStr;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      authSource: 'admin',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("=> MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const helpfulError = getConnectionError(e);
    console.error("=> MongoDB Connection Error:", helpfulError);
    throw e;
  }

  return cached.conn;
}