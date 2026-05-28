const { Order, OrderItem, ShippingAddress, Product } = require("../models");
const EmailService = require("../services/EmailService");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

const formatOrder = (order) => {
    if (!order) return null;
    const json = order.toJSON();
    
    // Map OrderItems back to original frontend JSONB structure
    const orderItems = (json.OrderItems || []).map(item => ({
        name: item.product?.name || '',
        image: item.product?.image || '',
        price: Number(item.unitPrice),
        amount: item.quantity,
        product: item.productId,
        discount: item.discount,
        countInstock: item.product?.countInStock || 0
    }));

    // Map ShippingAddress back to original frontend JSONB structure
    const shippingAddress = json.ShippingAddress ? {
        fullName: json.ShippingAddress.recipientName,
        phone: json.ShippingAddress.phone,
        address: json.ShippingAddress.detailAddress,
        city: json.ShippingAddress.province
    } : {};

    return {
        _id: json._id,
        orderItems,
        shippingAddress,
        paymentMethod: json.paymentMethod === 'cod' ? 'later_money' : json.paymentMethod,
        itemsPrice: Number(json.totalPrice) - Number(json.shippingPrice),
        shippingPrice: Number(json.shippingPrice),
        totalPrice: Number(json.totalPrice),
        user: json.userId,
        isPaid: json.paymentStatus === 'paid' || json.status === 'paid',
        paidAt: json.paidAt,
        isDelivered: json.status === 'delivered',
        deliveredAt: json.deliveredAt,
        status: json.status === 'paid' ? 'confirmed' : json.status, // Map 'paid' back to 'confirmed' for frontend UI mapping
        createdAt: json.createdAt,
        updatedAt: json.updatedAt
    };
};

const createOrder = async (newOrder) => {
    const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder;
    const t = await sequelize.transaction();
    try {
        const insufficientItems = [];
        for (const order of orderItems) {
            const productData = await Product.findOne({
                where: {
                    _id: order.product,
                    countInStock: { [Op.gte]: order.amount }
                },
                transaction: t
            });
            if (productData) {
                await productData.update({
                    countInStock: productData.countInStock - order.amount,
                    selled: (productData.selled || 0) + order.amount
                }, { transaction: t });
            } else {
                insufficientItems.push(order.product);
            }
        }

        if (insufficientItems.length) {
            await t.rollback();
            return {
                status: 'ERR',
                message: `Sản phẩm với id: ${insufficientItems.join(',')} không đủ hàng`
            };
        }

        const createdOrder = await Order.create({
            userId: user,
            status: isPaid ? 'paid' : 'pending',
            totalPrice: Number(totalPrice),
            paymentMethod: paymentMethod === 'later_money' ? 'cod' : paymentMethod,
            paymentStatus: isPaid ? 'paid' : 'unpaid',
            shippingMethod: 'FAST',
            shippingPrice: Number(shippingPrice),
            paidAt: isPaid ? (paidAt || new Date()) : null
        }, { transaction: t });

        for (const item of orderItems) {
            await OrderItem.create({
                orderId: createdOrder._id,
                productId: item.product,
                quantity: item.amount,
                unitPrice: Number(item.price),
                discount: item.discount || 0
            }, { transaction: t });
        }

        await ShippingAddress.create({
            orderId: createdOrder._id,
            recipientName: fullName,
            phone: phone,
            province: city,
            detailAddress: address
        }, { transaction: t });

        await t.commit();

        if (createdOrder) {
            try {
                await EmailService.sendEmailCreateOrder(email, orderItems);
            } catch (emailErr) {
                console.error('Email send failed (non-fatal):', emailErr.message);
            }
            return {
                status: 'OK',
                message: 'SUCCESS'
            };
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
};

const getAllOrderDetails = async (id) => {
    try {
        const orders = await Order.findAll({
            where: { userId: id },
            include: [
                { model: OrderItem, include: ['product'] },
                { model: ShippingAddress }
            ],
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
        });

        const formattedOrders = (orders || []).map(order => formatOrder(order));

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: formattedOrders
        };
    } catch (e) {
        throw e;
    }
};

const getOrderDetails = async (id) => {
    try {
        const order = await Order.findByPk(id, {
            include: [
                { model: OrderItem, include: ['product'] },
                { model: ShippingAddress }
            ]
        });
        if (order === null) {
            return {
                status: 'ERR',
                message: 'Đơn hàng không tồn tại'
            };
        }

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: formatOrder(order)
        };
    } catch (e) {
        throw e;
    }
};

const cancelOrderDetails = async (id, data) => {
    const t = await sequelize.transaction();
    try {
        for (const orderItem of data) {
            const productData = await Product.findOne({
                where: {
                    _id: orderItem.product,
                    selled: { [Op.gte]: orderItem.amount }
                },
                transaction: t
            });
            if (productData) {
                await productData.update({
                    countInStock: productData.countInStock + orderItem.amount,
                    selled: productData.selled - orderItem.amount
                }, { transaction: t });
            } else {
                await t.rollback();
                return {
                    status: 'ERR',
                    message: `Sản phẩm với id: ${orderItem.product} không thể hoàn kho`
                };
            }
        }

        const deletedOrder = await Order.destroy({
            where: { _id: id },
            transaction: t
        });
        if (deletedOrder === 0) {
            await t.rollback();
            return {
                status: 'ERR',
                message: 'Đơn hàng không tồn tại'
            };
        }

        await t.commit();
        return {
            status: 'OK',
            message: 'SUCCESS'
        };
    } catch (e) {
        await t.rollback();
        throw e;
    }
};

const getAllOrder = async () => {
    try {
        const allOrder = await Order.findAll({
            include: [
                { model: OrderItem, include: ['product'] },
                { model: ShippingAddress }
            ],
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
        });
        const formattedOrders = allOrder.map(order => formatOrder(order));
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: formattedOrders
        };
    } catch (e) {
        throw e;
    }
};

const updateOrderStatus = async (orderId, status) => {
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return {
                status: 'ERR',
                message: 'Đơn hàng không tồn tại'
            };
        }

        let dbStatus = status;
        if (status === 'confirmed') {
            dbStatus = 'paid';
        }

        await order.update({ status: dbStatus });
        
        const updatedOrder = await Order.findByPk(orderId, {
            include: [
                { model: OrderItem, include: ['product'] },
                { model: ShippingAddress }
            ]
        });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: formatOrder(updatedOrder)
        };
    } catch (e) {
        throw e;
    }
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus
};