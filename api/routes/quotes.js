const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /quotes'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling POST requests to /quotes'
    });
});

router.get('/:quoteId', (req, res, next) => {
    res.status(200).json({
        message: 'You passed a quoteId',
        id: req.params.quoteId
    });
});

router.get('/:franchiseeId', (req, res, next) => {
    res.status(200).json({
        message: 'You passed a franchiseeId',
        id: req.params.franchiseeId
    });
});

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