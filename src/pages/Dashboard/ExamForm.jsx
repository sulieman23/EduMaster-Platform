import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { addExam, getExam, updateExam } from '../../api/exam.js'
import { listQuestions } from '../../api/question.js'
import { useNavigate, useParams } from 'react-router-dom'

export default function ExamForm() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(examId)

  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 60,
    classLevel: '',
    isPublished: false,
    startDate: '',
    endDate: '',
    questions: [], 
  })
  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await listQuestions()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setAllQuestions(arr)
      } catch (e) {
        setAllQuestions([])
      }
    }
    loadQuestions()
  }, [])

  useEffect(() => {
    const loadExam = async () => {
      if (!isEdit) return
      setLoading(true)
      try {
        const data = await getExam(examId)
        const ex = data?.data ?? data
        setForm({
          title: ex.title ?? '',
          description: ex.description ?? '',
          duration: ex.duration ?? 60,
          classLevel: ex.classLevel ?? '',
          isPublished: !!ex.isPublished,
          startDate: ex.startDate ? new Date(ex.startDate).toISOString().slice(0,16) : '',
          endDate: ex.endDate ? new Date(ex.endDate).toISOString().slice(0,16) : '',
          questions: Array.isArray(ex.questions) ? ex.questions.map(q => q._id ?? q.id ?? q) : [],
        })
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load exam')
      } finally {
        setLoading(false)
      }
    }
    loadExam()
  }, [isEdit, examId])

  const toggleQuestion = (qid) => {
    setForm(f => {
      const exists = f.questions.includes(qid)
      return { ...f, questions: exists ? f.questions.filter(id => id !== qid) : [...f.questions, qid] }
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        duration: Number(form.duration) || 0,
        classLevel: form.classLevel || undefined,
        isPublished: !!form.isPublished,
        questions: form.questions,
        startDate: form.startDate ? new Date(form.startDate) : undefined,
        endDate: form.endDate ? new Date(form.endDate) : undefined,
      }
      if (isEdit) await updateExam(examId, payload)
      else await addExam(payload)
      navigate('/dashboard/exams')
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Exam' : 'Add Exam'}</h1>
        {error && <div className="text-red-600 mb-4">{String(error)}</div>}
        <form onSubmit={onSubmit} className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} className="w-full border rounded p-2" rows={3} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input type="number" min="1" value={form.duration} onChange={(e)=>setForm(f=>({...f,duration:e.target.value}))} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
              <input value={form.classLevel} onChange={(e)=>setForm(f=>({...f,classLevel:e.target.value}))} className="w-full border rounded p-2" />
            </div>
            <div className="flex items-end gap-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.isPublished} onChange={(e)=>setForm(f=>({...f,isPublished:e.target.checked}))} />
                <span>Published</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="datetime-local" value={form.startDate} onChange={(e)=>setForm(f=>({...f,startDate:e.target.value}))} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={(e)=>setForm(f=>({...f,endDate:e.target.value}))} className="w-full border rounded p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
            <div className="max-h-64 overflow-auto border rounded p-3 space-y-2">
              {allQuestions.length === 0 && (
                <div className="text-sm text-gray-500">No questions found or failed to load.</div>
              )}
              {allQuestions.map((q) => {
                const id = q._id ?? q.id
                const checked = form.questions.includes(id)
                return (
                  <label key={id} className="flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={checked} onChange={()=>toggleQuestion(id)} />
                    <span className="truncate">{q.text}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button disabled={loading} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={()=>navigate('/dashboard/exams')} className="rounded border px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
