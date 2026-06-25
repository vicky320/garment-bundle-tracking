const mongoose = require('mongoose');

const styleSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true, trim: true },
    styleName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Style', styleSchema);
