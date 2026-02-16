const router = require("express").Router();
const pool = require("../db");

// Create order
router.post("/", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    const order = await pool.query(
      "INSERT INTO orders (user_id, product_id, quantity) VALUES ($1,$2,$3) RETURNING *",
      [user_id, product_id, quantity]
    );
    res.json(order.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;