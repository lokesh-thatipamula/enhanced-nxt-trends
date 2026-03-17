require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(require('morgan')('dev'));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB successfully connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/products'));
app.use('/', require('./routes/primeDeals'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
