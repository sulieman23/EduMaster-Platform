import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { listUsers } from '../../api/admin.js'

export default function UsersList(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await listUsers()
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        setUsers(arr)
      } catch(e){
        setError(e?.response?.data?.message || e?.message || 'Failed to load users')
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">All platform users</p>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => {
                  const id = u._id ?? u.id
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{u.fullName ?? u.name ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.email ?? '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.role ?? '—'}</td>
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
