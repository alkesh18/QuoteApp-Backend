const express = require("express");
const router = express.Router();
const FranchiseeController = require('../controllers/franchiseeController');
const controller = new FranchiseeController();

// Return all franchisees
router.get("/", async (req, res, next) => controller.getAllFranchisees(req, res, next));
// Create a franchisee
router.post("/", async (req, res, next) => controller.createFranchisee(req, res, next));
router.get("/selectFranchisee", async (req, res, next) => controller.selectFranchisee(req, res, next));

/* Example body to send to update client name:
{
    "franchiseeId": <replace with id>,
    "operations": [
        {
            "propName": "name",
            "value": "Updated name"
        }
    ]
}
*/
router.patch("/updateFranchisee", async(req, res, next) => controller.updateFranchisee(req, res, next));
router.delete("/deleteFranchisee", async(req, res, next) => controller.deleteFranchisee(req, res, next));

module.exports = router;
