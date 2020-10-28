const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

// Return all users
router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Create a user
router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        userId: 1,
        name: req.body.params.name,
        email: req.body.params.email,
        userid: req.body.params.userid
    });
    user
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/selectUser', (req, res, next) => {
    const userId = req.body.params.userId;
    User.findById(userId)
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'No record with id = ' + userId + 'is found.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
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
router.patch('/updateUser', (req, res, next) => {
    const userId = req.body.params.userId;
    const updateOps = {};
    for (const ops of req.body.params.operations) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: userId }, { $set: updateOps })
        .exec()
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/deleteUser', (req, res, next) => {
    const userId = req.body.userId;
    User.remove({ _id: userId })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;