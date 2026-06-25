const express = require('express');
const router = express.Router();
const { listStyles, createStyleHandler } = require('../controllers/style.controller');
const validate = require('../middlewares/validate.middleware');
const { createStyleSchema } = require('../validations/style.validation');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', authenticate, listStyles);
router.post('/', authenticate, requireRole(['manager']), validate(createStyleSchema), createStyleHandler);

module.exports = router;
