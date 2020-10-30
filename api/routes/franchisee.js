const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport")

const Franchisee = require("../models/franchisee");
const User = require("../models/user");

// Return all franchisees
router.get("/", (req, res, next) => {
  Franchisee.find()
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Create a franchisee
router.post("/", (req, res, next) => {
  const username = req.body.params.username;
  User.find({ username })
    .then((user) => {
      const franchisee = new Franchisee({
        _id: new mongoose.Types.ObjectId(),
        franchiseeId: req.body.params.franchiseeId,
        name: req.body.params.name,
        email: req.body.params.email,
        username: req.body.params.username,
      });
      return franchisee.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/selectFranchisee", (req, res, next) => {
  const franchiseeId = req.body.params.franchiseeId;
  Franchisee.findById(franchiseeId)
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No record with id = " + franchiseeId + "is found.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

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
router.patch("/updateFranchisee", (req, res, next) => {
  const franchiseeId = req.body.params.franchiseeId;
  const updateOps = {};
  for (const ops of req.body.params.operations) {
    updateOps[ops.propName] = ops.value;
  }
  Franchisee.update({ _id: franchiseeId }, { $set: updateOps })
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/deleteFranchisee", (req, res, next) => {
  const franchiseeId = req.body.franchiseeId;
  Franchisee.remove({ franchiseeId: franchiseeId })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
