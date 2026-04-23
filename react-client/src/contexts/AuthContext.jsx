import { createContext, useContext, useState, useEffect } from 'react'
import { cuentasData } from '../data/cuentasData'

const AuthContext = createContext(null)

const ROLE_PERMISSIONS = {
	Jefe: ['*'],
	Asignador: [
		'tripulantes:create', 'tripulantes:delete', 'tripulantes:edit', 'tripulantes:view',
		'tripulantes:assign-mission',
		'misiones:view'
	],
	Coordinador: [
		'misiones:create', 'misiones:delete', 'misiones:edit', 'misiones:view',
		'misiones:start', 'misiones:end'
	],
	Registrador: [
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

	useEffect(() => {
		if (user) {
			sessionStorage.setItem('ikaros_user', JSON.stringify(user))
		} else {
			sessionStorage.removeItem('ikaros_user')
		}
	}, [user])

	const login = (username, password) => {
		const found = cuentasData.find(
			c => c.Usuario === username && c.Clave === password
		)
		if (found) {
			setUser(found)
			return true
		}
		return false
	}

	const logout = () => {
		setUser(null)
		sessionStorage.removeItem('ikaros_user')
	}

	const role = user?.RolNombre || null

	const hasPermission = (action) => {
		if (!user) return false
		const perms = ROLE_PERMISSIONS[user.RolNombre]
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
