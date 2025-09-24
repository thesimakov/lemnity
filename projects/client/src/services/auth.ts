import axios from 'axios'
import { http } from '@common/api/http.ts'
import { API } from '@common/api/endpoints.ts'

interface IAuthPayload {
  email: string
  password: string
}

type AuthResponse = { accessToken: string }

export async function login(payload: IAuthPayload): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>(API.AUTH.LOGIN, payload, {
    withCredentials: true
  })
  return data
}

export async function register(payload: IAuthPayload): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>(API.AUTH.REGISTER, payload, {
    withCredentials: true
  })
  return data
}

export async function refreshToken(): Promise<string | null> {
  try {
    // Используем "чистый" axios, без интерсепторов http, чтобы избежать циклов
    const baseURL = import.meta.env.VITE_API_URL || http.defaults.baseURL
    const res = await axios.post<{ accessToken: string }>(API.AUTH.REFRESH, null, {
      baseURL,
      withCredentials: true,
      timeout: 1000
    })
    return res.data?.accessToken ?? null
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    await http.post(API.AUTH.LOGOUT, null, { withCredentials: true })
  } catch {
    // игнорируем сетевые ошибки при попытке логаута
  }
}
