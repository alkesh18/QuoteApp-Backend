const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Quote = require('../models/quote');

router.get('/', (req, res, next) => {
    Quote.find()
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
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
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:quoteId', (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.findById(quoteId)
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'No record with that id is found.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:quoteId', (req, res, next) => {
    const quoteId = req.params.quoteId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Quote.update({ _id: quoteId }, { $set: updateOps })
        .exec()
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:quoteId', (req, res, next) => {
    const quoteId = req.params.quoteId;
    Quote.remove({ _id: quoteId })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

/* NEED TO FIGURE OUT HOW TO RETREIVE ALL QUOTES BY SPECIFIC FRANCHISEE*/
// router.get('/byFranchisee/:franchiseeId', (req, res, next) => {
//     res.status(200).json({
//         message: 'You passed a franchiseeId',
//         id: req.params.byFranchisee.franchiseeId
//     });
// });

module.exports = router;