const Quote = require("../models/quote");
const mongoose = require("mongoose");

class QuoteController {
  getAllQuotes = async (req, res, next) => {
    try {
      const quotes = await Quote.find().sort({ _id: -1 }).limit(5);
      if (quotes)
        return res.status(200).json({
          quotes: quotes,
        });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  };

  createQuote = async (req, res, next) => {
    try {
      console.log(req.body);
      const clientInfo = req.body.params.clientInfo;
      const serviceInfo = req.body.params.serviceInfo;
      const total = req.body.params.total;
      if (clientInfo && serviceInfo && total) {
        const quote = new Quote({
          _id: new mongoose.Types.ObjectId(),
          franchiseeId: 1,
          client: req.body.params.clientInfo,
          services: req.body.params.serviceInfo,
          total: req.body.params.total,
        });
        const result = await quote.save();
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ error: err,
      msg: "create quote failed" });
    }
  };

  selectQuote = async (req, res, next) => {
    try {
      const quoteId = req.body.params.quoteId;
      const quote = await Quote.findById(quoteId);
      return quote
        ? res.status(200).json(quote)
        : res.status(404).json({
            message: `No record with id = ${quoteId} is found.`,
          });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  selectQuoteByFranchisee = async (req, res, next) => {
    try {
      const franchiseeId = req.body.params;
      console.log("body", req.body);
      const quotes = await Quote.find({ franchiseeId });
      console.log(quotes);
      return quotes
        ? res.status(200).json(quotes)
        : res.status(404).json({
            message: `No record for franchisee is found.`,
          });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  updateQuote = async (req, res, next) => {
    try {
      const quoteId = req.body.params.quoteId;
      const updateOps = {};
      for (const ops of req.body.params.operations) {
        updateOps[ops.propName] = ops.value;
      }
      const result = await Quote.update({ _id: quoteId }, { $set: updateOps });
      return result
        ? res.status(200).json(result)
        : res.status(404).json({
            message: `No record with id = ${quoteId} is found.`,
          });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  deleteQuote = async (req, res, next) => {
    try {
      const quoteId = req.body.params.quoteId;
      const result = await Quote.remove({ _id: quoteId });
      return result
        ? res.status(200).json(result)
        : res.status(404).json({
            message: `No record with id = ${quoteId} is found.`,
          });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };
}

module.exports = QuoteController;