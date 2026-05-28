import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loading from '../LoadingComponent/Loading'

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user)
  const token = localStorage.getItem('access_token')
  
  // Nếu có token nhưng thông tin user chưa tải xong từ API, hiển thị loading chờ
  if (token && !user?.id) {
    return <Loading isLoading={true}><div style={{ height: '100vh' }}></div></Loading>
  }
  
  if (user?.isAdmin) {
    return children
  }
  
  return <Navigate to="/" replace />
}

export default AdminRoute
