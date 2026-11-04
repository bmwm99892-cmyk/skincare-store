import express from 'express';
import pool from './db.js';

const router = express.Router();

/**
 * POST /api/orders
 * Body: {
 *   customer_name, customer_email, phone, shipping_address, city,
 *   payment_method ('cod'),
 *   items: [{ product_id, product_name, unit_price, quantity, subtotal }]
 * }
 */
router.post('/orders', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const {
      customer_name, customer_email, phone,
      shipping_address, city, payment_method = 'cod',
      user_id = null, items = [],
    } = req.body;

    // basic validation
    if (!customer_name || !customer_email || !phone || !shipping_address || !city)
      return res.status(400).json({ message: 'All delivery fields are required.' });
    if (!items.length)
      return res.status(400).json({ message: 'Cart is empty.' });

    const total_amount = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders
         (user_id, customer_name, customer_email, phone, shipping_address, city,
          total_amount, payment_method, payment_status, order_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [user_id, customer_name, customer_email, phone, shipping_address, city,
       total_amount, payment_method]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, unit_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id || null, item.product_name,
         item.unit_price, item.quantity, item.subtotal]
      );
      // decrement stock if product_id present
      if (item.product_id) {
        await conn.query(
          'UPDATE products SET stock_quantity = GREATEST(stock_quantity - ?, 0) WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }

    await conn.commit();
    res.status(201).json({
      success: true,
      order_id: orderId,
      message: 'Order placed successfully!',
      total_amount,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

export default router;

