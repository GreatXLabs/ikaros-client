import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'
import GalaxyBackground from '../components/GalaxyBackground'
import './Landing.css'

const NAV_ITEMS = [
  { label: 'Proyecto', id: 'proyecto' },
  { label: 'Cómo Funciona', id: 'como-funciona' },
  { label: 'Equipo', id: 'equipo' },
  { label: 'Capturas', id: 'capturas' },
]

export function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/Logs', { replace: true })
    }
  }, [user, navigate])

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="landing-page-wrapper">
      <GalaxyBackground style={{ zIndex: -10000 }} />

      <div className="landing-view">
        <header className='header-landing'>
          <nav className="landing-nav">
            {NAV_ITEMS.map(item => (
              <button key={item.id} className="landing-nav-btn" onClick={() => scrollTo(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          <Logo/>

          <div className="landing-nav login-container">
              <button className="landing-nav-btn login-btn" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </button>

          </div>
        </header>

        <div className="hero">
          <h1>Nacimos mirando al cielo.</h1>
        </div>
      </div>

    <div className="separator"></div>
      <div className="section-container project-info" id='proyecto'>
            <h2>¿Que es Ikaros?</h2>
            <p>Ikaros es un sistema de registro y relevo de información para misiones espaciales. Centraliza el flujo de eventos a lo largo de toda la misión, permitiendo que cada área operativa acceda a la información que necesita en el momento justo, con los permisos correspondientes a su función. De esta forma, el equipo puede coordinar tareas, dar seguimiento a lo que ocurre y mantener trazabilidad de cada evento sin depender de canales dispersos o información descentralizada.</p>

      </div>

      <div className="section-container project-info" id='proyecto'>
            <h2>Cómo funciona.</h2>
            <p>
              Ikaros tiene una arquitectura cliente-servidor con tres capas. El cliente web está construido en React, y se comunica vía HTTP con un gateway en Java Spring Boot, que actúa de intermediario. Este gateway traduce cada petición HTTP en un mensaje de texto y lo envía al servidor de negocio a través de un socket TCP, usando un protocolo de aplicación propio (formato OPERACION|token|param1|param2|...).
              El servidor —escrito en Java nativo, sin frameworks— es el corazón del sistema: valida sesiones y permisos por rol, procesa cada operación (registrar tripulantes, gestionar misiones, registrar eventos, etc.) y devuelve una respuesta en el mismo formato de texto.
            </p>

            <div className="stack">
              <ul>
                <li>Cliente web: React</li>
                <li>Gateway: Java + Spring Boot (puente HTTP y socket TCP)</li>
                <li>Servidor de negocio: Java nativo, comunicación por sockets TCP</li>
                <li>Persistencia (v1): MariaDB</li>
              </ul>
            </div>

      </div>

      <footer>


      </footer>
    </div>
  )
}
