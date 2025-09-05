import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { PrismaClient } from '@prisma/client';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const __dirname = path.resolve();

// ✅ Connect to PostgreSQL with Prisma
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL with Prisma");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
})();

app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// ✅ Serve frontend (for production build)
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ✅ Error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
