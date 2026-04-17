import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Login } from './pages/Login';
import { Logs } from './pages/Logs';
import { Misiones } from './pages/Misiones';
import { Eventos } from './pages/Eventos';
import { Tripulantes } from './pages/Tripulantes';
import { Cuentas } from './pages/Cuentas';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return(
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Logs" element={<Logs />} />
          <Route path="/Misiones" element={<Misiones />} />
          <Route path="/Eventos" element={<Eventos />} />
          <Route path="/Tripulantes" element={<Tripulantes />} />
          <Route path="/Cuentas" element={<Cuentas />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App