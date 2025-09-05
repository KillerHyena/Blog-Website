import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url'; // Add this import
import { PrismaClient } from '@prisma/client';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';

dotenv.config();
const prisma = new PrismaClient();
const app = express();

// ✅ Get correct directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  
  // Check if the dist directory exists
  import('fs').then(fs => {
    if (fs.existsSync(clientDistPath)) {
      app.use(express.static(clientDistPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'));
      });
      console.log('✅ Serving static files from:', clientDistPath);
    } else {
      console.warn('⚠️  Client dist directory not found:', clientDistPath);
      console.warn('⚠️  Run "npm run build" in the client directory first');
    }
  }).catch(err => {
    console.error('❌ Error checking client dist directory:', err);
  });
} else {
  // In development, just provide a message
  app.get('*', (req, res) => {
    res.json({
      message: 'In development mode. Run the React dev server separately.',
      clientUrl: 'http://localhost:5173' // Default Vite port
    });
  });
}

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
  console.log(`📁 Current directory: ${__dirname}`);
});