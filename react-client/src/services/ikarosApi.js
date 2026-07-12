const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE_URL = `${API_URL}/api`

export { API_URL }

function getToken() {
  const user = sessionStorage.getItem('ikaros_user')
  if (!user) return null
  const parsed = JSON.parse(user)
  return parsed.token || null
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (token) {
    headers['Authorization'] = token
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })

  // 401 on login = wrong credentials, not session expiry — let caller handle it
  if (res.status === 401 && endpoint.startsWith('/auth/')) {
    return res.json()
  }

  if (res.status === 401) {
    sessionStorage.removeItem('ikaros_user')
    window.dispatchEvent(new CustomEvent('auth:expired'))
    throw new Error('Sesión expirada')
  }

  const data = await res.json()

  // Backend always returns 200 for non-login endpoints, even on auth failure.
  // Detect expired/invalid token from the response body.
  if (token && data?.success === false && !endpoint.startsWith('/auth/')) {
    const msg = (data?.message || data?.error || '').toLowerCase()
    const authKeywords = ['token', 'sesión', 'sesion', 'inválido', 'invalido', 'expiró', 'expiro', 'válido', 'valido', 'autorizacion', 'autorización']
    if (authKeywords.some(kw => msg.includes(kw))) {
      sessionStorage.removeItem('ikaros_user')
      window.dispatchEvent(new CustomEvent('auth:expired'))
      throw new Error('Sesión expirada')
    }
  }

  return data
}

// --- Auth ---
export async function login(usuario, clave) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, clave })
  })
}

export async function checkSession() {
  return request('/auth/check')
}

// --- Roles ---
export async function consultarRoles() {
  return request('/roles')
}

// --- Estados ---
export async function listarEstadosMisiones() {
  return request('/estados/misiones')
}

export async function listarEstadosTripulantes() {
  return request('/estados/tripulantes')
}

// --- Misiones ---
export async function listarMisiones() {
  return request('/misiones')
}

export async function asignarMisionTripulante(tripulanteId, misionId) {
  return request('/tripulantes/asignar', {
    method: 'POST',
    body: JSON.stringify({ tripulanteId, misionId })
  })
}

export async function consultarMision(id) {
  return request(`/misiones/${id}`)
}

export async function listarTripulantesMision(misionId) {
  return request(`/misiones/${misionId}/tripulantes`)
}

export async function registrarMision(mision) {
  return request('/misiones', {
    method: 'POST',
    body: JSON.stringify(mision)
  })
}

export async function modificarMision(id, mision) {
  return request(`/misiones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(mision)
  })
}

export async function actualizarEstadoMision(id, estado, retrasoInicio, retrasoFin) {
  return request(`/misiones/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado, retrasoInicio: retrasoInicio ?? '', retrasoFin: retrasoFin ?? '' })
  })
}

// --- Tripulantes ---
export async function listarTripulantes() {
  return request('/tripulantes')
}

export async function consultarAptitudes() {
  return request('/tripulantes/aptitudes')
}

export async function consultarTripulante(id) {
  return request(`/tripulantes/${id}`)
}

export async function consultarCapacidades(id) {
  return request(`/tripulantes/${id}/capacidades`)
}

export async function guardarCapacidades(id, capacidades) {
  return request(`/tripulantes/${id}/capacidades`, {
    method: 'POST',
    body: JSON.stringify(capacidades)
  })
}

export async function listarMisionesTripulante(id) {
  return request(`/tripulantes/${id}/misiones`)
}

export async function registrarTripulante(tripulante) {
  return request('/tripulantes', {
    method: 'POST',
    body: JSON.stringify(tripulante)
  })
}

export async function modificarTripulante(id, tripulante) {
  return request(`/tripulantes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tripulante)
  })
}

export async function bajaTripulante(id) {
  return request(`/tripulantes/${id}`, { method: 'DELETE' })
}

export async function subirImagenTripulante(file) {
  const token = getToken()
  const formData = new FormData()
  formData.append('imagen', file)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(`${BASE_URL}/tripulantes/imagen`, {
      method: 'POST',
      headers: token ? { Authorization: token } : {},
      body: formData,
      signal: controller.signal
    })

    if (res.status === 401) {
      sessionStorage.removeItem('ikaros_user')
      window.dispatchEvent(new CustomEvent('auth:expired'))
      throw new Error('Sesión expirada')
    }

    return res.json()
  } finally {
    clearTimeout(timeout)
  }
}

// --- Usuarios ---
export async function listarUsuarios() {
  return request('/usuarios')
}

export async function registrarUsuario(usuario) {
  return request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario)
  })
}

export async function modificarUsuario(usuario) {
  return request(`/usuarios/${usuario.usuarioID}`, {
    method: 'PUT',
    body: JSON.stringify(usuario)
  })
}

export async function bajaUsuario(usuarioID) {
  return request(`/usuarios/${usuarioID}`, { method: 'DELETE' })
}

// --- Eventos ---
export async function listarTodosEventos() {
  return request('/eventos/listar')
}

export async function consultarEventos(misionID) {
  return request(`/eventos?misionID=${misionID}`)
}

export async function registrarEvento(evento) {
  return request('/eventos', {
    method: 'POST',
    body: JSON.stringify(evento)
  })
}

export async function bajaEvento(id) {
  return request(`/eventos/${id}`, { method: 'DELETE' })
}

// --- Logs ---
export async function verLogs() {
  return request('/logs')
}
