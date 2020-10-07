const express = require('express');
const app = express();
const morgan = require('morgan');

const quoteRoutes = require('./api/routes/quotes');

app.use(morgan('dev'));

/* Middleware - Routes ============================================= */
app.use('/quotes', quoteRoutes);

/* Error Handling ================================================== */
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;