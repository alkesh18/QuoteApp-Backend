require('dotenv').config()
const mongoose = require("mongoose");
const user = require('../models/user');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { update } = require('../models/user');

class UserController {
  getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find().select({ password: 0 });
      if (!!users) {
        res.status(200).json({
          users
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  };

  getAllOtherUsers = async (req, res, next) => {
    try {
      const uName = req.body.params.username;
      console.log(uName);
      const users = await User.find({ $nor: [{username: uName}, {active: false}]}).select({ password: 0 });
      //console.log(users)
      if (!!users) {
        res.status(200).json({
          users
        });
      } else {
        res.status(404).json({msg: "username no found"})
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  };

  getPrevId = async (req, res, next) => {
    try {
      const users = await User.find().select({ password: 0 }).sort({ _id: -1 }).limit(1);
      if (!!users) {
        res.status(200).json({
          franchiseeId: users[0].franchiseeId
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }

  }

  signUp = async (req, res, next) => {
    try {
      if (!req.body.params.username || !req.body.params.password) {
        return res.status(400).json({
          msg: "Please enter a username and password",
        });
      }

      const username = req.body.params.username;
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ msg: "The user already exists" });

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.params.username,
        password: req.body.params.password,
        franchiseeId: req.body.params.franchiseeId,
        admin: req.body.params.admin,
        active: req.body.params.active,
        name: req.body.params.name,
        email: req.body.params.email
      });

      const result = await user.save();
      return result;
      //res.status(200).json(result);
    } catch (err) {
      res.status(500).json({
        error: err,
      });
    }
  };

  login = async (req, res, next) => {
    try {
      console.log(req.body);
      if (!req.body.params.username || !req.body.params.password) {
        return res.status(400).json({
          message: "Please enter a username and password",
        });
      }

      const username = req.body.params.username;
      const password = req.body.params.password;
      const user = await User.findOne({ username });
      if (user) {
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch && user.active) {
            res.status(200).json({
              id: user._id,
              username: user.username,
              franchiseeId: user.franchiseeId,
              name: user.name,
              email: user.email,
              admin: user.admin,
              active: user.active,
              isAuthenticated: true,
            });
          } else {
            res
              .status(404)
              .json({ message: "Invalid credentials or user inactive." });
          }
        });
      } else {
        res.status(404).json({ message: "Invalid username" });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const userId = req.body.params.userId;
      const updateOps = {};

      for (const ops of req.body.params.operations) {
        updateOps[ops.propName] = ops.value;
      }

      console.log(updateOps);
      if(updateOps.password != undefined && updateOps.password != "" && updateOps.password != null) {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) return next(err);
          bcrypt.hash(updateOps.password, salt, async function (err, hash) {
            if (err) return next(err);
            updateOps.password = hash;
            console.log("inner", updateOps.password);
            let result = await User.update({ _id: userId }, { $set: updateOps });
            if (result) res.status(200).json(result);
          });
        });
        
      } else {
        let result = await User.update({ _id: userId }, { $set: updateOps });
        if (result) res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  disableUser = async (req, res, next) => {
    try {
      const username = req.body.params.username;
      console.log(req.body);
      const user = await User.findOne({ username });

      if (user) {
        user.active = false;
        await user.save();
        res.status(200).json({
          message: "User was disabled",
          active: user.active,
        });
      } else {
        res.status(404).json({ message: "Cannot find user" });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const username = req.body.params.username; 
      const user = await User.findOneAndDelete({ username });
      if(user) {
        res.status(200).json({
          message: "User was deleted"
        });
      } else {
        res.status(404).json({ message: "User was not deleted." });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

}

module.exports = UserController;