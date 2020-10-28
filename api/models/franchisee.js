const mongoose = require('mongoose');

const franchiseeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    franchiseeId: {type: Number, required: true },
    name: {type: String, required: true },
    email: {type: String, required: true },
    // username: {type: String, ref: 'User', required: true },
    active: {type: Boolean, required: true}
});

module.exports = mongoose.model('Franchisee', franchiseeSchema);