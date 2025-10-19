import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { listQuestions, deleteQuestion } from '../../api/question.js'
import { Link, useNavigate } from 'react-router-dom'

export default function QuestionsList() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await listQuestions()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setQuestions(arr)
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onDelete = async (id) => {
    if (!confirm('Delete this question?')) return
    try {
      await deleteQuestion(id)
      setQuestions((qs) => qs.filter((q) => (q._id ?? q.id) !== id))
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Questions</h1>
            <p className="text-gray-600">Manage all questions in the system</p>
          </div>
          <Link to="/dashboard/questions/new" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">+ Add Question</Link>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{String(error)}</div>}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Text</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((q) => {
                  const id = q._id ?? q.id
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-900">{q.text}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{q.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{q.exam}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{q.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => navigate(`/dashboard/questions/edit/${id}`)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                        <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-800">Delete</button>
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


