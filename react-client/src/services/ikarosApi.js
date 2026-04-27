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

  if (res.status === 401) {
    sessionStorage.removeItem('ikaros_user')
    window.location.hash = '#/'
    throw new Error('Sesión expirada')
  }

  return res.json()
}

// --- Auth ---
export async function login(usuario, clave) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, clave })
  })
}

// --- Roles ---
export async function consultarRoles() {
  return request('/roles')
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

export async function registrarMision(mision) {
  return request('/misiones', {
    method: 'POST',
    body: JSON.stringify(mision)
  })
}

export async function actualizarEstadoMision(id, estado) {
  return request(`/misiones/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado })
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

  const res = await fetch(`${BASE_URL}/tripulantes/imagen`, {
    method: 'POST',
    headers: token ? { Authorization: token } : {},
    body: formData
  })

  return res.json()
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
  return request('/usuarios', {
    method: 'PUT',
    body: JSON.stringify(usuario)
  })
}

export async function bajaUsuario(username) {
  return request(`/usuarios/${username}`, { method: 'DELETE' })
}

// --- Eventos ---
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
