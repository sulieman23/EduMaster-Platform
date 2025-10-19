import api from './client.js'

function pick(res) { return res?.data?.data ?? res?.data }

function toQuery(params = {}) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    q.append(k, v)
  })
  const s = q.toString()
  return s ? `?${s}` : ''
}

export async function listLessons(params = {}) {
  // supports admin filters like classLevel, isPaid, title, sortBy, sortOrder, priceMin, priceMax, scheduledAfter, page, limit
  const qs = toQuery(params)
  const res = await api.get(`/lesson/${qs}`)
  const d = pick(res)
  // ensure array
  if (Array.isArray(d)) return d
  if (Array.isArray(d?.lessons)) return d.lessons
  if (Array.isArray(d?.data)) return d.data
  return d
}

export async function getLesson(lessonId) {
  const res = await api.get(`/lesson/${lessonId}`)
  return pick(res)
}

export async function addLesson(payload) {
  // server validates duplicate title etc.
  const res = await api.post('/lesson', payload)
  return pick(res)
}

export async function updateLesson(lessonId, payload) {
  const res = await api.put(`/lesson/${lessonId}`, payload)
  return pick(res)
}

export async function deleteLesson(lessonId) {
  const res = await api.delete(`/lesson/${lessonId}`)
  return pick(res)
}

export async function payLesson(lessonId) {
  const res = await api.post(`/lesson/pay/${lessonId}`)
  return pick(res)
}
