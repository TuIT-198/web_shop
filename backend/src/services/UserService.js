const { User } = require("../models")
const bcrypt = require("bcryptjs")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")

const createUser = async (newUser) => {
    const { name, email, password, phone } = newUser
    try {
        const checkUser = await User.findOne({
            where: { email: email }
        })
        if (checkUser !== null) {
            return {
                status: 'ERR',
                message: 'Email đã tồn tại'
            }
        }
        const hash = bcrypt.hashSync(password, 10)
        const createdUser = await User.create({
            name: name || email.split('@')[0],
            email,
            password: hash,
            phone
        })
        if (createdUser) {
            return {
                status: 'OK',
                message: 'SUCCESS',
                data: createdUser
            }
        }
    } catch (e) {
        throw e
    }
}

const loginUser = async (userLogin) => {
    const { email, password } = userLogin
    try {
        const checkUser = await User.findOne({
            where: { email: email }
        })
        if (checkUser === null) {
            return {
                status: 'ERR',
                message: 'Người dùng không tồn tại'
            }
        }
        const comparePassword = bcrypt.compareSync(password, checkUser.password)

        if (!comparePassword) {
            return {
                status: 'ERR',
                message: 'Mật khẩu hoặc tài khoản không đúng'
            }
        }
        const access_token = await generalAccessToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        })

        const refresh_token = await generalRefreshToken({
            id: checkUser._id,
            isAdmin: checkUser.isAdmin
        })

        return {
            status: 'OK',
            message: 'SUCCESS',
            access_token,
            refresh_token
        }
    } catch (e) {
        throw e
    }
}

const updateUser = async (id, data) => {
    try {
        const checkUser = await User.findByPk(id)
        if (checkUser === null) {
            return {
                status: 'ERR',
                message: 'Người dùng không tồn tại'
            }
        }

        await User.update(data, { where: { _id: id } })
        const updatedUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        })
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: updatedUser
        }
    } catch (e) {
        throw e
    }
}

const deleteUser = async (id) => {
    try {
        const checkUser = await User.findByPk(id)
        if (checkUser === null) {
            return {
                status: 'ERR',
                message: 'Người dùng không tồn tại'
            }
        }

        await User.destroy({ where: { _id: id } })
        return {
            status: 'OK',
            message: 'Xóa người dùng thành công',
        }
    } catch (e) {
        throw e
    }
}

const deleteManyUser = async (ids) => {
    try {
        await User.destroy({ where: { _id: ids } })
        return {
            status: 'OK',
            message: 'Xóa người dùng thành công',
        }
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
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: allUser
        }
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
            return {
                status: 'ERR',
                message: 'Người dùng không tồn tại'
            }
        }
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: user
        }
    } catch (e) {
        throw e
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}