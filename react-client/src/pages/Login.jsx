import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Logo } from "../components/Logo"
import { useAuth } from '../contexts/AuthContext'
import { cuentasData } from '../data/cuentasData'
import './Login.css'
import { Input } from '@chakra-ui/react'

const DEFAULT_ROUTES = {
	Jefe: '/Logs',
	Coordinador: '/Misiones',
	Asignador: '/Tripulantes',
	Registrador: '/Eventos',
	RRHH: '/Cuentas',
}

export function Login() {
	const navigate = useNavigate()
	const { login, user } = useAuth()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	if (user) {
		const home = DEFAULT_ROUTES[user.RolNombre] || '/Misiones'
		navigate(home, { replace: true })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setError('')
		const success = login(username, password)
		if (success) {
			const found = cuentasData.find(c => c.Usuario === username)
			const home = DEFAULT_ROUTES[found?.RolNombre] || '/Misiones'
			navigate(home)
		} else {
			setError('Usuario o contraseña incorrectos')
			setPassword('')
		}
	}

	return (
		<>
			<Background />
			<div className="login-wrapper">
				<div className="login-panel">
					<div className="logo-container">
						<Logo />
					</div>

					<form onSubmit={handleSubmit}>
						<p>Usuario</p>
						<Input
							placeholder='ingrese aqui'
							size='md'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<p>Contraseña</p>
						<Input
							placeholder='ingrese aqui'
							size='md'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<button id='login-button' type="submit">Iniciar sesión</button>

						{error && <p className="login-error">{error}</p>}
					</form>
				</div>
			</div>
		</>
	)
}
