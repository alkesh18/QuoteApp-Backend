require('dotenv').config()
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport	= require('passport');

const quoteRoutes = require('./api/routes/quotes');
const franchiseeRoutes = require('./api/routes/franchisee');
const authRoutes = require('./api/routes/user');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eesew.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(url, 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

/* Middleware ========================================================================================================== */
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
const passportMiddleware = require("./api/middleware/passport");
passport.use(passportMiddleware);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, GET, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

/*  Routes ============================================================================================================= */
// All api paths will be this and the associated endpoint in route file.
// Ex. url.com/quotes/updateQuote
app.use('/quotes', quoteRoutes);
app.use('/franchisee', franchiseeRoutes);
app.use('/user', authRoutes);

/* Error Handling ====================================================================================================== */
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