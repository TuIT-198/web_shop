const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    // Lấy token từ header Authorization: Bearer <token>
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: 'Vui lòng đăng nhập',
            status: 'ERROR'
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập',
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    // Lấy token từ header Authorization: Bearer <token>
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: 'Vui lòng đăng nhập',
            status: 'ERROR'
        })
    }
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập',
                status: 'ERROR'
            })
        }
    });
}

// Middleware chỉ kiểm tra token hợp lệ (không so sánh userId với params.id)
// Dùng cho các route mà :id không phải userId (ví dụ: orderId)
const authTokenMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({
            message: 'Vui lòng đăng nhập',
            status: 'ERROR'
        })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn',
                status: 'ERROR'
            })
        }
        req.user = user
        next()
    });
}

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
    authTokenMiddleWare
}