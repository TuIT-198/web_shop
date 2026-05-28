const DashboardService = require('../services/DashboardService')

const getStatistics = async (req, res) => {
    try {
        const response = await DashboardService.getStatistics()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e.message || e
        })
    }
}

const getRevenueByMonth = async (req, res) => {
    try {
        const response = await DashboardService.getRevenueByMonth()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e.message || e
        })
    }
}

const getOrdersByStatus = async (req, res) => {
    try {
        const response = await DashboardService.getOrdersByStatus()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e.message || e
        })
    }
}

module.exports = {
    getStatistics,
    getRevenueByMonth,
    getOrdersByStatus
}
