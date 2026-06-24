import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from "../components/Logo"
import { useAuth } from '../contexts/AuthContext'
import './Login.css'
import GalaxyBackground from '../components/GalaxyBackground'
import { Input } from '@chakra-ui/react'

const DEFAULT_ROUTES = {
  JEFE: '/Logs',
  COORDINADOR: '/Misiones',
  ASIGNADOR: '/Tripulantes',
  REGISTRADOR: '/Eventos',
  RRHH: '/Cuentas',
}

export function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      const home = DEFAULT_ROUTES[user.RolNombre?.toUpperCase()] || '/Misiones'
      navigate(home, { replace: true })
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const result = await login(username, password)
      if (result.ok) {
        const home = DEFAULT_ROUTES[result.user.RolNombre?.toUpperCase()] || '/Misiones'
        navigate(home, { replace: true })
      } else {
        setError(result.error || 'Usuario o contraseña incorrectos')
        setPassword('')
      }
    } catch {
      setError('Error de conexión con el servidor')
      setPassword('')
    }
  }

  return (
    <>
      <GalaxyBackground style={{ zIndex: -10000 }} />

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
