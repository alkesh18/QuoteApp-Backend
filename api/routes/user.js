const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

// Return all users
router.get("/", (req, res, next) => {
  User.find()
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

// Create a user
router.post("/register", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: hash,
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

router.get("/login", (req, res, next) => {
  const userId = req.body.params.userId;
  User.findById(userId)
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).json({
          username: result.username,
          role: result.role,
          active: result.active,
        });
      } else {
        res
          .status(404)
          .json({ message: "No record with id = " + userId + "is found." });
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
  const userId = req.body.params.userId;
  const updateOps = {};
  for (const ops of req.body.params.operations) {
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

router.delete("/deleteUser", (req, res, next) => {
  const userId = req.body.userId;
  User.remove({ _id: userId })
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
