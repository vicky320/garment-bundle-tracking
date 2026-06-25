const { getStock } = require('../services/stock.service');

async function listStock(req, res, next) {
    try {
        const stock = await getStock();
        res.json(stock);
    } catch (error) {
        next(error);
    }
}

module.exports = { listStock };
