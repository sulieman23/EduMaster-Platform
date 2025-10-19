import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { addLesson, getLesson, updateLesson } from '../../api/lesson.js'
import { useNavigate, useParams } from 'react-router-dom'

export default function LessonForm() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(lessonId)

  const [form, setForm] = useState({
    title: '',
    description: '',
    classLevel: '',
    isPaid: false,
    price: '',
    scheduledDate: '',
    video: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return
      setLoading(true)
      try {
        const data = await getLesson(lessonId)
        const ls = data?.data ?? data
        setForm({
          title: ls.title ?? '',
          description: ls.description ?? '',
          classLevel: ls.classLevel ?? '',
          isPaid: !!ls.isPaid,
          price: ls.price ?? '',
          scheduledDate: ls.scheduledDate ? new Date(ls.scheduledDate).toISOString().slice(0,16) : '',
          video: ls.video ?? ls.videoUrl ?? '',
          image: ls.image ?? ls.thumbnail ?? '',
        })
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isEdit, lessonId])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        classLevel: form.classLevel || undefined,
        isPaid: !!form.isPaid,
        price: form.isPaid ? Number(form.price) || 0 : undefined,
        scheduledDate: form.scheduledDate ? new Date(form.scheduledDate) : undefined,
        video: form.video || undefined,
        image: form.image || undefined,
      }
      if (isEdit) await updateLesson(lessonId, payload)
      else await addLesson(payload)
      navigate('/dashboard/lessons')
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Lesson' : 'Add Lesson'}</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Level</label>
              <input value={form.classLevel} onChange={(e)=>setForm(f=>({...f,classLevel:e.target.value}))} className="w-full border rounded p-2" />
            </div>
            <div className="flex items-end gap-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.isPaid} onChange={(e)=>setForm(f=>({...f,isPaid:e.target.checked}))} />
                <span>Paid</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setForm(f=>({...f,price:e.target.value}))} className="w-full border rounded p-2" disabled={!form.isPaid} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
              <input type="datetime-local" value={form.scheduledDate} onChange={(e)=>setForm(f=>({...f,scheduledDate:e.target.value}))} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
              <input value={form.video} onChange={(e)=>setForm(f=>({...f,video:e.target.value}))} className="w-full border rounded p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={form.image} onChange={(e)=>setForm(f=>({...f,image:e.target.value}))} className="w-full border rounded p-2" />
          </div>
          <div className="flex gap-3">
            <button disabled={loading} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={()=>navigate('/dashboard/lessons')} className="rounded border px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
