const { createStyle, getStyles } = require('../services/style.service');

async function listStyles(req, res, next) {
    try {
        const styles = await getStyles();
        res.json(styles);
    } catch (error) {
        next(error);
    }
}

async function createStyleHandler(req, res, next) {
    try {
        const style = await createStyle(req.body);
        res.status(201).json(style);
    } catch (error) {
        next(error);
    }
}

module.exports = { listStyles, createStyleHandler };
