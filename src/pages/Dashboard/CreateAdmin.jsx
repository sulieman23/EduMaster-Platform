import { useState } from 'react'
import Sidebar from '../../components/Sidebar.jsx'
import { createAdmin } from '../../api/admin.js'
import { useNavigate } from 'react-router-dom'

export default function CreateAdmin(){
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    cpassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await createAdmin(form)
      setSuccess('Admin created successfully')
      setTimeout(()=>navigate('/dashboard/admins'), 700)
    } catch(e){
      setError(e?.response?.data?.message || e?.message || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Admin</h1>
        {error && <div className="mb-4 text-red-600">{String(error)}</div>}
        {success && <div className="mb-4 text-green-700">{success}</div>}
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input value={form.fullName} onChange={(e)=>setForm(f=>({...f,fullName:e.target.value}))} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} className="w-full border rounded p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input value={form.phoneNumber} onChange={(e)=>setForm(f=>({...f,phoneNumber:e.target.value}))} className="w-full border rounded p-2" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} className="w-full border rounded p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" value={form.cpassword} onChange={(e)=>setForm(f=>({...f,cpassword:e.target.value}))} className="w-full border rounded p-2" required />
            </div>
          </div>
          <div className="flex gap-3">
            <button disabled={loading} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={()=>navigate('/dashboard/admins')} className="rounded border px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
