import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { addQuestion, getQuestion, updateQuestion } from '../../api/question.js'
import { listExams } from '../../api/exam.js'
import { useNavigate, useParams } from 'react-router-dom'

export default function QuestionForm() {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(questionId)

  const [form, setForm] = useState({
    text: '',
    type: 'multiple-choice',
    options: '',
    correctAnswer: '',
    exam: '',
    points: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exams, setExams] = useState([])

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return
      setLoading(true)
      try {
        const data = await getQuestion(questionId)
        const q = data?.data ?? data
        setForm({
          text: q.text ?? '',
          type: q.type ?? 'multiple-choice',
          options: Array.isArray(q.options) ? q.options.join('\n') : (q.options ?? ''),
          correctAnswer: q.correctAnswer ?? '',
          exam: q.exam ?? '',
          points: q.points ?? 1,
        })
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load question')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isEdit, questionId])

  // load exams to populate select
  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await listExams()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        // normalize minimal structure
        const normalized = arr.map((e) => ({
          id: e._id ?? e.id,
          title: e.title ?? 'Untitled exam',
        }))
        setExams(normalized)
      } catch {
        setExams([])
      }
    }
    loadExams()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        options: form.type === 'multiple-choice' ? form.options.split('\n').map(s => s.trim()).filter(Boolean) : [],
        points: Number(form.points) || 1,
      }
      if (isEdit) {
        await updateQuestion(questionId, payload)
      } else {
        await addQuestion(payload)
      }
      navigate('/dashboard/questions')
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Question' : 'Add Question'}</h1>
        {error && <div className="text-red-600 mb-4">{String(error)}</div>}
        <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <textarea value={form.text} onChange={(e)=>setForm(f=>({...f,text:e.target.value}))} className="w-full border rounded p-2" rows={3} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={(e)=>setForm(f=>({...f,type:e.target.value}))} className="w-full border rounded p-2">
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True / False</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </select>
          </div>
          {form.type === 'multiple-choice' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options (one per line)</label>
              <textarea value={form.options} onChange={(e)=>setForm(f=>({...f,options:e.target.value}))} className="w-full border rounded p-2" rows={4} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
            <input value={form.correctAnswer} onChange={(e)=>setForm(f=>({...f,correctAnswer:e.target.value}))} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select value={form.exam} onChange={(e)=>setForm(f=>({...f,exam:e.target.value}))} className="w-full border rounded p-2" required>
              <option value="" disabled>Select exam...</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input type="number" min="1" value={form.points} onChange={(e)=>setForm(f=>({...f,points:e.target.value}))} className="w-full border rounded p-2" />
          </div>
          <div className="flex gap-3">
            <button disabled={loading} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={()=>navigate('/dashboard/questions')} className="rounded border px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}


