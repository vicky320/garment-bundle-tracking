const { getStageHistory } = require('../services/history.service');

async function listHistory(req, res, next) {
    try {
        const history = await getStageHistory();
        res.json(history);
    } catch (error) {
        next(error);
    }
}

module.exports = { listHistory };
