const express = require('express');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const { getDashboard } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/', authenticate, requireRole(['manager']), getDashboard);

module.exports = router;
