const express = require('express');
const app = express();

const quoteRoutes = require('./api/routes/quotes');

/* Middleware ============================================= */
// Add to here as you add more endpoints
app.use('/quotes', quoteRoutes);

module.exports = app;