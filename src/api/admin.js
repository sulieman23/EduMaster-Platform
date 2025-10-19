import api from './client.js'

function pick(res){ return res?.data?.data ?? res?.data }

export async function createAdmin(payload){
  // payload: { fullName, email, phoneNumber, password, cpassword }
  const res = await api.post('/admin/create-admin', payload)
  return pick(res)
}

export async function listAdmins(){
  const res = await api.get('/admin/all-admin')
  return pick(res)
}

export async function listUsers(){
  const res = await api.get('/admin/all-user')
  return pick(res)
}
