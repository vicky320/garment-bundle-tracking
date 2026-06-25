const { z } = require('zod');

const createStyleSchema = z.object({
    sku: z.string().min(2),
    styleName: z.string().min(2),
    description: z.string().optional(),
});

module.exports = { createStyleSchema };
