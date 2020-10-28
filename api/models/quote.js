const mongoose = require('mongoose');

const quoteSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    franchiseeId: {type: Number, ref: 'Franchisee', required: true },
    client: {
        cName: {type: String, required: true },
        cAddress: {type: String, required: true },
        cCity: {type: String, required: true },
        cPhoneNum: {type: String, required: true },
        cEmail: {type: String, required: true },
    },
    services: [{
        selectedService: {type: String, required: true },
        description: {type: String, required: true },
        materialCost: {type: String, required: true },
        hoursRequired: {type: String, required: true },
        totalCost: {type: String, required: true }
    }],
    total: {type: String, required: true }
});

module.exports = mongoose.model('Quote', quoteSchema);