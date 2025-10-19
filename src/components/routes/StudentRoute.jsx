import React from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEntitlements } from '../../context/EntitlementsContext.jsx'

/**
 * StudentRoute: protects student content.
 * Props:
 * - requirePurchase: boolean (default: false)
 * - lessonIdParam: string name of route param that holds the lesson id (e.g. 'lessonId')
 */
export default function StudentRoute({ children, requirePurchase = false, lessonIdParam }){
  const { isAuthenticated, role } = useAuth()
  const { hasPurchasedLesson } = useEntitlements()
  const params = useParams()
  const location = useLocation()

  // Admin can always access
  if (role === 'admin') return children

  // Must be logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // If purchase is required for this route (e.g. video page of a lesson)
  if (requirePurchase) {
    const lessonId = lessonIdParam ? params[lessonIdParam] : undefined
    if (lessonId && !hasPurchasedLesson(lessonId)) {
      return <Navigate to="/courses" replace />
    }
  }

  return children
}
