import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Login } from './pages/Login'
import { Logs } from './pages/Logs'
import { Misiones } from './pages/Misiones'
import { Eventos } from './pages/Eventos'
import { Tripulantes } from './pages/Tripulantes'
import { Cuentas } from './pages/Cuentas'
import { MisionView } from './pages/MisionView'
import { TripulanteView } from './pages/TripulanteView'
import { NuevaMision } from './pages/NuevaMision'
import { EditarMision } from './pages/EditarMision'
import { NuevoTripulante } from './pages/NuevoTripulante'
import { EditarTripulante } from './pages/EditarTripulante'
import { NuevaCuenta } from './pages/NuevaCuenta'
import { EditarCuenta } from './pages/EditarCuenta'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const ROUTE_PERMISSIONS = {
  '/Logs': 'logs:view',
  '/Misiones': 'misiones:view',
  '/Eventos': 'eventos:view',
  '/Tripulantes': 'tripulantes:view',
  '/Cuentas': 'cuentas:view',
}

const DEFAULT_ROUTES = {
  JEFE: '/Logs',
  COORDINADOR: '/Misiones',
  ASIGNADOR: '/Tripulantes',
  REGISTRADOR: '/Eventos',
  RRHH: '/Cuentas',
}

function RequireAuth({ children }) {
  const { user, hasPermission } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/" replace />
  }

  const basePath = '/' + location.pathname.split('/')[1]
  const required = ROUTE_PERMISSIONS[basePath]
  if (required && !hasPermission(required)) {
    const fallback = DEFAULT_ROUTES[user.RolNombre?.toUpperCase()] || '/'
    return <Navigate to={fallback} replace />
  }

  return children
}

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Logs" element={<RequireAuth><Logs /></RequireAuth>} />
            <Route path="/Misiones" element={<RequireAuth><Misiones /></RequireAuth>} />
            <Route path="/Misiones/Nueva" element={<RequireAuth><NuevaMision /></RequireAuth>} />
            <Route path="/Misiones/:id/Editar" element={<RequireAuth><EditarMision /></RequireAuth>} />
            <Route path="/Misiones/:id" element={<RequireAuth><MisionView /></RequireAuth>} />
            <Route path="/Eventos" element={<RequireAuth><Eventos /></RequireAuth>} />
            <Route path="/Tripulantes" element={<RequireAuth><Tripulantes /></RequireAuth>} />
            <Route path="/Tripulantes/Nuevo" element={<RequireAuth><NuevoTripulante /></RequireAuth>} />
            <Route path="/Tripulantes/:id/Editar" element={<RequireAuth><EditarTripulante /></RequireAuth>} />
            <Route path="/Tripulantes/:id" element={<RequireAuth><TripulanteView /></RequireAuth>} />
            <Route path="/Cuentas" element={<RequireAuth><Cuentas /></RequireAuth>} />
            <Route path="/Cuentas/Nueva" element={<RequireAuth><NuevaCuenta /></RequireAuth>} />
            <Route path="/Cuentas/:id/Editar" element={<RequireAuth><EditarCuenta /></RequireAuth>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App
