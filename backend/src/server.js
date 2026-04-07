import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env TRƯỚC import app
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Dynamic import để đảm bảo .env được load trước
const { default: app } = await import('./app.js');
const { connectDB } = await import('./config/database.js');
const SocketHandler = await import('./config/socket.js').then((m) => m.default);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Create HTTP server for Socket.io
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

  // Initialize Socket.io handler
  const socketHandler = new SocketHandler(io);

  // Make io and socketHandler available on app
  app.io = io;
  app.socketHandler = socketHandler;

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
