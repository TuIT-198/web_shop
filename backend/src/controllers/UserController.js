const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, username } = req.body
        if (!username || !email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng điền đầy đủ thông tin'
            })
        }
        if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu xác nhận không khớp'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập tên đăng nhập và mật khẩu'
            })
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        if (refresh_token) {
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
            })
        }
        return res.status(200).json({ ...newResponse, refresh_token })
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(200).json({ status: 'ERR', message: 'Vui lòng nhập email' })
        }
        const response = await UserService.forgotPassword({ email })
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(200).json({ status: 'ERR', message: 'Vui lòng cung cấp email và mã OTP' })
        }
        const response = await UserService.verifyOtp({ email, otp })
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body
        if (!email || !resetToken || !newPassword) {
            return res.status(200).json({ status: 'ERR', message: 'Thiếu thông tin cần thiết' })
        }
        const response = await UserService.resetPassword({ email, resetToken, newPassword })
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({ status: 'ERR', message: 'The userId is required' })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({ status: 'ERR', message: 'The userId is required' })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({ status: 'ERR', message: 'The ids is required' })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({ status: 'ERR', message: 'The userId is required' })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ status: 'ERR', message: 'Vui lòng cung cấp token' })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({ status: 'OK', message: 'Logout successfully' })
    } catch (e) {
        return res.status(500).json({ message: e.message || e })
    }
}

module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany
}
