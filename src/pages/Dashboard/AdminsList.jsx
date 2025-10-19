import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { listAdmins } from '../../api/admin.js'
import { Link } from 'react-router-dom'

export default function AdminsList(){
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await listAdmins()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setAdmins(arr)
      } catch(e){
        setError(e?.response?.data?.message || e?.message || 'Failed to load admins')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admins</h1>
            <p className="text-gray-600">List of admins in the platform</p>
          </div>
          <Link to="/dashboard/admins/new" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">+ Create Admin</Link>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600 mb-4">{String(error)}</div>}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((a) => {
                  const id = a._id ?? a.id
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{a.fullName ?? a.name ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{a.email ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{a.phoneNumber ?? a.phone ?? '—'}</td>
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
