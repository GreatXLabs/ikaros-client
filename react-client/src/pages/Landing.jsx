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
              <div className="stack-item">
                <div className="stack-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Cliente web</span>
                  <span className="stack-desc">React</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="stack-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Gateway</span>
                  <span className="stack-desc">Java + Spring Boot · puente HTTP ↔ socket TCP</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="stack-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M20 15h2"/></svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Servidor de negocio</span>
                  <span className="stack-desc">Java nativo · comunicación por sockets TCP</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="stack-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Persistencia (v1)</span>
                  <span className="stack-desc">MariaDB</span>
                </div>
              </div>
            </div>

            <h3>Evolución del proyecto</h3>
            <p>
              La primera versión del servidor procesa una conexión a la vez —acepta un cliente, atiende sus solicitudes, y solo entonces pasa al siguiente— y usa una única conexión a la base de datos, compartida y sin sincronización. Funciona, pero no escala: dos clientes en simultáneo pueden generar resultados inconsistentes.
              Por eso el equipo está migrando a una segunda versión con concurrencia real, donde cada conexión se atiende en su propio hilo (o mediante un thread pool), y la persistencia se mueve de MariaDB a archivos sincronizados entre sí, eliminando la dependencia de un motor de base de datos externo.
            </p>


      </div>
      <div className="separator"></div>


      <footer>


      </footer>
    </div>
  )
}
