const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    bundle: { type: mongoose.Schema.Types.ObjectId, ref: 'Bundle', required: true },
    quantity: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, enum: ['Factory Store', 'Dispatch'] },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Stock', stockSchema);
