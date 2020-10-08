const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Quote = require('../models/quote');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /quotes'
    });
});

// CHANGE franchiseeid after we create franchisees
router.post('/', (req, res, next) => {
    const quote = new Quote({
        _id: new mongoose.Types.ObjectId(),
        franchiseeId: 1,
        client: req.body.client,
        services: req.body.services
    });
    quote
        .save()
        .then(result => console.log(result))
        .catch(err => console.log(err));
    res.status(200).json({
        message: 'Handling POST requests to /quotes',
        quote: quote
    });
});

router.get('/:quoteId', (req, res, next) => {
    res.status(200).json({
        message: 'You passed a quoteId',
        id: req.params.quoteId
    });
});

// could be trouble
// router.get('/byFranchisee/:franchiseeId', (req, res, next) => {
//     res.status(200).json({
//         message: 'You passed a franchiseeId',
//         id: req.params.byFranchisee.franchiseeId
//     });
// });

router.patch('/:quoteId', (req, res, next) => {
    res.status(200).json({
        message: "Updated quote"
    })
});

// Do not use this 
router.delete('/:quoteId', (req, res, next) => {
    res.status(200).json({
        message: "Deleted quote"
    })
});

module.exports = router;