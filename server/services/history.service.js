const StageHistory = require('../models/StageHistory');

async function getStageHistory() {
    return StageHistory.find().populate('bundle operator').sort({ createdAt: -1 });
}

module.exports = { getStageHistory };
