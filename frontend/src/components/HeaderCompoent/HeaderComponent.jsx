import { Badge, Col, Popover } from 'antd'
import React from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall, WrapperCartHeader } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
  TagOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import * as ProductService from '../../services/ProductService'
import { resetUser } from '../../redux/slides/userSlide'
import { useState, useRef } from 'react';
import Loading from '../LoadingComponent/Loading';
import { useEffect } from 'react';
import { searchProduct } from '../../redux/slides/productSlide';
import tunyLogo from '../../assets/images/logo.png';


const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)

  // Search suggestions state
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allTypes, setAllTypes] = useState([])
  const searchTimeoutRef = useRef(null)
  const suggestionsRef = useRef(null)

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await UserService.logoutUser()
    } catch (err) {
      console.error('Logout error:', err)
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    dispatch(resetUser())
    setLoading(false)
    navigate('/')
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  // Fetch all types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
          setAllTypes(res.data || [])
        }
      } catch (e) { /* ignore */ }
    }
    fetchTypes()
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      {!user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile') {
      if (user?.isAdmin) {
        // Admin: stay in admin layout, switch to profile tab
        navigate('/system/admin', { state: { selectedKey: 'profile' } })
      } else {
        navigate('/profile-user')
      }
    }else if(type === 'admin') {
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order',{ state : {
          id: user?.id,
          token : user?.access_token
        }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    dispatch(searchProduct(value))

    // Debounced search suggestions
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (value.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = []

        // Match categories/types
        const matchingTypes = allTypes.filter(t =>
          t.toLowerCase().includes(value.toLowerCase())
        )
        matchingTypes.forEach(t => {
          results.push({ type: 'category', label: t, value: t })
        })

        // Fetch matching products
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/product/get-all?limit=5&filter=search&filter=${encodeURIComponent(value)}`
        )
        if (res.ok) {
          const data = await res.json()
          if (data?.data?.length) {
            data.data.forEach(p => {
              results.push({ type: 'product', label: p.name, value: p._id, image: p.image, price: p.price })
            })
          }
        }

        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch (e) {
        // ignore
      }
    }, 300)
  }

  const handleSearchClick = () => {
    setShowSuggestions(false)
    navigate('/products')
  }

  const handleSuggestionClick = (item) => {
    setShowSuggestions(false)
    if (item.type === 'category') {
      // Navigate to category page
      const slug = item.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')
      navigate(`/product/${slug}`, { state: item.value })
    } else {
      // Navigate to product detail
      navigate(`/product-details/${item.value}`)
    }
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + 'đ'
  }

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', background: 'linear-gradient(135deg, #7c3aed 0%, #9255FD 100%)', justifyContent: 'center', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader to={user?.isAdmin ? '/system/admin' : '/'}>
            <img src={tunyLogo} alt="Tuny" style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            <span style={{ fontSize: '22px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Tuny</span>
          </WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={11}>
            <div style={{ position: 'relative' }} ref={suggestionsRef}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#fff', 
                borderRadius: '24px', 
                padding: '4px 4px 4px 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                height: '46px',
                boxSizing: 'border-box',
                border: '1.5px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#b388ff'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(146, 85, 253, 0.2)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)' }}
              >
                <SearchOutlined style={{ color: '#999', fontSize: '18px', marginRight: '10px' }} />
                <input
                  value={search}
                  onChange={onSearch}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchClick()
                  }}
                  placeholder="Nhập tên sản phẩm cần tìm..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    background: 'transparent',
                    height: '100%',
                    color: '#333'
                  }}
                />
                <button
                  onClick={handleSearchClick}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #9255FD 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '0 24px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    height: '38px',
                    boxShadow: '0 2px 6px rgba(146, 85, 253, 0.3)',
                    transition: 'transform 0.1s ease, opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.95'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Tìm kiếm
                </button>
              </div>
              
              {/* Suggestions dropdown */}
              {showSuggestions && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid #e8e8e8'
                }}>
                  {suggestions.map((item, idx) => (
                    <div
                      key={`${item.type}-${idx}`}
                      onClick={() => handleSuggestionClick(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        borderBottom: idx < suggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3edff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.type === 'category' ? (
                        <>
                          <TagOutlined style={{ color: '#9255FD', fontSize: '16px' }} />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500 }}>
                              Danh mục: <span style={{ color: '#9255FD' }}>{item.label}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>Xem tất cả sản phẩm {item.label}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          ) : (
                            <ShoppingOutlined style={{ fontSize: '16px', color: '#999' }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.label}
                            </div>
                            {item.price && (
                              <div style={{ fontSize: '12px', color: '#e74c3c', fontWeight: 600 }}>
                                {formatPrice(item.price)}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        )}
        <Col span={8} style={{ display: 'flex', gap: '30px', alignItems: 'center' , marginLeft:'40px' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccout>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '26px' }} />
              )}
              {user?.email ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div style={{ cursor: 'pointer',maxWidth: 120, overflow: 'hidden', textWrap:'nowrap', fontWeight: '600' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                  </Popover>
                </>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined style={{ fontSize: '10px' }} />
                  </div>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>
          {!isHiddenCart && (
            <WrapperCartHeader onClick={() => navigate('/order')}>
              <Badge count={order?.orderItems?.length} size="small" style={{ boxShadow: 'none' }}>
                <ShoppingCartOutlined style={{ fontSize: '28px', color: '#fff' }} />
              </Badge>
              <WrapperTextHeaderSmall style={{ fontSize: '14px' }}>Giỏ hàng</WrapperTextHeaderSmall>
            </WrapperCartHeader>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent