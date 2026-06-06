import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import jwt_decode from 'jwt-decode'
import * as UserService from '../../services/UserService'
import { updateUser } from '../../redux/slides/userSlide'
import * as message from '../../components/Message/Message'
import imageLogo from '../../assets/images/logo.png'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import './SignInPage.css'

const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // ---- step: 'login' | 'forgot' | 'otp' | 'reset' ----
  const [step, setStep] = useState('login')

  // Login state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Forgot password state
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const clearErrors = () => setError('')

  const resetForgotFlow = () => {
    setEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmNewPassword('')
    setResetToken('')
    setStep('login')
    clearErrors()
  }

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }

  // ---- ĐĂNG NHẬP ----
  const handleLogin = async (e) => {
    e.preventDefault()
    clearErrors()
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu')
      return
    }
    setLoading(true)
    try {
      const data = await UserService.loginUser({ username, password })
      if (data?.status === 'OK') {
        message.success('Đăng nhập thành công')
        localStorage.setItem('access_token', JSON.stringify(data?.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
        if (data?.access_token) {
          const decoded = jwt_decode(data.access_token)
          if (decoded?.id) {
            await handleGetDetailsUser(decoded.id, data.access_token)
          }
          if (decoded?.isAdmin) {
            navigate('/system/admin')
          } else if (location?.state) {
            navigate(location.state)
          } else {
            navigate('/')
          }
        }
      } else {
        setError(data?.message || 'Đăng nhập thất bại')
      }
    } catch (err) {
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  // ---- QUÊN MẬT KHẨU - Gửi OTP ----
  const handleSendOtp = async (e) => {
    e.preventDefault()
    clearErrors()
    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }
    setLoading(true)
    try {
      const data = await UserService.forgotPassword({ email })
      if (data?.status === 'OK') {
        message.success('Mã OTP đã được gửi đến email của bạn')
        setStep('otp')
      } else {
        setError(data?.message || 'Không thể gửi OTP')
      }
    } catch (err) {
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  // ---- XÁC THỰC OTP ----
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    clearErrors()
    if (!otp.trim() || otp.length !== 6) {
      setError('OTP phải gồm đúng 6 chữ số')
      return
    }
    setLoading(true)
    try {
      const data = await UserService.verifyOtp({ email, otp })
      if (data?.status === 'OK') {
        setResetToken(data.resetToken)
        setStep('reset')
      } else {
        setError(data?.message || 'OTP không hợp lệ')
      }
    } catch (err) {
      setError('Không thể kết nối tới server')
    } finally {
      setLoading(false)
    }
  }

  // ---- ĐẶT LẠI MẬT KHẨU ----
  const handleResetPassword = async (e) => {
    e.preventDefault()
    clearErrors()
    if (!newPassword.trim()) {
      setError('Vui lòng nhập mật khẩu mới')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }
    setLoading(true)
    try {
      const data = await UserService.resetPassword({ email, resetToken, newPassword })
      if (data?.status === 'OK') {
        message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại')
        resetForgotFlow()
      } else {
        setError(data?.message || 'Không thể đặt lại mật khẩu')
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

        {/* ---- FORM ĐĂNG NHẬP ---- */}
        {step === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="auth-title">Đăng nhập</h1>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-input-box">
              <input
                type="text"
                placeholder="Tên đăng nhập hoặc email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
              <UserOutlined className="auth-icon-left" />
            </div>

            <div className="auth-input-box">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <LockOutlined className="auth-icon-left" />
              <span
                className="auth-icon-right auth-icon-clickable"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

            <div className="auth-remember-forgot">
              <span />
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setStep('forgot'); clearErrors() }}
                disabled={loading}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <p className="auth-switch-text">
              Chưa có tài khoản?{' '}
              <button type="button" className="auth-link-btn" onClick={() => navigate('/sign-up')}>
                Tạo tài khoản
              </button>
            </p>
          </form>
        )}

        {/* ---- FORM QUÊN MẬT KHẨU ---- */}
        {step === 'forgot' && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <h1 className="auth-title">Quên mật khẩu</h1>
            <p className="auth-subtitle">Nhập email để nhận mã OTP đặt lại mật khẩu</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-input-box">
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
              <MailOutlined className="auth-icon-left" />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
            <button type="button" className="auth-btn auth-btn-secondary" onClick={resetForgotFlow} disabled={loading}>
              Quay lại đăng nhập
            </button>
          </form>
        )}

        {/* ---- FORM XÁC THỰC OTP ---- */}
        {step === 'otp' && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <h1 className="auth-title">Nhập mã OTP</h1>
            <p className="auth-subtitle">Mã OTP đã được gửi đến <strong>{email}</strong></p>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-input-box">
              <input
                type="text"
                placeholder="Nhập mã OTP 6 chữ số"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^\d{0,6}$/.test(val)) setOtp(val)
                }}
                disabled={loading}
                className="auth-otp-input"
              />
              <SafetyOutlined className="auth-icon-left" />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>
            <button type="button" className="auth-btn auth-btn-secondary" onClick={() => { setStep('forgot'); clearErrors() }} disabled={loading}>
              Quay lại
            </button>
          </form>
        )}

        {/* ---- FORM ĐẶT LẠI MẬT KHẨU ---- */}
        {step === 'reset' && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <h1 className="auth-title">Đặt lại mật khẩu</h1>
            <p className="auth-subtitle">Nhập mật khẩu mới cho tài khoản của bạn</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-input-box">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <LockOutlined className="auth-icon-left" />
              <span
                className="auth-icon-right auth-icon-clickable"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

            <div className="auth-input-box">
              <input
                type={showConfirmNewPassword ? 'text' : 'password'}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={loading}
              />
              <LockOutlined className="auth-icon-left" />
              <span
                className="auth-icon-right auth-icon-clickable"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              >
                {showConfirmNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Đang đặt lại...' : 'Xác nhận'}
            </button>
            <button type="button" className="auth-btn auth-btn-secondary" onClick={() => { setStep('otp'); clearErrors() }} disabled={loading}>
              Quay lại
            </button>
          </form>
        )}

      </div>
    </div>
  )
}

export default SignInPage