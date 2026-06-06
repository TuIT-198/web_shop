const { User } = require("../models")
const bcrypt = require("bcryptjs")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { Op } = require('sequelize')

// Tạo transporter email
const createTransporter = () => nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
    },
})

const createUser = async (newUser) => {
    const { name, email, password, confirmPassword, phone, username } = newUser
    try {
        if (!username || !email || !password || !confirmPassword) {
            return { status: 'ERR', message: 'Vui lòng điền đầy đủ thông tin' }
        }
        if (password !== confirmPassword) {
            return { status: 'ERR', message: 'Mật khẩu xác nhận không khớp' }
        }

        const checkEmail = await User.findOne({ where: { email } })
        if (checkEmail) {
            return { status: 'ERR', message: 'Email đã được sử dụng' }
        }

        const checkUsername = await User.findOne({ where: { username } })
        if (checkUsername) {
            return { status: 'ERR', message: 'Tên đăng nhập đã tồn tại' }
        }

        const hash = bcrypt.hashSync(password, 10)
        const createdUser = await User.create({
            name: name || username,
            username,
            email,
            password: hash,
            phone
        })
        if (createdUser) {
            return { status: 'OK', message: 'SUCCESS', data: createdUser }
        }
    } catch (e) {
        throw e
    }
}

const loginUser = async (userLogin) => {
    const { username, password } = userLogin
    try {
        if (!username || !password) {
            return { status: 'ERR', message: 'Vui lòng nhập tên đăng nhập và mật khẩu' }
        }

        // Cho phép đăng nhập bằng username hoặc email
        const checkUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { email: username }
                ]
            }
        })

        if (checkUser === null) {
            return { status: 'ERR', message: 'Tên đăng nhập hoặc email không tồn tại' }
        }

        const comparePassword = bcrypt.compareSync(password, checkUser.dataValues.password)
        if (!comparePassword) {
            return { status: 'ERR', message: 'Mật khẩu không đúng' }
        }

        const access_token = await generalAccessToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        })
        const refresh_token = await generalRefreshToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        })

        return { status: 'OK', message: 'SUCCESS', access_token, refresh_token }
    } catch (e) {
        throw e
    }
}

const forgotPassword = async ({ email }) => {
    try {
        if (!email) {
            return { status: 'ERR', message: 'Vui lòng nhập email' }
        }

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return { status: 'ERR', message: 'Email không tồn tại trong hệ thống' }
        }

        // Tạo OTP 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 phút

        await User.update(
            { otpCode: otp, otpExpiry },
            { where: { email } }
        )

        // Gửi email OTP
        const transporter = createTransporter()
        await transporter.sendMail({
            from: `"Tuny Shop" <${process.env.MAIL_ACCOUNT}>`,
            to: email,
            subject: 'Mã OTP đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #e53935; text-align: center;">Đặt lại mật khẩu</h2>
                    <p>Xin chào <strong>${user.name || user.username}</strong>,</p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                    <p>Mã OTP của bạn là:</p>
                    <div style="text-align: center; margin: 24px 0;">
                        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #e53935; background: #fff; padding: 12px 24px; border-radius: 8px; border: 2px solid #e53935;">${otp}</span>
                    </div>
                    <p>Mã này có hiệu lực trong <strong>10 phút</strong>.</p>
                    <p style="color: #888; font-size: 13px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                </div>
            `
        })

        return { status: 'OK', message: 'Mã OTP đã được gửi đến email của bạn' }
    } catch (e) {
        throw e
    }
}

const verifyOtp = async ({ email, otp }) => {
    try {
        if (!email || !otp) {
            return { status: 'ERR', message: 'Vui lòng cung cấp email và mã OTP' }
        }

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return { status: 'ERR', message: 'Email không tồn tại' }
        }

        if (!user.otpCode || user.otpCode !== otp) {
            return { status: 'ERR', message: 'Mã OTP không đúng' }
        }

        if (new Date() > new Date(user.otpExpiry)) {
            return { status: 'ERR', message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới' }
        }

        // Tạo reset token tạm thời
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 phút

        await User.update(
            { otpCode: resetToken, otpExpiry: resetTokenExpiry },
            { where: { email } }
        )

        return { status: 'OK', message: 'Xác thực OTP thành công', resetToken }
    } catch (e) {
        throw e
    }
}

const resetPassword = async ({ email, resetToken, newPassword }) => {
    try {
        if (!email || !resetToken || !newPassword) {
            return { status: 'ERR', message: 'Thiếu thông tin cần thiết' }
        }

        const user = await User.findOne({ where: { email } })
        if (!user) {
            return { status: 'ERR', message: 'Email không tồn tại' }
        }

        if (!user.otpCode || user.otpCode !== resetToken) {
            return { status: 'ERR', message: 'Token không hợp lệ. Vui lòng thực hiện lại từ đầu' }
        }

        if (new Date() > new Date(user.otpExpiry)) {
            return { status: 'ERR', message: 'Token đã hết hạn. Vui lòng thực hiện lại từ đầu' }
        }

        const hash = bcrypt.hashSync(newPassword, 10)
        await User.update(
            { password: hash, otpCode: null, otpExpiry: null },
            { where: { email } }
        )

        return { status: 'OK', message: 'Đặt lại mật khẩu thành công' }
    } catch (e) {
        throw e
    }
}

const updateUser = async (id, data) => {
    try {
        const checkUser = await User.findByPk(id)
        if (checkUser === null) {
            return { status: 'ERR', message: 'Người dùng không tồn tại' }
        }

        await User.update(data, { where: { _id: id } })
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        })
        return { status: 'OK', message: 'SUCCESS', data: updatedUser }
    } catch (e) {
        throw e
    }
}

const deleteUser = async (id) => {
    try {
        const checkUser = await User.findByPk(id)
        if (checkUser === null) {
            return { status: 'ERR', message: 'Người dùng không tồn tại' }
        }

        await User.destroy({ where: { _id: id } })
        return { status: 'OK', message: 'Xóa người dùng thành công' }
    } catch (e) {
        throw e
    }
}

const deleteManyUser = async (ids) => {
    try {
        await User.destroy({ where: { _id: ids } })
        return { status: 'OK', message: 'Xóa người dùng thành công' }
    } catch (e) {
        throw e
    }
}

const getAllUser = async () => {
    try {
        const allUser = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']]
        })
        return { status: 'OK', message: 'SUCCESS', data: allUser }
    } catch (e) {
        throw e
    }
}

const getDetailsUser = async (id) => {
    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        })
        if (user === null) {
            return { status: 'ERR', message: 'Người dùng không tồn tại' }
        }
        return { status: 'OK', message: 'SUCCESS', data: user }
    } catch (e) {
        throw e
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
    deleteManyUser
}