import api from './client.js'

export async function listQuestions() {
  const res = await api.get('/question')
  return res.data?.data ?? res.data
}

export async function getQuestion(questionId) {
  const res = await api.get(`/question/get/${questionId}`)
  return res.data?.data ?? res.data
}

export async function addQuestion(payload) {
  const res = await api.post('/question', payload)
  return res.data?.data ?? res.data
}

export async function updateQuestion(questionId, payload) {
  const res = await api.put(`/question/${questionId}`, payload)
  return res.data?.data ?? res.data
}

export async function deleteQuestion(questionId) {
  const res = await api.delete(`/question/${questionId}`)
  return res.data?.data ?? res.data
}


