import { useState } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import './Tripulantes.css'
import { TripulanteItem } from '../components/TripulanteItem'

const tripulantesData = [
  {
    TripulanteID: 1,
    EstadoTID: 1,
    Peso: 78.5,
    Altura: 1.82,
    Nombre: 'Carlos',
    Apellido: 'Rodríguez',
    FechaDeNacimiento: '1985-03-15',
    Sexo: 'M'
  },
  {
    TripulanteID: 2,
    EstadoTID: 1,
    Peso: 62.0,
    Altura: 1.68,
    Nombre: 'María',
    Apellido: 'González',
    FechaDeNacimiento: '1990-07-22',
    Sexo: 'F'
  },
  {
    TripulanteID: 3,
    EstadoTID: 2,
    Peso: 85.0,
    Altura: 1.75,
    Nombre: 'Juan',
    Apellido: 'Martínez',
    FechaDeNacimiento: '1978-11-08',
    Sexo: 'M'
  },
  {
    TripulanteID: 4,
    EstadoTID: 1,
    Peso: 70.2,
    Altura: 1.90,
    Nombre: 'Ana',
    Apellido: 'Pérez',
    FechaDeNacimiento: '1988-05-30',
    Sexo: 'F'
  },
  {
    TripulanteID: 5,
    EstadoTID: 3,
    Peso: 88.0,
    Altura: 1.80,
    Nombre: 'Roberto',
    Apellido: 'López',
    FechaDeNacimiento: '1965-09-12',
    Sexo: 'M'
  },
  {
    TripulanteID: 6,
    EstadoTID: 2,
    Peso: 65.5,
    Altura: 1.72,
    Nombre: 'Laura',
    Apellido: 'Sánchez',
    FechaDeNacimiento: '1992-01-25',
    Sexo: 'F'
  },
  {
    TripulanteID: 7,
    EstadoTID: 1,
    Peso: 82.0,
    Altura: 1.85,
    Nombre: 'Diego',
    Apellido: 'Fernández',
    FechaDeNacimiento: '1983-12-03',
    Sexo: 'M'
  }
]

const estados = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
  { id: 3, nombre: 'Retirado' }
]

const sexos = [
  { id: 'M', nombre: 'Masculino' },
  { id: 'F', nombre: 'Femenino' }
]

export function Tripulantes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')
  const [selectedSexo, setSelectedSexo] = useState('')

  const filteredTripulantes = tripulantesData.filter(tripulante => {
    const matchesSearch =
      tripulante.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tripulante.Apellido.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = selectedEstado === '' || tripulante.EstadoTID === parseInt(selectedEstado)
    const matchesSexo = selectedSexo === '' || tripulante.Sexo === selectedSexo

    return matchesSearch && matchesEstado && matchesSexo
  })

  return (
    <>
      <Background />
      <div className="main-wrapper">
        <Header/>
        <div className="main-panel">
          <div className="top-bar">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar tripulante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-container">
              <select
                className="filter-select"
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                ))}
              </select>
              <select
                className="filter-select"
                value={selectedSexo}
                onChange={(e) => setSelectedSexo(e.target.value)}
              >
                <option value="">Todos los sexos</option>
                {sexos.map(sexo => (
                  <option key={sexo.id} value={sexo.id}>{sexo.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="tripulantes-container">
            {filteredTripulantes.map(tripulante => (
              <TripulanteItem
                key={tripulante.TripulanteID}
                tripulante={tripulante}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
