import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { listLessons, deleteLesson } from '../../api/lesson.js'
import { Link, useNavigate } from 'react-router-dom'

export default function LessonsList() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await listLessons()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setLessons(arr)
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load lessons')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this lesson?')) return
    try {
      await deleteLesson(id)
      setLessons((xs) => xs.filter((x) => (x._id ?? x.id) !== id))
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || 'Delete failed')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lessons</h1>
            <p className="text-gray-600">Manage lessons for class levels</p>
          </div>
          <Link to="/dashboard/lessons/new" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">+ Add Lesson</Link>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{String(error)}</div>}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Scheduled</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lessons.map((ls) => {
                  const id = ls._id ?? ls.id
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">{ls.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ls.classLevel ?? '—'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ls.isPaid ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {ls.isPaid ? 'Paid' : 'Free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ls.price ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ls.scheduledDate ? new Date(ls.scheduledDate).toLocaleString() : '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/dashboard/lessons/edit/${id}`)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                          <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
