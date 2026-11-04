import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: '7d' }
  );
};

// ── REGISTER (Customer) ───────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check if user exists
    const [[existing]] = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [full_name.trim(), email.trim().toLowerCase(), password_hash, 'customer']
    );

    const user = {
      id: result.insertId,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      role: 'customer',
    };

    const token = generateToken(user);
    res.status(201).json({ message: 'Registration successful!', token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN (Customer & Admin) ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check hardcoded admin credentials first
    if (cleanEmail === 'admin@skincare.com' && password === 'admin123') {
      const adminUser = {
        id: 0,
        full_name: 'Store Administrator',
        email: 'admin@skincare.com',
        role: 'admin',
      };
      const token = generateToken(adminUser);
      return res.json({ message: 'Admin login successful', token, user: adminUser });
    }

    // Check database users
    const [[user]] = await pool.query(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE LOWER(email) = LOWER(?)',
      [cleanEmail]
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password (bcrypt or fallback)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } catch {
      isMatch = false;
    }

    // If hashed match failed, check direct match for legacy passwords
    if (!isMatch && password === user.password_hash) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(safeUser);
    res.json({ message: 'Login successful!', token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

