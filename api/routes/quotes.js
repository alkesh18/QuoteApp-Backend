const express = require("express");
const router = express.Router();

const Quote = require("../models/quote");
const QuoteController = require('../controllers/quoteController')
const controller = new QuoteController();

// Return all quotes
router.get("/", async(req, res, next) => controller.getAllQuotes(req, res, next));
// Create a quote
router.post("/", async(req, res, next) => controller.createQuote(req, res, next));
router.get("/selectQuote", async(req, res, next) => controller.selectQuote(req, res, next));
router.get("/selectQuoteByFranchisee", async(req, res, next) => controller.selectQuoteByFranchisee(req, res, next));

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
router.patch("/updateQuote", async(req, res, next) => controller.updateQuote(req, res, next));
router.delete("/deleteQuote", async(req, res, next) => controller.deleteQuote(req, res, next));

module.exports = router;