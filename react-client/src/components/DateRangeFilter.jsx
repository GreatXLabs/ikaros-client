import { useState, useRef, useEffect } from 'react'
import { DateRangePicker } from 'react-date-range'
import { es } from 'date-fns/locale'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './DateRangeFilter.css'

const staticRanges = []
const inputRanges = []

export function DateRangeFilter({ onDateChange, dateRange }) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDateDisplay = () => {
    const start = dateRange[0].startDate
    const end = dateRange[0].endDate

    if (!start && !end) return 'Seleccionar fecha'

    const format = (date) => {
      if (!date) return ''
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    if (start && end) {
      if (start.getTime() === end.getTime()) {
        return format(start)
      }
      return `${format(start)} - ${format(end)}`
    }

    return format(start)
  }

  const clearDateSelection = (e) => {
    e.stopPropagation()
    onDateChange([{
      startDate: null,
      endDate: null,
      key: 'selection'
    }])
  }

  const handleDateChange = (item) => {
    onDateChange([item.selection])
  }

  return (
    <div className="date-picker-wrapper" ref={datePickerRef}>
      <button
        className="date-picker-button"
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{formatDateDisplay()}</span>
      </button>

      {showDatePicker && (
        <div className="date-picker-dropdown">
          <div className="date-picker-header">
            <span>Seleccioná fecha o rango</span>
            {(dateRange[0].startDate || dateRange[0].endDate) && (
              <button className="clear-date-btn" onClick={clearDateSelection}>
                Limpiar
              </button>
            )}
          </div>
          <DateRangePicker
            onChange={handleDateChange}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={dateRange}
            direction="vertical"
            locale={es}
            staticRanges={staticRanges}
            inputRanges={inputRanges}
            rangeColors={['rgba(255, 255, 255, 0.85)']}
          />
        </div>
      )}
    </div>
  )
}
