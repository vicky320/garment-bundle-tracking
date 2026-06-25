const { z } = require('zod');

const createBundleSchema = z.object({
    bundleCode: z.string().min(2),
    style: z.string().min(1),
    quantity: z.number().int().positive(),
    currentStage: z.enum(['Cutting', 'Stitching', 'Finishing', 'Packing', 'Factory Store', 'Dispatch']).optional(),
});

module.exports = { createBundleSchema };
