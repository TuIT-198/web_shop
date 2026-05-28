const { Order, User, Product } = require("../models");
const { Op } = require("sequelize");

const getStatistics = async () => {
    try {
        const totalUsers = await User.count();
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();
        
        const orders = await Order.findAll({
            where: {
                status: {
                    [Op.ne]: 'cancelled'
                }
            },
            attributes: ['totalPrice']
        });
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
            }
        };
    } catch (e) {
        throw e;
    }
};

const getRevenueByMonth = async () => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const orders = await Order.findAll({
            where: {
                status: {
                    [Op.ne]: 'cancelled'
                },
                createdAt: {
                    [Op.gte]: oneYearAgo
                }
            },
            attributes: ['totalPrice', 'createdAt'],
            order: [['createdAt', 'ASC']]
        });

        const revenueMap = {};
        
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            revenueMap[monthStr] = 0;
        }

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (revenueMap[monthStr] !== undefined) {
                revenueMap[monthStr] += Number(order.totalPrice) || 0;
            }
        });

        const data = Object.keys(revenueMap).map(month => ({
            month,
            revenue: revenueMap[month]
        }));

        return {
            status: 'OK',
            message: 'SUCCESS',
            data
        };
    } catch (e) {
        throw e;
    }
};

const getOrdersByStatus = async () => {
    try {
        const statuses = ['pending', 'paid', 'shipping', 'delivered', 'cancelled'];
        const data = [];
        
        for (const status of statuses) {
            const count = await Order.count({ where: { status } });
            const displayStatus = status === 'paid' ? 'confirmed' : status;
            data.push({ status: displayStatus, count });
        }

        return {
            status: 'OK',
            message: 'SUCCESS',
            data
        };
    } catch (e) {
        throw e;
    }
};

module.exports = {
    getStatistics,
    getRevenueByMonth,
    getOrdersByStatus
};
