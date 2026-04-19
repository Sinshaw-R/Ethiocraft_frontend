'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'AGENT' | 'ARTISAN' | null

interface AuthContextType {
  token: string | null
  role: UserRole
  login: (token: string, role: UserRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'authToken'
const ROLE_KEY = 'authRole'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>(null)

  // Rehydrate from localStorage on first mount (client-only)
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedRole = localStorage.getItem(ROLE_KEY) as UserRole | null
    if (storedToken) setToken(storedToken)
    if (storedRole) setRole(storedRole)
  }, [])

  const login = (newToken: string, newRole: UserRole) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(ROLE_KEY, newRole ?? '')
    setToken(newToken)
    setRole(newRole)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    setToken(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
