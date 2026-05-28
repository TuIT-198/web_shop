import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location
  const user = useSelector((s) => s.user)

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f5fa 0%, #efe9ff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Success card */}
        <div style={{
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 8px 40px rgba(146, 85, 253, 0.15)',
          overflow: 'hidden', textAlign: 'center'
        }}>
          {/* Top banner */}
          <div style={{
            background: 'linear-gradient(135deg, #9255FD 0%, #6C35E8 100%)',
            padding: '40px 20px 50px'
          }}>
            {/* Animated check icon */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid rgba(255,255,255,0.6)'
            }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M8 20L17 29L32 12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>
              Đặt hàng thành công! 🎉
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '14px' }}>
              Cảm ơn bạn đã mua hàng tại MyShop
            </p>
          </div>

          {/* Info section */}
          <div style={{ padding: '24px 28px' }}>
            {/* Delivery & payment info */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px'
            }}>
              <div style={{
                background: '#f9f6ff', borderRadius: '10px', padding: '14px',
                border: '1px solid #e9d9ff', textAlign: 'left'
              }}>
                <div style={{ fontSize: '11px', color: '#9255FD', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Phương thức giao hàng
                </div>
                <div style={{ fontWeight: 600, color: '#ea8500', fontSize: '13px' }}>
                  🚚 {state?.delivery === 'fast' ? 'FAST Giao hàng tiết kiệm' : state?.delivery === 'gojek' ? 'GO_JEK Giao hàng nhanh' : 'Giao hàng tiêu chuẩn'}
                </div>
              </div>
              <div style={{
                background: '#f6fff8', borderRadius: '10px', padding: '14px',
                border: '1px solid #d9f7e8', textAlign: 'left'
              }}>
                <div style={{ fontSize: '11px', color: '#52c41a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Thanh toán
                </div>
                <div style={{ fontWeight: 600, color: '#1a94ff', fontSize: '13px' }}>
                  {state?.payment === 'later_money' ? '💵 Tiền mặt khi nhận hàng (COD)' : state?.payment === 'vnpay' ? '🏦 Thanh toán VNPay' : state?.payment === 'momo' ? '📱 Thanh toán ví MoMo' : '💵 Tiền mặt khi nhận hàng'}
                </div>
              </div>
            </div>

            {/* Product list */}
            <div style={{
              background: '#fafafa', borderRadius: '12px', padding: '16px',
              marginBottom: '20px', textAlign: 'left'
            }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', color: '#262626' }}>
                Sản phẩm đã đặt
              </div>
              {state?.orders?.map((order, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '8px 0',
                  borderBottom: idx < state.orders.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <img src={order.image} alt={order.name} style={{
                    width: '52px', height: '52px', objectFit: 'cover',
                    borderRadius: '8px', border: '1px solid #eee', flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 500, fontSize: '13px', color: '#262626',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>{order?.name}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>x{order?.amount}</div>
                  </div>
                  <span style={{ fontWeight: 600, color: '#ff4d4f', fontSize: '13px', flexShrink: 0 }}>
                    {convertPrice(order?.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px', background: '#fff3e0', borderRadius: '10px', marginBottom: '24px'
            }}>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>Tổng thanh toán</span>
              <span style={{ fontWeight: 700, fontSize: '22px', color: '#ff4d4f' }}>
                {convertPrice(state?.totalPriceMemo)}
              </span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <ButtonComponent
                onClick={() => navigate('/my-order')}
                styleButton={{
                  flex: 1, height: '46px', border: '2px solid #9255FD',
                  borderRadius: '10px', background: '#fff', minWidth: '140px'
                }}
                textbutton="Xem đơn hàng"
                styleTextButton={{ color: '#9255FD', fontWeight: 700, fontSize: '14px' }}
              />
              <ButtonComponent
                onClick={() => navigate('/')}
                styleButton={{
                  flex: 1, height: '46px', border: 'none',
                  borderRadius: '10px', background: 'linear-gradient(135deg, #9255FD, #6C35E8)',
                  minWidth: '140px'
                }}
                textbutton="Về trang chủ"
                styleTextButton={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess