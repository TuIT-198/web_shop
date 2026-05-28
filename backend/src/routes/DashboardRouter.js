const express = require("express");
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.get('/stats', authMiddleWare, DashboardController.getStatistics);
router.get('/revenue', authMiddleWare, DashboardController.getRevenueByMonth);
router.get('/orders-status', authMiddleWare, DashboardController.getOrdersByStatus);

module.exports = router;
