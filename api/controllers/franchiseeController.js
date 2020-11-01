const mongoose = require("mongoose");
const Franchisee = require("../models/franchisee");
const User = require("../models/user");

class FranchiseeController {
  getAllFranchisees = async function (req, res, next) {
    try {
      const franchisees = await Franchisee.find();
      if (!!franchisees) {
        res.status(200).json({
          count: franchisees.length,
          franchisees: franchisees,
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  createFranchisee = async function (req, res, next) {
    try {
      const username = req.body.username;
      const user = await User.find({ username });
      const franchisee = new Franchisee({
        _id: new mongoose.Types.ObjectId(),
        franchiseeId: req.body.franchiseeId,
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
      });
      const result = await franchisee.save();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  selectFranchisee = async function (req, res, next) {
    try {
      const franchiseeId = req.body.franchiseeId;
      const franchisee = await Franchisee.findById(franchiseeId);
      return franchisee
        ? res.status(200).json(franchisee)
        : res.status(404).json({
            message: `No record with id = ${franchiseeId} is found.`,
          });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  updateFranchisee = async function (req, res, next) {
    try {
      const franchiseeId = req.body.franchiseeId;
      const updateOps = {};
      for (const ops of req.body.operations) {
        updateOps[ops.propName] = ops.value;
      }
      const result = await Franchisee.update(
        { _id: franchiseeId },
        { $set: updateOps }
      );
      if (result) res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  deleteFranchisee = async function (req, res, next) {
    try {
      const franchiseeId = req.body.franchiseeId;
      const result = await Franchisee.remove({ franchiseeId: franchiseeId });
      if (result) res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };
}

module.exports = FranchiseeController;
