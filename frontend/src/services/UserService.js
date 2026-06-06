import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/sign-in`, data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/sign-up`, data)
    return res.data
}

export const forgotPassword = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/forgot-password`, data)
    return res.data
}

export const verifyOtp = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/verify-otp`, data)
    return res.data
}

export const resetPassword = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/reset-password`, data)
    return res.data
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/user/get-details/${id}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/user/delete-user/${id}`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/user/getAll`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const refreshToken = async (refreshToken) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/refresh-token`, {}, {
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        }
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/log-out`)
    return res.data
}

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${import.meta.env.VITE_API_URL}/user/update-user/${id}`, data, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL}/user/delete-many`, data, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}