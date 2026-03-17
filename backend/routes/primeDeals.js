const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken } = require('./products');

// GET /prime-deals
router.get('/prime-deals', authenticateToken, async (req, res) => {
  try {
    const primeDeals = await Product.find({ is_prime_deal: true }).limit(5);
    
    // Check user info if needed for specific logic.
    // The frontend typically shows 'Exclusive Prime Deals' if JWT is valid.
    
    res.json({ prime_deals: primeDeals });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error_msg: "Server Error" });
  }
});

module.exports = router;
