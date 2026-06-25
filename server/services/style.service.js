const Style = require('../models/Style');

async function createStyle(data) {
    const style = await Style.create(data);
    return style;
}

async function getStyles() {
    return Style.find().sort({ createdAt: -1 });
}

module.exports = { createStyle, getStyles };
