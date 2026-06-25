const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
    bundleCode: { type: String, required: true, unique: true, trim: true },
    style: { type: mongoose.Schema.Types.ObjectId, ref: 'Style', required: true },
    quantity: { type: Number, required: true, min: 1 },
    currentStage: {
        type: String,
        required: true,
        enum: ['Cutting', 'Stitching', 'Finishing', 'Packing', 'Factory Store', 'Dispatch'],
        default: 'Cutting',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Bundle', bundleSchema);
