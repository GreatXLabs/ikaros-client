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
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      </div>

      <footer>


      </footer>
    </div>
  )
}
