const Quote = require("../models/quote");
const mongoose = require("mongoose");
const emailHelper = require("../helpers/email");

class QuoteController {
  getAllQuotes = async (req, res, next) => {
    try {
      const franchiseeId = req.url.toString();
      const urlParams = franchiseeId.split("=");
      console.log("req body", franchiseeId);
      const quotes = await Quote.find({franchiseeId: urlParams[1]}).sort({ _id: -1 }).limit(10);
      if (quotes)
        return res.status(200).json({
          quotes: quotes,
        });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  };
  getAllQuotesWithNoID = async (req, res, next) => {
    try {
      const quotes = await Quote.find().sort({ _id: -1 }).limit(100);
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
      const franchiseeId = req.body.params.franchiseeId;
      if (clientInfo && serviceInfo && total && franchiseeId) {
        const quote = new Quote({
          _id: new mongoose.Types.ObjectId(),
          franchiseeId: franchiseeId,
          client: req.body.params.clientInfo,
          services: req.body.params.serviceInfo,
          total: req.body.params.total,
        });
        const result = await quote.save();
        res.status(200).json(result);
        sendEmail(quote);
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
      /*const quoteId = req.url.toString();
      const urlParams = quoteId.split("=");
      */
      console.log(req.url.toString());
      const quoteId = req.url.toString();;
      const urlParams = quoteId.split("=");
      const result = await Quote.remove({ _id: urlParams[1] });
      console.log(result);
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

sendEmail = (quote) => {
  const email = new emailHelper;
  let clientEmail = quote.client.cEmail;
  let clientName = quote.client.cName;
  let services = quote.services
  let sevicesTotalCost = quote.total;

  email.sendEmail(clientEmail, clientName, services, sevicesTotalCost);
}

module.exports = QuoteController;