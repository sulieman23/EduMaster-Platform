import React from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEntitlements } from '../../context/EntitlementsContext.jsx'


export default function StudentRoute({ children, requirePurchase = false, lessonIdParam }){
  const { isAuthenticated, role } = useAuth()
  const { hasPurchasedLesson } = useEntitlements()
  const params = useParams()
  const location = useLocation()

  // Admin can  access
  if (role === 'admin') return children

  // logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }


  if (requirePurchase) {
    const lessonId = lessonIdParam ? params[lessonIdParam] : undefined
    if (lessonId && !hasPurchasedLesson(lessonId)) {
      return <Navigate to="/courses" replace />
    }
  }

  return children
}
