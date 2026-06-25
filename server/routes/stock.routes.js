const express = require('express');
const router = express.Router();
const { listStock } = require('../controllers/stock.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', authenticate, requireRole(['manager']), listStock);

module.exports = router;
