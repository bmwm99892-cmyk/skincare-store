import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import adminRoutes from './adminRoutes.js';
import publicRoutes from './publicRoutes.js';
import orderRoutes from './orderRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import chatRoutes from './chatRoutes.js';

dotenv.config();

const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const app = express();

// CORS and JSON body parsing
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// ── JWT Middleware ──────────────────────────────────────────────────────────
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Skincare API is running' });
});

// ── Auth Routes (Register & Login) ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.post('/api/login', (req, res, next) => {
  // Backward compatibility forward to authRoutes
  req.url = '/login';
  authRoutes(req, res, next);
});

// ── Public Store Routes (Products, Categories, Tracking) ─────────────────────
app.use('/api', publicRoutes);

// ── Order Routes (Place Order) ───────────────────────────────────────────────
app.use('/api', orderRoutes);

// ── AI Skincare Assistant (Ollama) ───────────────────────────────────────────
app.use('/api/chat', chatRoutes);

// ── Protected Customer Routes (My Orders, Profile) ───────────────────────────
app.use('/api/user', verifyToken, userRoutes);

// ── Protected Admin Routes ──────────────────────────────────────────────────
app.use('/api/admin', verifyToken, adminRoutes);

export default app;
