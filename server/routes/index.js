const express = require('express');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const styleRoutes = require('./style.routes');
const bundleRoutes = require('./bundle.routes');
const stockRoutes = require('./stock.routes');
const historyRoutes = require('./history.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/styles', styleRoutes);
router.use('/bundles', bundleRoutes);
router.use('/stock', stockRoutes);
router.use('/history', historyRoutes);

module.exports = router;
