require('dotenv').config()
const mongoose = require("mongoose");
const User = require("../models/user");

class UserController {
  getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find().select({ password: 0 });
      if (!!users) {
        res.status(200).json({
          count: users.length,
          users: users
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    }
  };

  signUp = async (req, res, next) => {
    try {
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({
          msg: "Please enter a username and password",
        });
      }

      const username = req.body.username;
      const existingUser = await User.findOne({ username });
      if (existingUser)
        return res.status(400).json({ msg: "The user already exists" });

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        franchiseeId: req.body.franchiseeId,
        admin: req.body.admin,
        active: req.body.active,
        name: req.body.name,
        email: req.body.email
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
          msg: "Please enter a username and password",
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
      const userId = req.body.userId;
      const updateOps = {};

      for (const ops of req.body.operations) {
        updateOps[ops.propName] = ops.value;
      }

      const result = User.update({ _id: userId }, { $set: updateOps });
      if (result) res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  };

  disableUser = async (req, res, next) => {
    try {
      const username = req.body.username;
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
      const username = req.body.username; 
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