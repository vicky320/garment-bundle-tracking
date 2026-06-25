const Stock = require('../models/Stock');

async function getStock() {
    return Stock.find().populate({ path: 'bundle', populate: { path: 'style' } }).sort({ createdAt: -1 });
}

module.exports = { getStock };
