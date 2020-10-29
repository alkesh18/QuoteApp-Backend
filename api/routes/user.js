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
router.post("/signup", (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
    active: req.body.active,
  });
  user
    .save()
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
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .exec()
    .then((user) => {
      if (user) {
        user.comparePassword(password,  (err, isMatch) => {
          if (isMatch) {
            console.log(`${user.username} authenicated`);
            if (user.active) {
              res.status(200).json({
                username: user.username,
                role: user.role,
                active: user.active,
                authenticated: true
              });
            } else {
              res.status(404).json({ message: "Inactive user", error: err });
            }
          } else {
            res
              .status(404)
              .json({ message: "Invalid credentials", error: err });
          }
        });
      } else {
        res.status(500).json({ message: "Invalid username" });
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
// router.patch("/updateUser", (req, res, next) => {
//   const userId = req.body.params.userId;
//   const updateOps = {};
//   for (const ops of req.body.params.operations) {
//     updateOps[ops.propName] = ops.value;
//   }
//   User.update({ _id: userId }, { $set: updateOps })
//     .exec()
//     .then((result) => res.status(200).json(result))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         error: err,
//       });
//     });
// });

router.patch("/disableUser", (req, res, next) => {
  const userId = req.body.userid;
  User.update({ _id: userId }, { $set: { active: false } })
    .exec()
    .then((result) =>
      res.status(200).json({
        message: "User was disabled",
        result: result,
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

module.exports = router;
