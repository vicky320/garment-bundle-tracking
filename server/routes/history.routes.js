const express = require('express');
const router = express.Router();
const { listHistory } = require('../controllers/history.controller');
const authenticate = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/', authenticate, requireRole(['manager']), listHistory);

module.exports = router;
