const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Quote = require("../models/quote");

// Return all quotes
router.get("/", async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ _id: -1 }).limit(5);
    if (quotes) res.status(200).json({
      count: quotes.length,
      quotes: quotes
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Create a quote
// CHANGE franchiseeid after we create franchisees
router.post("/", async (req, res, next) => {
  try {
    const clientInfo = req.body.clientInfo;
    const serviceInfo = req.body.serviceInfo;
    const total = req.body.total;
    if (clientInfo && serviceInfo && total) {
      const quote = new Quote({
        _id: new mongoose.Types.ObjectId(),
        franchiseeId: 1,
        client: req.body.params.clientInfo,
        services: req.body.params.serviceInfo,
        total: req.body.params.total,
      });
      await quote.save();
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/selectQuote", async(req, res, next) => {
  try {
    const quoteId = req.body.params.quoteId;
    const quote = await Quote.findById(quoteId);
    return quote
      ? res.status(200).json(quote)
      : res.status(404).json({
          message: `No record with id = ${quoteId} is found.`
        });
  } catch (err) {
    res.status(500).json({ error: err });
  }
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
router.patch("/updateQuote", async(req, res, next) => {
  try {
    const quoteId = req.body.quoteId;
    const updateOps = {};
    for (const ops of req.body.operations) {
      updateOps[ops.propName] = ops.value;
    }
    const result = await Quote.update({ _id: quoteId }, { $set: updateOps });
    return result
      ? res.status(200).json(result)
      : res.status(404).json({
        message: `No record with id = ${quoteId} is found.`
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/deleteQuote", async(req, res, next) => {
  try {
    const quoteId = req.body.quoteId;
    const result = await Quote.remove({ _id: quoteId });
    return result
      ? res.status(200).json(result)
      : res.status(404).json({
        message: `No record with id = ${quoteId} is found.`
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

/* NEED TO FIGURE OUT HOW TO RETREIVE ALL QUOTES BY SPECIFIC FRANCHISEE*/
// router.get('/byFranchisee/:franchiseeId', (req, res, next) => {
//     res.status(200).json({
//         message: 'You passed a franchiseeId',
//         id: req.params.byFranchisee.franchiseeId
//     });
// });

module.exports = router;
