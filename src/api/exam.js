import api from './client.js'

// Primary endpoints per provided docs use /exam. We include graceful fallbacks to /api/v1/exams
// to handle alternative deployments.

function pickData(res) {
  return res?.data?.data ?? res?.data
}

export async function listExams() {
  try {
    const res = await api.get('/exam')
    const d = pickData(res)
    return Array.isArray(d) ? d : (Array.isArray(d?.exams) ? d.exams : d)
  } catch (e) {
    const res = await api.get('/api/v1/exams')
    return pickData(res)
  }
}

export async function getExam(examId) {
  try {
    const res = await api.get(`/exam/get/${examId}`)
    return pickData(res)
  } catch (e) {
    const res = await api.get(`/api/v1/exams/${examId}`)
    return pickData(res)
  }
}

export async function addExam(payload) {
  // Expected fields: title, description, duration, questions, classLevel, isPublished, startDate, endDate
  try {
    const res = await api.post('/exam', payload)
    return pickData(res)
  } catch (e) {
    const res = await api.post('/api/v1/exams', payload)
    return pickData(res)
  }
}

export async function updateExam(examId, payload) {
  try {
    const res = await api.put(`/exam/${examId}`, payload)
    return pickData(res)
  } catch (e) {
    const res = await api.put(`/api/v1/exams/${examId}`, payload)
    return pickData(res)
  }
}

export async function deleteExam(examId) {
  try {
    const res = await api.delete(`/exam/${examId}`)
    return pickData(res)
  } catch (e) {
    const res = await api.delete(`/api/v1/exams/${examId}`)
    return pickData(res)
  }
}
