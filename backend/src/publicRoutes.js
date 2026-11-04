import express from 'express';
import pool from './db.js';

const router = express.Router();

// ─── GET all active products (with optional category filter) ─────────────────
router.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT p.id, p.name, p.slug, p.description, p.price,
             p.image_url, p.stock_quantity, p.is_active,
             c.name AS category, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];
    if (category && category !== 'All') {
      query += ' AND c.name = ?';
      params.push(category);
    }
    query += ' ORDER BY p.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET single product by id or slug ────────────────────────────────────────
router.get('/products/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE (p.slug = ? OR p.id = ?) AND p.is_active = 1`,
      [req.params.slug, req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET all categories ───────────────────────────────────────────────────────
router.get('/categories', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.slug, c.description,
              COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

