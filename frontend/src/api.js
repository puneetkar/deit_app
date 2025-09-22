import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8001/api'

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function login(username, password) {
  const { data } = await api.post('/auth/login/', { username, password })
  localStorage.setItem('access', data.access)
  localStorage.setItem('refresh', data.refresh)
  return data
}

export async function refreshToken() {
  const refresh = localStorage.getItem('refresh')
  if (!refresh) throw new Error('No refresh token')
  const { data } = await api.post('/auth/refresh/', { refresh })
  localStorage.setItem('access', data.access)
  return data
}

export async function register(payload) {
  const { data } = await api.post('/auth/register/', payload)
  return data
}

export async function registerAndLogin(payload) {
  await register(payload)
  await login(payload.username, payload.password)
}

export async function getProfile() {
  const { data } = await api.get('/profile/')
  return data
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/profile/', payload)
  return data
}

export async function getDietSuggestion() {
  const { data } = await api.get('/diet/suggestion/')
  return data
}

export async function listDietPlans() {
  const { data } = await api.get('/diet/plans/')
  return data
}

export function logout() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

// Note: For production, avoid localStorage for tokens; use httpOnly cookies.



