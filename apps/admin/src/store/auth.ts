import { create } from 'zustand'

interface UserInfo {
  name: string
  role: string
}

interface AuthState {
  token: string | null
  user: UserInfo | null
  setAuth: (token: string, user: UserInfo) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  user: typeof window !== 'undefined' && localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null,
  setAuth: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    }
    set({ token, user })
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    set({ token: null, user: null })
  },
}))
