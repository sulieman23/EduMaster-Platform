import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { listLessons } from '../api/lesson.js'
import api from '../api/client.js'

const EntitlementsContext = createContext(null)

export function EntitlementsProvider({ children }){
  const { isAuthenticated, role } = useAuth()
  const [loading, setLoading] = useState(false)
  const [purchasedLessons, setPurchasedLessons] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchPurchases = async () => {
      if (!isAuthenticated) { setPurchasedLessons([]); return }
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/lesson/my/purchased')
        const d = res?.data?.data ?? res?.data
        const arr = Array.isArray(d) ? d : (Array.isArray(d?.lessons) ? d.lessons : [])
        if (mounted) setPurchasedLessons(arr)
      } catch (e) {
        try {
          const data = await listLessons({})
          if (mounted) setPurchasedLessons(Array.isArray(data) ? data.filter(x=>x.isPurchased) : [])
        } catch {
          if (mounted) setPurchasedLessons([])
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPurchases()
    return () => { mounted = false }
  }, [isAuthenticated])

  const hasAnyPurchase = purchasedLessons && purchasedLessons.length > 0

  const hasPurchasedLesson = (lessonId) => {
    return purchasedLessons.some(l => (l._id ?? l.id) === lessonId)
  }

  const canAccessExams = role === 'admin' || hasAnyPurchase

  const value = useMemo(() => ({
    loading,
    error,
    purchasedLessons,
    hasAnyPurchase,
    hasPurchasedLesson,
    canAccessExams,
  }), [loading, error, purchasedLessons, hasAnyPurchase, canAccessExams])

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  )
}

export function useEntitlements(){
  const ctx = useContext(EntitlementsContext)
  if (!ctx) throw new Error('useEntitlements must be used within EntitlementsProvider')
  return ctx
}
