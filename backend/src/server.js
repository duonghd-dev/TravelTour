import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { default: app } = await import('./app.js');
const { connectDB } = await import('./config/database.js');
const SocketHandler = await import('./config/socket.js').then((m) => m.default);
const migratePaymentStatus =
  await import('./migrations/addPaymentStatusToBookings.migration.js').then(
    (m) => m.default
  );

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Run migration
  try {
    await migratePaymentStatus();
  } catch (error) {
    console.error('Migration failed:', error);
  }

  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:5173',
          'http://localhost:5174',
          'http://localhost:5175',
          process.env.FRONTEND_URL,
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    },
  });

  const socketHandler = new SocketHandler(io);

  app.io = io;
  app.socketHandler = socketHandler;

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
