import { HashRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Logs" element={<Logs />} />
          <Route path="/Misiones" element={<Misiones />} />
          <Route path="/Misiones/Nueva" element={<NuevaMision />} />
          <Route path="/Misiones/:id/Editar" element={<EditarMision />} />
          <Route path="/Misiones/:id" element={<MisionView />} />
          <Route path="/Eventos" element={<Eventos />} />
          <Route path="/Tripulantes" element={<Tripulantes />} />
          <Route path="/Tripulantes/Nuevo" element={<NuevoTripulante />} />
          <Route path="/Tripulantes/:id/Editar" element={<EditarTripulante />} />
          <Route path="/Tripulantes/:id" element={<TripulanteView />} />
          <Route path="/Cuentas" element={<Cuentas />} />
          <Route path="/Cuentas/Nueva" element={<NuevaCuenta />} />
          <Route path="/Cuentas/:id/Editar" element={<EditarCuenta />} />
          <Route path="/TripulanteView" element={<TripulanteView />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
