import { Menu, Row, Col, Card, Statistic } from 'antd'
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, DashboardOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderCompoent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAmin';
import ProfilePage from '../Profile/ProfilePage';
import * as DashboardService from '../../services/DashboardService'
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/LoadingComponent/Loading';
import { convertPrice } from '../../utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminPage = () => {
  const user = useSelector((state) => state?.user)
  const location = useLocation()
  const [keySelected, setKeySelected] = useState('dashboard');

  // Allow switching tabs via navigation state (e.g., from header "Thông tin người dùng")
  useEffect(() => {
    if (location.state?.selectedKey) {
      setKeySelected(location.state.selectedKey)
    }
  }, [location.state])

  const items = [
    getItem('Tổng quan', 'dashboard', <DashboardOutlined />),
    getItem('Người dùng', 'users', <UserOutlined />),
    getItem('Sản phẩm', 'products', <AppstoreOutlined />),
    getItem('Đơn hàng', 'orders', <ShoppingCartOutlined />),
    getItem('Thông tin cá nhân', 'profile', <SettingOutlined />),
  ];

  // Fetch stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => DashboardService.getStatistics(user?.access_token),
    enabled: !!user?.access_token
  })

  // Fetch monthly revenue
  const { data: revenue, isLoading: loadingRevenue } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => DashboardService.getRevenueByMonth(user?.access_token),
    enabled: !!user?.access_token
  })

  // Fetch orders status
  const { data: orderStatus, isLoading: loadingOrderStatus } = useQuery({
    queryKey: ['admin-order-status'],
    queryFn: () => DashboardService.getOrdersByStatus(user?.access_token),
    enabled: !!user?.access_token
  })

  const renderDashboard = () => {
    const statData = stats?.data || { totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 };
    const chartData = revenue?.data || [];
    
    // Status translation for Chart
    const statusTranslate = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };

    const statusColors = {
      pending: '#faad14',
      confirmed: '#1890ff',
      shipping: '#13c2c2',
      delivered: '#52c41a',
      cancelled: '#ff4d4f'
    };

    const pieData = (orderStatus?.data || []).map(item => ({
      name: statusTranslate[item.status] || item.status,
      value: Number(item.count),
      color: statusColors[item.status] || '#8884d8'
    })).filter(item => item.value > 0);

    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '20px' }}>Dashboard Thống Kê</h2>
        
        {/* Stat Cards */}
        <Row gutter={[20, 20]} style={{ marginBottom: '30px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Statistic 
                title="Doanh thu tổng" 
                value={convertPrice(statData.totalRevenue)} 
                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Statistic 
                title="Tổng đơn hàng" 
                value={statData.totalOrders} 
                prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Statistic 
                title="Người dùng" 
                value={statData.totalUsers} 
                prefix={<UserOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Statistic 
                title="Sản phẩm" 
                value={statData.totalProducts} 
                prefix={<AppstoreOutlined style={{ color: '#13c2c2' }} />}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[20, 20]}>
          {/* Revenue chart */}
          <Col xs={24} xl={16}>
            <Card title="Doanh thu theo tháng (12 tháng gần nhất)" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(val) => `${val / 1000000}M`} />
                    <Tooltip formatter={(value) => [convertPrice(value), 'Doanh thu']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#1890ff" name="Doanh thu (VND)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Orders status chart */}
          <Col xs={24} xl={8}>
            <Card title="Trạng thái đơn hàng" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                      {pieData.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></span>
                          <span style={{ fontSize: '12px' }}>{item.name} ({item.value})</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#888' }}>Chưa có dữ liệu đơn hàng</div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  const renderPage = (key) => {
    switch (key) {
      case 'dashboard':
        return renderDashboard()
      case 'users':
        return (
          <AdminUser />
        )
      case 'products':
        return (
          <AdminProduct />
        )
      case 'orders':
        return (
          <OrderAdmin />
        )
      case 'profile':
        return (
          <ProfilePage />
        )
      default:
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex', overflowX: 'hidden', minHeight: '100vh', background: '#f5f5fa' }}>
        <Menu
          mode="inline"
          selectedKeys={[keySelected]}
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: 'auto',
            minHeight: '100vh'
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: '15px', background: '#f5f5fa' }}>
          <Loading isLoading={keySelected === 'dashboard' && (loadingStats || loadingRevenue || loadingOrderStatus)}>
            {renderPage(keySelected)}
          </Loading>
        </div>
      </div>
    </>
  )
}

export default AdminPage