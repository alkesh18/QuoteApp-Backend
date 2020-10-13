const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    franchiseeId: Number,
    client: {
        cName: String,
        cAddress: String,
        cCity: String,
        cPhoneNum: String,
        cEmail: String
    },
    services: [{
        selectedService: String,
        description: String,
        materialCost: String,
        hoursRequired: String,
        totalCost: String
    }],
    total: String
});

module.exports = mongoose.model('Quote', quoteSchema);