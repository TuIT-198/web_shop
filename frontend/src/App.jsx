import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { routes } from './routes'
import { isJsonString } from './utils'
import jwt_decode from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, updateUser } from './redux/slides/userSlide'
import Loading from './components/LoadingComponent/Loading'
import AdminRoute from './components/AdminRoute/AdminRoute'

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true)
      try {
        const { storageData, decoded } = handleDecoded()
        if (decoded?.id) {
          await handleGetDetailsUser(decoded?.id, storageData)
        }
      } catch (err) {
        // Silent catch
      } finally {
        setIsLoading(false)
      }
    }
    initApp()
  }, [])

  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token')
    let decoded = {}
    if (storageData) {
      try {
        let token = storageData
        if (isJsonString(storageData)) {
          token = JSON.parse(storageData)
        }
        decoded = jwt_decode(token)
        storageData = token
      } catch (err) {
        // Silent catch
      }
    }
    return { decoded, storageData }
  }

  useEffect(() => {
    const interceptor = UserService.axiosJWT.interceptors.request.use(async (config) => {
      const currentTime = new Date()
      const { decoded } = handleDecoded()
      let storageRefreshToken = localStorage.getItem('refresh_token')
      if (storageRefreshToken) {
        try {
          const refreshToken = JSON.parse(storageRefreshToken)
          const decodedRefreshToken = jwt_decode(refreshToken)
          if (decoded?.exp < currentTime.getTime() / 1000) {
            if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
              const data = await UserService.refreshToken(refreshToken)
              localStorage.setItem('access_token', JSON.stringify(data?.access_token))
              dispatch(updateUser({ access_token: data?.access_token }))
              config.headers['Authorization'] = `Bearer ${data?.access_token}`
            } else {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              dispatch(resetUser())
            }
          }
        } catch (err) {
          // Silent catch
        }
      }
      return config;
    }, (err) => {
      return Promise.reject(err)
    })
    return () => {
      UserService.axiosJWT.interceptors.request.eject(interceptor)
    }
  }, [user?.access_token])

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    let refreshToken = ''
    if (storageRefreshToken) {
      try {
        refreshToken = JSON.parse(storageRefreshToken)
      } catch (err) {}
    }
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken}))
  }

  return (
    <div style={{height: '100vh', width: '100%'}}>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              const isRouteAdmin = route.isPrivated && route.isAdmin
              return (
                <Route key={route.path} path={route.path} element={
                  isRouteAdmin ? (
                    <AdminRoute>
                      <Layout>
                        <Page />
                      </Layout>
                    </AdminRoute>
                  ) : (
                    <Layout>
                      <Page />
                    </Layout>
                  )
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}

export default App