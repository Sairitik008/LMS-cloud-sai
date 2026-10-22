const mongoose = require('mongoose');

// Attach lifecycle event listeners once
let listenersAttached = false;
const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`⚠️ MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Mongoose will attempt automatic reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB successfully reconnected.');
  });
};

const connectDB = async () => {
  attachListeners();

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms';

  const mongooseOptions = {
    serverSelectionTimeoutMS: 15000, // 15s to absorb cloud DNS and cold-start WAN latency
    connectTimeoutMS: 20000,
    socketTimeoutMS: 45000, // Prevent hanging sockets on network drops
    maxPoolSize: 20, // Keep connection count safely below Atlas M0 limit (500) while maximizing throughput
    minPoolSize: 2,  // Maintain warm connection pool to eliminate socket spin-up latency
    family: 4, // Force IPv4 to eliminate 5-10s dual-stack IPv6 DNS fallback delays on cloud containers
    heartbeatFrequencyMS: 10000, // Keep-alive ping interval to prevent firewall/NAT socket drops
    retryWrites: true,
  };

  if (!primaryUri) {
    console.warn('⚠️ No MONGO_URI specified. Using local fallback:', fallbackUri);
    try {
      const conn = await mongoose.connect(fallbackUri, mongooseOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      console.error(`Local MongoDB connection failed: ${err.message}`);
      return null;
    }
  }

  try {
    const conn = await mongoose.connect(primaryUri, mongooseOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Primary Connection Error: ${error.message}`);
    
    // If running in development/test and primary fails (e.g. Atlas DNS/network offline), attempt local fallback
    if (process.env.NODE_ENV !== 'production' && primaryUri !== fallbackUri) {
      console.log(`Attempting fallback database connection to: ${fallbackUri}...`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri, mongooseOptions);
        console.log(`MongoDB Connected (Fallback): ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
        return fallbackConn;
      } catch (fallbackErr) {
        console.error(`Fallback database connection failed: ${fallbackErr.message}`);
      }
    } else {
      console.warn('⚠️ Server will stay alive to allow healthcheck reporting while MongoDB recovers.');
      // Schedule background retry so initial cold start network delay doesn't permanently kill connectivity
      setTimeout(() => {
        if (mongoose.connection.readyState === 0) {
          console.log('🔄 Retrying primary MongoDB connection in background...');
          connectDB().catch((e) => console.error('Background reconnect error:', e.message));
        }
      }, 10000);
    }
    return null;
  }
};

module.exports = connectDB;
