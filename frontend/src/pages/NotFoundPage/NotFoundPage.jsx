import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5fa 0%, #ede2ff 50%, #f5f5fa 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 16px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        {/* 404 Big text */}
        <div style={{
          fontSize: 'clamp(80px, 20vw, 140px)',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #9255FD, #6C35E8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          userSelect: 'none'
        }}>
          404
        </div>

        {/* Icon */}
        <div style={{ fontSize: '60px', marginBottom: '20px', lineHeight: 1 }}>
          😕
        </div>

        {/* Text */}
        <h2 style={{
          fontSize: '24px', fontWeight: 700, color: '#1a1a2e',
          margin: '0 0 12px'
        }}>
          Trang không tồn tại
        </h2>
        <p style={{
          color: '#6b7280', fontSize: '15px', lineHeight: '1.6',
          margin: '0 0 32px'
        }}>
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ để tiếp tục mua sắm.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              height: '46px', padding: '0 24px',
              borderRadius: '10px', border: '2px solid #9255FD',
              background: '#fff', color: '#9255FD',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f3edff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            ← Quay lại
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              height: '46px', padding: '0 24px',
              borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #9255FD, #6C35E8)',
              color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 15px rgba(146, 85, 253, 0.4)',
              fontFamily: 'inherit'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <HomeOutlined /> Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage