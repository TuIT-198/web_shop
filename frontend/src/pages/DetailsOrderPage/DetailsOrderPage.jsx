import React from 'react'
import { WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser, WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel, WrapperNameProduct, WrapperProduct, WrapperStyleContent } from './style'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import { useMemo } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'

const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params
  const user = useSelector((s) => s.user)

  const fetchDetailsOrder = async () => {
    const token = state?.token || user?.access_token
    const res = await OrderService.getDetailsOrder(id, token)
    return res.data
  }

  const queryOrder = useQuery({
    queryKey: ['orders-details', id],
    queryFn: fetchDetailsOrder,
    enabled: !!id
  })
  const { isLoading, data } = queryOrder

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result || 0
  },[data])

  return (
   <Loading isLoading={isLoading}>
     <div style={{width: '100%', minHeight: '100vh', background: '#f5f5fa'}}>
      <div style={{ width: '100%', maxWidth: '1270px', margin: '0 auto', padding: '0 15px'}}>
        <h4 style={{ fontWeight: 'bold', padding: '15px 0 10px' }}>Chi tiết đơn hàng</h4>
        <WrapperHeaderUser>
          <WrapperInfoUser>
            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
            <WrapperContentInfo>
              <div className='name-info'>{data?.shippingAddress?.fullName || 'N/A'}</div>
              <div className='address-info'><span>Địa chỉ: </span> {`${data?.shippingAddress?.address || ''} ${data?.shippingAddress?.city || ''}`}</div>
              <div className='phone-info'><span>Điện thoại: </span> {data?.shippingAddress?.phone || 'N/A'}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
            <WrapperContentInfo>
              <div className='delivery-info'>
                <span className='name-delivery'>FAST </span>Giao hàng tiết kiệm
              </div>
              <div className='delivery-fee'><span>Phí giao hàng: </span> {convertPrice(data?.shippingPrice)}</div>
            </WrapperContentInfo>
          </WrapperInfoUser>
          <WrapperInfoUser>
            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
            <WrapperContentInfo>
              <div className='payment-info'>{orderContant.payment[data?.paymentMethod] || data?.paymentMethod || 'N/A'}</div>
              <div className='status-payment' style={{ color: data?.isPaid ? '#52c41a' : '#ff4d4f', fontWeight: 600, marginTop: '4px' }}>
                {data?.isPaid ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}
              </div>
            </WrapperContentInfo>
          </WrapperInfoUser>
        </WrapperHeaderUser>
        <WrapperStyleContent>
          <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{width: '670px'}}>Sản phẩm</div>
            <WrapperItemLabel>Giá</WrapperItemLabel>
            <WrapperItemLabel>Số lượng</WrapperItemLabel>
            <WrapperItemLabel>Giảm giá</WrapperItemLabel>
          </div>
          {data?.orderItems?.map((order, index) => {
            return (
              <WrapperProduct key={index}>
                <WrapperNameProduct>
                  <img src={order?.image} 
                    alt={order?.name}
                    style={{
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'cover',
                      border: '1px solid rgb(238, 238, 238)',
                      padding: '2px',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap',
                    marginLeft: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>{order?.name || 'Sản phẩm'}</div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem>{order?.amount}</WrapperItem>
                <WrapperItem>{order?.discount ? `${order?.discount}%` : '0%'}</WrapperItem>
              </WrapperProduct>
            )
          })}
          {(!data?.orderItems || data.orderItems.length === 0) && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              Không có sản phẩm nào trong đơn hàng này
            </div>
          )}
          
          <WrapperAllPrice>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
          </WrapperAllPrice>
          <WrapperAllPrice>
            <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            <WrapperItem style={{ color: '#ff4d4f', fontWeight: 700, fontSize: '18px' }}>
              {convertPrice(data?.totalPrice)}
            </WrapperItem>
          </WrapperAllPrice>
      </WrapperStyleContent>
      </div>
    </div>
   </Loading>
  )
}

export default DetailsOrderPage