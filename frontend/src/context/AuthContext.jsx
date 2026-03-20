import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — restore user from localStorage if token exists
  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved = localStorage.getItem('user')
    if (token && saved) {
      try {
        setUser(JSON.parse(saved))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    setUser(user)
  }

  const register = async (name, email, phone, password) => {
    const res = await api.post('/api/auth/register', {
      username: name,
      email,
      phone,
      password,
    })
    const { access_token, user } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(user))
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    setUser(user)
  }

  const logout = async () => {
    try {
      await api.delete('/api/auth/logout')
    } catch (e) {
      // even if it fails, clear locally
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}