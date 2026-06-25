const mongoose = require('mongoose');

const stageHistorySchema = new mongoose.Schema({
    bundle: { type: mongoose.Schema.Types.ObjectId, ref: 'Bundle', required: true },
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromStage: { type: String, required: true },
    toStage: { type: String, required: true },
    note: { type: String, trim: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('StageHistory', stageHistorySchema);
