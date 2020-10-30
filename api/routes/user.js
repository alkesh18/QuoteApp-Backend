const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const passport = require("passport");

const User = require("../models/user");

// Return all users
router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          count: result.length,
          result: result,
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

// Create a user
router.post("/signup", (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .json({ msg: "Please enter a username and password" });
  }
  const username = req.body.username;
  User.findOne({ username })
    .exec()
    .then((data) => {
      if (data) res.status(400).json({ msg: "The user already exists" });
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        franchiseeId: req.body.franchiseeId,
        role: req.body.role,
        active: req.body.active,
      });
      return user.save();
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

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .exec()
    .then((user) => {
      if (user) {
        user.comparePassword(password, (err, isMatch) => {
          if (isMatch && user.active) {
            res.status(200).json({
              id: user._id,
              username: user.username,
              franchiseeId: user.franchiseeId,
              role: user.role,
              active: user.active,
              token: createToken(user)
            });
          } else {
            res.status(404).json({
              message: "Invalid credentials or user inactive.",
              error: err,
            });
          }
        });
      } else {
        res.status(500).json({ message: "Invalid username", error: err });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/* Example body to send to update client name:
{
    "userId": <replace with id>,
    "operations": [
        {
            "propName": "name",
            "value": "Updated name"
        }
    ]
}
*/

router.patch("/updateUser", (req, res, next) => {
  const userId = req.body.userId;
  const updateOps = {};
  for (const ops of req.body.operations) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: userId }, { $set: updateOps })
    .exec()
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/disableUser", passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const username = req.body.username;
  User.findOne({ username }, (err, user) => {
    if (user) {
      user.active = false;
      user.save();
    } else {
      res.status(404).json({
        message: "Cannot find user.",
        error: err,
      });
    }
  })
    .then((user) =>
      res.status(200).json({
        message: "User was disabled",
        active: user.active,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // User.remove({ _id: userId })
  //   .exec()
  //   .then((result) => {
  //     res.status(200).json(result);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: err,
  //     });
  //   });
});

let createToken = function(user) {
  return jwt.sign({ id: user._id, role: user.role }, "test123", {
    expiresIn: 300 
  });
}

module.exports = router;
