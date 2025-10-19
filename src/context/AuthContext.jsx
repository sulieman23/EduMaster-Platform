import { createContext, useContext, useState } from 'react'
import { login as loginApi } from '../api/auth.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || null)
  const [role, setRole] = useState(localStorage.getItem('userRole') || null)
  const [loading, setLoading] = useState(false)

  const login = async (data) => {
    setLoading(true)
    try {
      // If data has success property, it's already a response object
      if (data.success) {
        const { token: newToken, role: userRole } = data
        
        setToken(newToken)
        setRole(userRole)
        
        localStorage.setItem('authToken', newToken)
        localStorage.setItem('userRole', userRole)
      } else {
        // Otherwise, it's credentials - call the API
        const response = await loginApi(data)
        const { token: newToken, role: userRole } = response
        
        setToken(newToken)
        setRole(userRole)
        
        localStorage.setItem('authToken', newToken)
        localStorage.setItem('userRole', userRole)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userRole')
  }

  const value = {
    token,
    role,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAdmin: role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
