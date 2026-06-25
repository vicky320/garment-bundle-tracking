const { createBundle, getBundles, getBundleByCode, advanceBundleStage } = require('../services/bundle.service');

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

async function getBundleByCodeHandler(req, res, next) {
    try {
        const bundle = await getBundleByCode(req.params.bundleCode);
        if (!bundle) {
            return res.status(404).json({ message: 'Bundle not found' });
        }
        res.json(bundle);
    } catch (error) {
        next(error);
    }
}

async function advanceBundleHandler(req, res, next) {
    try {
        const bundle = await advanceBundleStage(req.params.id, req.user._id, req.user.role);
        res.json(bundle);
    } catch (error) {
        next(error);
    }
}

module.exports = { listBundles, createBundleHandler, getBundleByCodeHandler, advanceBundleHandler };
