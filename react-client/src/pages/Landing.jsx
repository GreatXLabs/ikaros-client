import { useEffect, useRef, useCallback } from 'react'
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

  // Scroll to top on mount/reload
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Scroll-triggered reveal animations
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
      <div className="section-container project-info reveal" id='proyecto'>
            <h2>¿Que es Ikaros?</h2>
            <p>Ikaros es un sistema de registro y relevo de información para misiones espaciales. Centraliza el flujo de eventos a lo largo de toda la misión, permitiendo que cada área operativa acceda a la información que necesita en el momento justo, con los permisos correspondientes a su función. De esta forma, el equipo puede coordinar tareas, dar seguimiento a lo que ocurre y mantener trazabilidad de cada evento sin depender de canales dispersos o información descentralizada.</p>

      </div>

      <div className="section-container project-info reveal" id='como-funciona'>
            <h2>Cómo funciona.</h2>
            <p>
              Ikaros tiene una arquitectura cliente-servidor con tres capas. El cliente web está construido en React, y se comunica vía HTTP con un gateway en Java Spring Boot, que actúa de intermediario. Este gateway traduce cada petición HTTP en un mensaje de texto y lo envía al servidor de negocio a través de un socket TCP, usando un protocolo de aplicación propio (formato OPERACION|token|param1|param2|...).
              El servidor —escrito en Java nativo, sin frameworks— es el corazón del sistema: valida sesiones y permisos por rol, procesa cada operación (registrar tripulantes, gestionar misiones, registrar eventos, etc.) y devuelve una respuesta en el mismo formato de texto.
            </p>

            <div className="stack">
              <div className="stack-item">
                <div className="stack-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" fill="white"/>
                  </svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Cliente web</span>
                  <span className="stack-desc">React</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="stack-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m23.693 10.7058-4.73-8.1844c-.4094-.7106-1.4166-1.2942-2.2402-1.2942H7.2725c-.819 0-1.8308.5836-2.2402 1.2942L.307 10.7058c-.4095.7106-.4095 1.873 0 2.5837l4.7252 8.189c.4094.7107 1.4166 1.2943 2.2402 1.2943h9.455c.819 0 1.826-.5836 2.2402-1.2942l4.7252-8.189c.4095-.7107.4095-1.8732 0-2.5838zM10.9763 5.7547c0-.5365.4377-.9742.9742-.9742s.9742.4377.9742.9742v5.8217c0 .5366-.4377.9742-.9742.9742s-.9742-.4376-.9742-.9742zm.9742 12.4294c-3.6427 0-6.6077-2.965-6.6077-6.6077.0047-2.0896.993-4.0521 2.6685-5.304a.8657.8657 0 0 1 1.2142.1788.8657.8657 0 0 1-.1788 1.2143c-2.1602 1.6048-2.612 4.6592-1.0072 6.8194 1.6049 2.1603 4.6593 2.612 6.8195 1.0072 1.2378-.9177 1.9673-2.372 1.9673-3.9157a4.8972 4.8972 0 0 0-1.9861-3.925c-.386-.2824-.466-.8284-.1836-1.2143.2824-.386.8283-.466 1.2143-.1835 1.6895 1.2471 2.6826 3.2238 2.6873 5.3228 0 3.6474-2.965 6.6077-6.6077 6.6077z" fill="white"/>
                  </svg>  
                  
                </div>
                <div className="stack-info">
                  <span className="stack-label">Gateway</span>
                  <span className="stack-desc">Java + Spring Boot · puente HTTP ↔ socket TCP</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="stack-icon">
                  
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.915 0 11.7.215C9.515 2.4 7.47 6.39 6.046 10.483c-1.064 1.024-3.633 2.81-3.711 3.551-.093.87 1.746 2.611 1.55 3.235-.198.625-1.304 1.408-1.014 1.939.1.188.823.011 1.277-.491a13.389 13.389 0 0 0-.017 2.14c.076.906.27 1.668.643 2.232.372.563.956.911 1.667.911.397 0 .727-.114 1.024-.264.298-.149.571-.33.91-.5.68-.34 1.634-.666 3.53-.604 1.903.062 2.872.39 3.559.704.687.314 1.15.664 1.925.664.767 0 1.395-.336 1.807-.9.412-.563.631-1.33.72-2.24.06-.623.055-1.32 0-2.066.454.45 1.117.604 1.213.424.29-.53-.816-1.314-1.013-1.937-.198-.624 1.642-2.366 1.549-3.236-.08-.748-2.707-2.568-3.748-3.586C16.428 6.374 14.308 2.394 12.13.215zm.175 6.038a2.95 2.95 0 0 1 2.943 2.942 2.95 2.95 0 0 1-2.943 2.943A2.95 2.95 0 0 1 9.148 8.98a2.95 2.95 0 0 1 2.942-2.942zM8.685 7.983a3.515 3.515 0 0 0-.145.997c0 1.951 1.6 3.55 3.55 3.55 1.95 0 3.55-1.598 3.55-3.55 0-.329-.046-.648-.132-.951.334.095.64.208.915.336a42.699 42.699 0 0 1 2.042 5.829c.678 2.545 1.01 4.92.846 6.607-.082.844-.29 1.51-.606 1.94-.315.431-.713.651-1.315.651-.593 0-.932-.27-1.673-.61-.741-.338-1.825-.694-3.792-.758-1.974-.064-3.073.293-3.821.669-.375.188-.659.373-.911.5s-.466.2-.752.2c-.53 0-.876-.209-1.16-.64-.285-.43-.474-1.101-.545-1.948-.141-1.693.176-4.069.823-6.614a43.155 43.155 0 0 1 1.934-5.783c.348-.167.749-.31 1.192-.425zm-3.382 4.362a.216.216 0 0 1 .13.031c-.166.56-.323 1.116-.463 1.665a33.849 33.849 0 0 0-.547 2.555 3.9 3.9 0 0 0-.2-.39c-.58-1.012-.914-1.642-1.16-2.08.315-.24 1.679-1.755 2.24-1.781zm13.394.01c.562.027 1.926 1.543 2.24 1.783-.246.438-.58 1.068-1.16 2.08a4.428 4.428 0 0 0-.163.309 32.354 32.354 0 0 0-.562-2.49 40.579 40.579 0 0 0-.482-1.652.216.216 0 0 1 .127-.03z" fill="white"/>
                  </svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Servidor de negocio</span>
                  <span className="stack-desc">Java nativo · comunicación por sockets TCP</span>
                </div>
              </div>
              <div className="stack-item">
                <div className="stack-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.157 4.412c-.676.284-.79.31-1.673.372-.65.045-.757.057-1.212.209-.75.246-1.395.75-2.02 1.59-.296.398-1.249 1.913-1.249 1.988 0 .057-.65.998-.915 1.32-.574.713-1.08 1.079-2.14 1.59-.77.36-1.224.524-4.102 1.477-1.073.353-2.133.738-2.367.864-.852.449-1.515 1.036-2.203 1.938-1.003 1.32-.972 1.313-3.042.947a12.264 12.264 0 00-.675-.063c-.644-.05-1.023.044-1.332.334L0 17.193l.177.088c.094.05.353.234.561.398.215.17.461.347.55.391.088.044.17.088.183.101.012.013-.089.17-.228.353-.435.581-.593.871-.574 1.048.019.164.032.17.43.17.517-.006.826-.056 1.261-.208.65-.233 2.058-.94 2.784-1.4.776-.5 1.717-.998 1.956-1.042.082-.02.354-.07.594-.114.58-.107 1.464-.095 2.587.05.108.013.373.045.6.064.227.025.43.057.454.076.026.012.474.037.998.056.934.026 1.104.007 1.3-.189.126-.133.385-.631.498-.985.209-.643.417-.921.366-.492-.113.966-.322 1.692-.713 2.411-.259.499-.663 1.092-.934 1.395-.322.347-.315.36.088.315.619-.063 1.471-.397 2.096-.82.827-.562 1.647-1.691 2.19-3.03.107-.27.22-.22.183.083-.013.094-.038.315-.057.498l-.031.328.353-.202c.833-.48 1.414-1.262 2.127-2.884.227-.518.877-2.922 1.073-3.976a9.64 9.64 0 01.271-1.042c.127-.429.196-.555.48-.858.183-.19.625-.555.978-.808.72-.505.953-.75 1.187-1.205.208-.417.284-1.13.132-1.357-.132-.202-.284-.196-.763.006Z" fill="white"/>
                  </svg>
                </div>
                <div className="stack-info">
                  <span className="stack-label">Base de datos</span>
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

      <div className="section-container team-section reveal" id='equipo'>
            <h2>Conoce al equipo</h2>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">
                  <img src="/Imgs/team/GaelSchenone.png" alt="Gael Schenone" className="team-img" />
                </div>
                <div className="team-card-body">
                  <span className="team-name">Gael Schenone</span>
                  <p className="team-desc">
                    Desarrollo del cliente en React JS y Springboot, diseño de UI/UX en figma.
                  </p>
                  <div className="team-links">
                    <a href="https://github.com/GaelSchenone" className="team-link" title="GitHub" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/gael-schenone-0309792b9/ " className="team-link" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://gaelschenone.com.ar/" className="team-link" title="Portfolio" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="team-card">
                <div className="team-avatar">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="team-card-body">
                  <span className="team-name">Nombre del integrante</span>
                  <p className="team-desc">
                    Descripción de su rol en el proyecto.
                  </p>
                  <div className="team-links">
                    <a href="#" className="team-link" title="GitHub" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="#" className="team-link" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="#" className="team-link" title="Portfolio" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="team-card">
                <div className="team-avatar">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="team-card-body">
                  <span className="team-name">Nombre del integrante</span>
                  <p className="team-desc">
                    Descripción de su rol en el proyecto.
                  </p>
                  <div className="team-links">
                    <a href="#" className="team-link" title="GitHub" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="#" className="team-link" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="#" className="team-link" title="Portfolio" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="team-card">
                <div className="team-avatar">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="team-card-body">
                  <span className="team-name">Nombre del integrante</span>
                  <p className="team-desc">
                    Descripción de su rol en el proyecto.
                  </p>
                  <div className="team-links">
                    <a href="#" className="team-link" title="GitHub" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                    <a href="#" className="team-link" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="#" className="team-link" title="Portfolio" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
      </div>

      <div className="separator"></div>


      <footer className="landing-footer reveal">
        <div className="footer-content">
          <div className="footer-brand">
            <Logo />
            
          </div>

          <div className="footer-links">
            <span className="footer-heading">Navegación</span>
            <a href="#proyecto" onClick={(e) => { e.preventDefault(); scrollTo('proyecto') }}>Proyecto</a>
            <a href="#como-funciona" onClick={(e) => { e.preventDefault(); scrollTo('como-funciona') }}>Cómo funciona</a>
            <a href="#equipo" onClick={(e) => { e.preventDefault(); scrollTo('equipo') }}>Equipo</a>
            <a href="#capturas" onClick={(e) => { e.preventDefault(); scrollTo('capturas') }}>Capturas</a>
          </div>

          <div className="footer-links">
            <span className="footer-heading">Links</span>
        
            <a href="https://github.com/GreatXLabs" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GreatXLabs
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ikaros. Todos los derechos reservados.</span>
          <span>Hecho por GreatXLabs</span>s
        </div>
      </footer>
    </div>
  )
}
