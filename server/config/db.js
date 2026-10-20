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
  const fallbackUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27018/lms_test';

  const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 50, // Keep socket pool ready for simultaneous student test submissions
    minPoolSize: 5,  // Maintain warm connection pool to eliminate socket spin-up latency
    socketTimeoutMS: 45000, // Prevent hanging sockets on network drops
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
