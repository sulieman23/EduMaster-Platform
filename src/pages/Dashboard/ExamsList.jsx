import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { listExams, deleteExam } from '../../api/exam.js'
import { Link, useNavigate } from 'react-router-dom'

export default function ExamsList() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await listExams()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setExams(arr)
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load exams')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this exam? This will also delete its related questions.')) return
    try {
      await deleteExam(id)
      setExams((xs) => xs.filter((x) => (x._id ?? x.id) !== id))
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Exams</h1>
            <p className="text-gray-600">Manage exams and their associated questions</p>
          </div>
          <Link to="/dashboard/exams/new" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">+ Add Exam</Link>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{String(error)}</div>}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Published</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((ex) => {
                  const id = ex._id ?? ex.id
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">{ex.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ex.duration ?? '—'} min</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ex.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                          {ex.isPublished ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{Array.isArray(ex.questions) ? ex.questions.length : '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/dashboard/exams/edit/${id}`)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
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
