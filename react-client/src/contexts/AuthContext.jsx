import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as apiLogin, checkSession } from '../services/ikarosApi'

const AuthContext = createContext(null)

const ROLE_PERMISSIONS = {
  JEFE: ['*'],
  ASIGNADOR: [
    'tripulantes:create', 'tripulantes:delete', 'tripulantes:edit', 'tripulantes:view',
    'tripulantes:assign-mission',
    'misiones:view'
  ],
  COORDINADOR: [
    'misiones:create', 'misiones:delete', 'misiones:edit', 'misiones:view',
    'misiones:start', 'misiones:end'
  ],
  REGISTRADOR: [
    'eventos:create', 'eventos:delete', 'eventos:view',
    'misiones:view'
  ],
  RRHH: [
    'cuentas:create', 'cuentas:delete', 'cuentas:edit', 'cuentas:view'
  ]
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('ikaros_user')
    return stored ? JSON.parse(stored) : null
  })

  // limpio la sesión cuando se dispara auth:expired
  useEffect(() => {
    const handleExpired = () => setUser(null)
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  useEffect(() => {
    if (!user?.token) return

    const interval = setInterval(async () => {
      try {
        const res = await checkSession()
        if (!res.success) {
          sessionStorage.removeItem('ikaros_user')
          setUser(null)
        }
      } catch {
        // error de red, lo ignoro y reintenta solo
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [user?.token])

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('ikaros_user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('ikaros_user')
    }
  }, [user])

  const login = async (username, password) => {
    try {
      const res = await apiLogin(username, password)
      if (res.success) {
        const userData = {
          token: res.token,
          RolNombre: res.rol
        }
        setUser(userData)
        return { ok: true, user: userData }
      }
      return { ok: false, error: res.message || 'Usuario o contraseña incorrectos' }
    } catch {
      return { ok: false, error: 'Error de conexión con el servidor' }
    }
  }

  const clearSession = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('ikaros_user')
  }, [])

  const logout = () => {
    clearSession()
  }

  const role = user?.RolNombre || null

  const hasPermission = (action) => {
    if (!user) return false
    const normalizedRole = user.RolNombre?.toUpperCase()
    const perms = ROLE_PERMISSIONS[normalizedRole]
    if (!perms) return false
    if (perms.includes('*')) return true
    return perms.includes(action)
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
