const express = require('express')
const jwt = require('jsonwebtoken')
const Product = require('../models/Product')

const router = express.Router()

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    res.status(401).json({error_msg: 'Invalid JWT Token'})
    return
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'supersecretjwtkey_12345',
    (err, user) => {
      if (err) {
        res.status(401).json({error_msg: 'Invalid JWT Token'})
        return
      }
      req.user = user
      next()
    },
  )
}

// GET /products
router.get('/products', authenticateToken, async (req, res) => {
  try {
    const {
      category,
      title_search: titleSearch,
      rating,
      sort_by: sortBy,
    } = req.query

    const query = {}

    if (category) {
      query.category = category
    }

    if (titleSearch) {
      query.title = {$regex: titleSearch, $options: 'i'}
    }

    if (rating) {
      query.rating = {$gte: parseFloat(rating)}
    }

    const sortOption = {}
    if (sortBy === 'PRICE_HIGH') {
      sortOption.price = -1
    } else if (sortBy === 'PRICE_LOW') {
      sortOption.price = 1
    }

    const products = await Product.find(query).sort(sortOption)

    res.json({products, total: products.length})
  } catch (err) {
    console.error(err.message)
    res.status(500).json({error_msg: 'Server Error'})
  }
})

// GET /products/:id
router.get('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findOne({id: req.params.id})

    if (!product) {
      res.status(404).json({error_msg: 'Product Not Found'})
      return
    }

    // Find similar products based on the same category
    const similarProducts = await Product.find({
      category: product.category,
      id: {$ne: product.id},
    }).limit(5)

    const productResponse = product.toObject()
    productResponse.similar_products = similarProducts

    res.json(productResponse)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({error_msg: 'Server Error'})
  }
})

module.exports = router
module.exports.authenticateToken = authenticateToken // Exporting for reuse if needed
