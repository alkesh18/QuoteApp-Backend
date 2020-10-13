const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Quote = require('../models/quote');

// Return all quotes
router.get('/', (req, res, next) => {
    Quote.find()
        .sort({ _id: -1 })
        .limit(3)
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

// Create a quote
// CHANGE franchiseeid after we create franchisees
router.post('/', (req, res, next) => {
    const quote = new Quote({
        _id: new mongoose.Types.ObjectId(),
        franchiseeId: 1,
        client: req.body.params.clientInfo,
        services: req.body.params.serviceInfo,
        total: req.body.params.total
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

router.get('/selectQuote', (req, res, next) => {
    const quoteId = req.body.params.quoteId;
    Quote.findById(quoteId)
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'No record with id = ' + quoteId + 'is found.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

/* Example body to send to update client name:
{
    "quoteId": <replace with id>,
    "operations": [
        {
            "propName": "client.cName",
            "value": "New Name Here"
        }
    ]
}
*/
router.patch('/updateQuote', (req, res, next) => {
    const quoteId = req.body.params.quoteId;
    const updateOps = {};
    for (const ops of req.body.params.operations) {
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

router.delete('/deleteQuote', (req, res, next) => {
    const quoteId = req.body.quoteId;
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