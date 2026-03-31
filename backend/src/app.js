const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const productRoutes = require('./routers/productRoutes');
const authRoutes = require('./routers/authRoutes');

// Use routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;