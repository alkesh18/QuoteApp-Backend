const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true },
    password: {type: String, required: true },
    role: {type: Stirng, required: true },
    active: {type: Boolean, required: true}
});

module.exports = mongoose.model('User', userSchema);