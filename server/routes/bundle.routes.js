const express = require('express');
const router = express.Router();
const { listBundles, createBundleHandler, getBundleByCodeHandler, advanceBundleHandler } = require('../controllers/bundle.controller');
const validate = require('../middlewares/validate.middleware');
const { createBundleSchema } = require('../validations/bundle.validation');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', authenticate, listBundles);
router.get('/code/:bundleCode', authenticate, getBundleByCodeHandler);
router.post('/', authenticate, requireRole(['manager']), validate(createBundleSchema), createBundleHandler);
router.patch('/:id/advance', authenticate, requireRole(['manager', 'operator']), advanceBundleHandler);

module.exports = router;
