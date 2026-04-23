import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

function RequireAuth({ children }) {
	const { user } = useAuth()
	const location = useLocation()

	if (!user) {
		return <Navigate to="/" state={{ from: location }} replace />
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
