import express from 'express';
import pool from './db.js';

const router = express.Router();

// ── GET Logged-in Customer Orders ─────────────────────────────────────────────
router.get('/orders', async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    const userEmail = req.user?.email || '';

    const [orders] = await pool.query(
      `SELECT o.id, o.user_id, o.customer_name, o.customer_email, o.phone,
              o.shipping_address, o.city, o.total_amount, o.payment_method,
              o.payment_status, o.order_status, o.created_at, o.updated_at,
              GROUP_CONCAT(CONCAT(oi.product_name, ' (x', oi.quantity, ')') SEPARATOR ', ') AS items_summary
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE (o.user_id = ? AND ? > 0) OR LOWER(o.customer_email) = LOWER(?)
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId, userId, userEmail]
    );

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ── GET Specific Order with items for logged in customer ─────────────────────
router.get('/orders/:id', async (req, res) => {
  try {
    const userId = req.user?.id || 0;
    const userEmail = req.user?.email || '';
    const orderId = req.params.id;

    const [[order]] = await pool.query(
      `SELECT * FROM orders
       WHERE id = ? AND ((user_id = ? AND ? > 0) OR LOWER(customer_email) = LOWER(?))`,
      [orderId, userId, userId, userEmail]
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const [items] = await pool.query(
      'SELECT id, product_name, unit_price, quantity, subtotal FROM order_items WHERE order_id = ?',
      [orderId]
    );

    res.json({ ...order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ── GET Customer Profile ──────────────────────────────────────────────────────
router.get('/profile', async (req, res) => {
  res.json({ user: req.user });
});

export default router;

