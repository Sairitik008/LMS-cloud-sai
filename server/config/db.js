const mongoose = require('mongoose');

// Increase Mongoose operation buffer timeout so queries during cloud Atlas cold starts wait instead of failing immediately
mongoose.set('bufferTimeoutMS', 30000);

let isConnecting = false;
let reconnectTimer = null;

const scheduleReconnect = (delayMs = 5000) => {
  if (reconnectTimer || mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (mongoose.connection.readyState === 0) {
      console.log('🔄 Attempting automatic MongoDB reconnection...');
      connectDB().catch((err) => {
        console.warn('⚠️ Background reconnection attempt failed:', err.message);
        scheduleReconnect(Math.min(delayMs * 1.5, 30000));
      });
    }
  }, delayMs);
};

// Attach lifecycle event listeners once
let listenersAttached = false;
const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connection established.');
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error(`⚠️ MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Scheduling automatic reconnection...');
    scheduleReconnect(3000);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB successfully reconnected.');
  });
};

const connectDB = async () => {
  attachListeners();

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return null;
  }

  isConnecting = true;

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/lms';

  const mongooseOptions = {
    serverSelectionTimeoutMS: 20000, // 20s to absorb cloud DNS and cold-start WAN latency
    connectTimeoutMS: 25000,
    socketTimeoutMS: 45000, // Prevent hanging sockets on network drops
    maxIdleTimeMS: 45000, // Close idle pool sockets before cloud NAT/firewalls terminate them
    maxPoolSize: 20, // Keep connection count safely below Atlas M0 limit (500) while maximizing throughput
    minPoolSize: 2,  // Maintain warm connection pool to eliminate socket spin-up latency
    family: 4, // Force IPv4 to eliminate 5-10s dual-stack IPv6 DNS fallback delays on cloud containers
    heartbeatFrequencyMS: 10000, // Driver keep-alive ping interval to prevent firewall/NAT socket drops
    retryWrites: true,
    retryReads: true,
  };

  if (!primaryUri) {
    console.warn('⚠️ No MONGO_URI specified. Using local fallback:', fallbackUri);
    try {
      const conn = await mongoose.connect(fallbackUri, mongooseOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      isConnecting = false;
      return conn;
    } catch (err) {
      console.error(`Local MongoDB connection failed: ${err.message}`);
      isConnecting = false;
      scheduleReconnect(5000);
      return null;
    }
  }

  try {
    const conn = await mongoose.connect(primaryUri, mongooseOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.error(`MongoDB Primary Connection Error: ${error.message}`);
    isConnecting = false;
    
    // If running in development/test and primary fails (e.g. Atlas DNS/network offline), attempt local fallback
    if (process.env.NODE_ENV !== 'production' && primaryUri !== fallbackUri) {
      console.log(`Attempting fallback database connection to: ${fallbackUri}...`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri, mongooseOptions);
        console.log(`MongoDB Connected (Fallback): ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
        return fallbackConn;
      } catch (fallbackErr) {
        console.error(`Fallback database connection failed: ${fallbackErr.message}`);
        scheduleReconnect(5000);
      }
    } else {
      console.warn('⚠️ Server will stay alive to allow healthcheck reporting while MongoDB recovers.');
      scheduleReconnect(5000);
    }
    return null;
  }
};

module.exports = connectDB;
