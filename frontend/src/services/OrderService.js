import { axiosJWT } from "./UserService"

export const createOrder = async (data,access_token) => {
  const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL}/order/create/${data.user}`, data, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getOrderByUserId = async (id,access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/order/get-all-order/${id}`, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getDetailsOrder = async (id,access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/order/get-details-order/${id}`, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const cancelOrder = async (id, access_token, orderItems, userId) => {
  const data = {orderItems, orderId: id}
  const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL}/order/cancel-order/${userId}`, {
      data: { ...data },
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/order/get-all-order`, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const updateOrderStatus = async (id, data, access_token) => {
  const res = await axiosJWT.put(`${import.meta.env.VITE_API_URL}/order/update-status/${id}`, data, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}
