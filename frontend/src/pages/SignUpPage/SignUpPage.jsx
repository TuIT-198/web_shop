import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message/Message'
import imageLogo from '../../assets/images/logo.png'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import '../SignInPage/SignInPage.css'

const SignUpPage = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)
    try {
      const data = await UserService.signupUser({ username, email, password, confirmPassword })
      if (data?.status === 'OK') {
        message.success('Tạo tài khoản thành công! Vui lòng đăng nhập')
        navigate('/sign-in')
      } else {
        setError(data?.message || 'Đăng ký thất bại')
      }
    } catch (err) {
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-overlay" />
      <div className="auth-wrapper">

        {/* Logo */}
        <div className="auth-logo-section">
          <img src={imageLogo} alt="Logo" className="auth-logo" />
          <p className="auth-brand">Tuny Shop</p>
        </div>

        <form className="auth-form" onSubmit={handleSignUp}>
          <h1 className="auth-title">Tạo tài khoản</h1>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-input-box">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
            <UserOutlined className="auth-icon-left" />
          </div>

          <div className="auth-input-box">
            <input
              type="email"
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
            <MailOutlined className="auth-icon-left" />
          </div>

          <div className="auth-input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <LockOutlined className="auth-icon-left" />
            <span
              className="auth-icon-right auth-icon-clickable"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>

          <div className="auth-input-box">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <LockOutlined className="auth-icon-left" />
            <span
              className="auth-icon-right auth-icon-clickable"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <p className="auth-switch-text">
            Đã có tài khoản?{' '}
            <button type="button" className="auth-link-btn" onClick={() => navigate('/sign-in')}>
              Đăng nhập
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUpPage