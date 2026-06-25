const Bundle = require('../models/Bundle');
const Style = require('../models/Style');
const StageHistory = require('../models/StageHistory');

const NEXT_STAGE = {
    Cutting: 'Stitching',
    Stitching: 'Finishing',
    Finishing: 'Packing',
    Packing: 'Factory Store',
    'Factory Store': 'Dispatch',
};

async function createBundle(data) {
    const style = await Style.findById(data.style);
    if (!style) {
        throw new Error('Style not found');
    }

    const bundle = await Bundle.create({
        bundleCode: data.bundleCode,
        style: style._id,
        quantity: data.quantity,
        currentStage: data.currentStage || 'Cutting',
    });
    return bundle;
}

async function getBundles() {
    return Bundle.find().populate('style').sort({ createdAt: -1 });
}

async function getBundleByCode(bundleCode) {
    return Bundle.findOne({ bundleCode }).populate('style');
}

async function advanceBundleStage(bundleId, operatorId, operatorRole) {
    const bundle = await Bundle.findById(bundleId);
    if (!bundle) {
        const error = new Error('Bundle not found');
        error.status = 404;
        throw error;
    }

    const nextStage = NEXT_STAGE[bundle.currentStage];
    if (!nextStage) {
        const error = new Error('Bundle cannot be advanced from current stage');
        error.status = 400;
        throw error;
    }

    if (operatorRole === 'operator' && nextStage === 'Dispatch') {
        const error = new Error('Operators can advance bundles only up to Factory Store. Dispatch must be handled by a manager.');
        error.status = 403;
        throw error;
    }

    const fromStage = bundle.currentStage;
    bundle.currentStage = nextStage;
    await bundle.save();

    await StageHistory.create({
        bundle: bundle._id,
        operator: operatorId,
        fromStage,
        toStage: nextStage,
    });

    return bundle;
}

module.exports = { createBundle, getBundles, getBundleByCode, advanceBundleStage };
