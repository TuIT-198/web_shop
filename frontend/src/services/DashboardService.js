import { axiosJWT } from "./UserService"

export const getStatistics = async (access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getRevenueByMonth = async (access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dashboard/revenue`, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const getOrdersByStatus = async (access_token) => {
  const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL}/dashboard/orders-status`, {
      headers: {
          Authorization: `Bearer ${access_token}`,
      }
  })
  return res.data
}
