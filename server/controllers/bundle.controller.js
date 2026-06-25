const { createBundle, getBundles, advanceBundleStage } = require('../services/bundle.service');

async function listBundles(req, res, next) {
    try {
        const bundles = await getBundles();
        res.json(bundles);
    } catch (error) {
        next(error);
    }
}

async function createBundleHandler(req, res, next) {
    try {
        const bundle = await createBundle(req.body);
        res.status(201).json(bundle);
    } catch (error) {
        next(error);
    }
}

async function advanceBundleHandler(req, res, next) {
    try {
        const bundle = await advanceBundleStage(req.params.id, req.user._id);
        res.json(bundle);
    } catch (error) {
        next(error);
    }
}

module.exports = { listBundles, createBundleHandler, advanceBundleHandler };
