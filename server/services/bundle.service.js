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

async function advanceBundleStage(bundleId, operatorId) {
    const bundle = await Bundle.findById(bundleId);
    if (!bundle) {
        throw new Error('Bundle not found');
    }

    const nextStage = NEXT_STAGE[bundle.currentStage];
    if (!nextStage) {
        throw new Error('Bundle cannot be advanced from current stage');
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

module.exports = { createBundle, getBundles, advanceBundleStage };
