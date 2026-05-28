import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  PhoneOutlined, MailOutlined, EnvironmentOutlined,
  FacebookOutlined, YoutubeOutlined, InstagramOutlined,
  LaptopOutlined, SafetyCertificateOutlined, CarOutlined, CustomerServiceOutlined
} from '@ant-design/icons'

const FooterComponent = () => {
  const navigate = useNavigate()

  const footerLinks = [
    {
      title: 'Về chúng tôi',
      links: [
        { label: 'Giới thiệu', path: '/' },
        { label: 'Tuyển dụng', path: '/' },
        { label: 'Tin tức', path: '/' },
        { label: 'Liên hệ', path: '/' },
      ]
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { label: 'Hướng dẫn mua hàng', path: '/' },
        { label: 'Chính sách đổi trả', path: '/' },
        { label: 'Chính sách bảo hành', path: '/' },
        { label: 'Câu hỏi thường gặp', path: '/' },
      ]
    },
    {
      title: 'Danh mục sản phẩm',
      links: [
        { label: 'Card màn hình (GPU)', path: '/product/VGA' },
        { label: 'Bộ vi xử lý (CPU)', path: '/product/CPU' },
        { label: 'Bộ nhớ RAM', path: '/product/RAM' },
        { label: 'Ổ cứng SSD', path: '/product/SSD' },
      ]
    }
  ]

  const features = [
    { icon: <CarOutlined style={{ fontSize: '22px', color: '#9255FD' }} />, title: 'Miễn phí vận chuyển', desc: 'Đơn hàng trên 500K' },
    { icon: <SafetyCertificateOutlined style={{ fontSize: '22px', color: '#9255FD' }} />, title: 'Bảo hành chính hãng', desc: '12-36 tháng' },
    { icon: <CustomerServiceOutlined style={{ fontSize: '22px', color: '#9255FD' }} />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn miễn phí' },
    { icon: <LaptopOutlined style={{ fontSize: '22px', color: '#9255FD' }} />, title: 'Hàng chính hãng', desc: '100% authentic' },
  ]

  return (
    <footer>
      {/* Features strip */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: '#f3edff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#262626' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        color: '#ccc',
        paddingTop: '48px',
        paddingBottom: '24px'
      }}>
        <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            {/* Brand column */}
            <div>
              <div style={{
                fontSize: '24px', fontWeight: 800, color: '#fff',
                marginBottom: '14px', letterSpacing: '-0.5px'
              }}>
                <span style={{ color: '#9255FD' }}>Computer</span>Shop
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#aaa', marginBottom: '20px' }}>
                Chuyên cung cấp linh kiện máy tính chính hãng, bảo hành uy tín. Mang đến trải nghiệm mua sắm tốt nhất cho bạn.
              </p>
              {/* Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#bbb' }}>
                  <PhoneOutlined style={{ color: '#9255FD' }} />
                  <span>1900 1234</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#bbb' }}>
                  <MailOutlined style={{ color: '#9255FD' }} />
                  <span>support@computershop.vn</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#bbb' }}>
                  <EnvironmentOutlined style={{ color: '#9255FD' }} />
                  <span>123 Nguyễn Văn Linh, Đà Nẵng</span>
                </div>
              </div>
              {/* Social */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                {[
                  { icon: <FacebookOutlined />, color: '#1877f2' },
                  { icon: <YoutubeOutlined />, color: '#ff0000' },
                  { icon: <InstagramOutlined />, color: '#e4405f' },
                ].map((s, i) => (
                  <div key={i} style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: '16px', color: '#ccc',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = s.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerLinks.map((col, i) => (
              <div key={i}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
                  {col.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((link, j) => (
                    <span
                      key={j}
                      onClick={() => navigate(link.path)}
                      style={{
                        fontSize: '13px', color: '#aaa', cursor: 'pointer',
                        transition: 'color 0.2s', lineHeight: '1.5'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#9255FD'}
                      onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
                    >
                      {link.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
          }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              © 2024 ComputerShop. All rights reserved.
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Giấy phép kinh doanh số: 123456789-001
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
