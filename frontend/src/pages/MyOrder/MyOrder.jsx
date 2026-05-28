import React, { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'
import { Tag, Empty } from 'antd'
import { ShoppingOutlined, ClockCircleOutlined, CheckCircleOutlined, CarOutlined, GiftOutlined, CloseCircleOutlined } from '@ant-design/icons'

const statusConfig = {
  pending:   { label: 'Chờ xác nhận', color: 'orange',  icon: <ClockCircleOutlined /> },
  confirmed: { label: 'Đã xác nhận',  color: 'blue',    icon: <CheckCircleOutlined /> },
  shipping:  { label: 'Đang giao',    color: 'cyan',    icon: <CarOutlined /> },
  delivered: { label: 'Đã giao',      color: 'green',   icon: <GiftOutlined /> },
  cancelled: { label: 'Đã hủy',       color: 'red',     icon: <CloseCircleOutlined /> },
}

const MyOrderPage = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  const fetchMyOrder = async () => {
    if (!user?.id || !user?.access_token) return []
    const res = await OrderService.getOrderByUserId(user.id, user.access_token)
    return res?.data || []
  }

  const queryOrder = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: fetchMyOrder,
    enabled: !!(user?.id && user?.access_token)
  })
  const { isLoading, data } = queryOrder

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data
      return OrderService.cancelOrder(id, token, orderItems, userId)
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({ id: order._id, token: user?.access_token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: { token: user?.access_token }
    })
  }

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success('Hủy đơn hàng thành công')
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    } else if (isErrorCancle) {
      message.error('Có lỗi xảy ra khi hủy đơn hàng')
    }
  }, [isErrorCancle, isSuccessCancel])

  const renderProduct = (items) => {
    return items?.map((item) => (
      <div key={item?._id || item?.name} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 0', borderBottom: '1px solid #f0f0f0'
      }}>
        <img src={item?.image} style={{
          width: '64px', height: '64px', objectFit: 'cover',
          borderRadius: '6px', border: '1px solid #eee', flexShrink: 0
        }} alt={item?.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontWeight: 500, fontSize: '14px', color: '#262626'
          }}>{item?.name}</div>
          <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>
            x{item?.amount}
          </div>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#ff4d4f', flexShrink: 0 }}>
          {convertPrice(item?.price)}
        </span>
      </div>
    ))
  }

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <div style={{ background: '#f5f5fa', minHeight: '100vh', paddingBottom: '40px' }}>
        <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <ShoppingOutlined style={{ fontSize: '22px', color: '#9255FD' }} />
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: '22px' }}>Đơn hàng của tôi</h2>
          </div>

          {(!data || data.length === 0) ? (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '60px 20px', textAlign: 'center' }}>
              <Empty description="Bạn chưa có đơn hàng nào" />
              <ButtonComponent
                onClick={() => navigate('/')}
                styleButton={{
                  background: '#9255FD', border: 'none', borderRadius: '8px',
                  height: '42px', width: '200px', marginTop: '20px'
                }}
                textbutton="Mua sắm ngay"
                styleTextButton={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {data?.map((order) => {
                const status = statusConfig[order?.status] || { label: order?.status, color: 'default', icon: null }
                const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : ''
                return (
                  <div key={order?._id} style={{
                    background: '#fff', borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden'
                  }}>
                    {/* Order header */}
                    <div style={{
                      padding: '14px 20px', background: '#fafafa',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Tag color={status.color} icon={status.icon} style={{ fontWeight: 600, fontSize: '13px', padding: '3px 10px' }}>
                          {status.label}
                        </Tag>
                        {orderDate && <span style={{ color: '#888', fontSize: '13px' }}>Ngày đặt: {orderDate}</span>}
                      </div>
                      <span style={{ fontSize: '12px', color: '#aaa' }}>#{order?._id?.slice(-8).toUpperCase()}</span>
                    </div>

                    {/* Products */}
                    <div style={{ padding: '0 20px' }}>
                      {renderProduct(order?.orderItems)}
                    </div>

                    {/* Order footer */}
                    <div style={{
                      padding: '14px 20px', borderTop: '1px solid #f0f0f0',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#888' }}>Tổng thanh toán</span>
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#ff4d4f' }}>
                          {convertPrice(order?.totalPrice)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {(order?.status === 'pending' || !order?.status) && (
                          <ButtonComponent
                            onClick={() => handleCanceOrder(order)}
                            styleButton={{
                              height: '38px', border: '1px solid #ff4d4f', borderRadius: '8px',
                              background: '#fff', padding: '0 16px'
                            }}
                            textbutton="Hủy đơn"
                            styleTextButton={{ color: '#ff4d4f', fontSize: '14px', fontWeight: 500 }}
                          />
                        )}
                        <ButtonComponent
                          onClick={() => handleDetailsOrder(order?._id)}
                          styleButton={{
                            height: '38px', border: '1px solid #9255FD', borderRadius: '8px',
                            background: '#fff', padding: '0 16px'
                          }}
                          textbutton="Xem chi tiết"
                          styleTextButton={{ color: '#9255FD', fontSize: '14px', fontWeight: 500 }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Loading>
  )
}

export default MyOrderPage