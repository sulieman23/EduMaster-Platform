import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEntitlements } from '../context/EntitlementsContext.jsx'

export default function PurchasedRoute({ children }){
  const { isAuthenticated, role } = useAuth()
  const { canAccessExams, loading } = useEntitlements()
  const location = useLocation()

  if (role === 'admin') return children
  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!canAccessExams) {
    return <Navigate to="/courses" replace />
  }

  return children
}
