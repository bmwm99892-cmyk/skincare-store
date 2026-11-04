import express from 'express';
import pool from './db.js';

const router = express.Router();

// ─── OVERVIEW / STATS ────────────────────────────────────────────────────────
router.get('/overview', async (_req, res) => {
  try {
    const [[{ totalProducts }]]  = await pool.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalOrders }]]    = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalUsers }]]     = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalCategories }]]= await pool.query('SELECT COUNT(*) AS totalCategories FROM categories');
    const [[{ totalRevenue }]]   = await pool.query("SELECT COALESCE(SUM(total_amount),0) AS totalRevenue FROM orders WHERE payment_status='paid'");
    const [[{ pendingOrders }]]  = await pool.query("SELECT COUNT(*) AS pendingOrders FROM orders WHERE order_status='pending'");
    const [recentOrders]         = await pool.query(
      'SELECT id, customer_name, total_amount, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 5'
    );
    res.json({ totalProducts, totalOrders, totalUsers, totalCategories, totalRevenue, pendingOrders, recentOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
router.get('/products', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.slug, p.description, p.price, p.image_url,
              p.stock_quantity, p.is_active, p.created_at,
              c.name AS category_name, c.id AS category_id
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const { name, slug, description, price, image_url, stock_quantity, is_active, category_id } = req.body;
    if (!name || !slug || !description || !price || !category_id)
      return res.status(400).json({ message: 'name, slug, description, price, category_id are required' });
    const [result] = await pool.query(
      'INSERT INTO products (name, slug, description, price, image_url, stock_quantity, is_active, category_id) VALUES (?,?,?,?,?,?,?,?)',
      [name, slug, description, price, image_url || null, stock_quantity ?? 0, is_active ?? 1, category_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const { name, slug, description, price, image_url, stock_quantity, is_active, category_id } = req.body;
    await pool.query(
      'UPDATE products SET name=?, slug=?, description=?, price=?, image_url=?, stock_quantity=?, is_active=?, category_id=? WHERE id=?',
      [name, slug, description, price, image_url, stock_quantity, is_active, category_id, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
router.get('/categories', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       GROUP BY c.id ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) return res.status(400).json({ message: 'name and slug required' });
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES (?,?,?)',
      [name, slug, description || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Category created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    await pool.query('UPDATE categories SET name=?, slug=?, description=? WHERE id=?',
      [name, slug, description, req.params.id]);
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id=?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────
router.get('/orders', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.*, GROUP_CONCAT(CONCAT(oi.product_name,' x',oi.quantity) SEPARATOR ', ') AS items_summary
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const [[order]] = await pool.query('SELECT * FROM orders WHERE id=?', [req.params.id]);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id=?', [req.params.id]);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    await pool.query('UPDATE orders SET order_status=?, payment_status=? WHERE id=?',
      [order_status, payment_status, req.params.id]);
    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CUSTOMERS / USERS ───────────────────────────────────────────────────────
router.get('/customers', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.role, u.created_at,
              COUNT(o.id) AS order_count,
              COALESCE(SUM(o.total_amount),0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       GROUP BY u.id ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/customers', async (req, res) => {
  try {
    const bcrypt = await import('bcryptjs').catch(() => null);
    const { full_name, email, password, role } = req.body;
    if (!full_name || !email || !password) return res.status(400).json({ message: 'full_name, email, password required' });
    const password_hash = bcrypt ? await bcrypt.default.hash(password, 10) : password;
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?,?,?,?)',
      [full_name, email, password_hash, role || 'customer']
    );
    res.status(201).json({ id: result.insertId, message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/customers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

