import api from './client.js'

export async function login({email,password}) { 
  const res = await api.post('/auth/login',{email,password}); 
  return res.data; 
}

export async function register(payload) { 
  const res = await api.post('/user/register', payload); 
  return res.data; 
}
