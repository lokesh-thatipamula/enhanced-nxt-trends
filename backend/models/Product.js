const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String, // Keeping frontend IDs as string for easy matching
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String,  // 1: Clothing, 2: Electronics, 3: Appliances, 4: Grocery, 5: Toys
    required: true
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  image_url: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    default: 'In Stock'
  },
  total_reviews: {
    type: Number,
    default: 0
  },
  is_prime_deal: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
