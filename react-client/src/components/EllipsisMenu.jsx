import { useState, useRef, useEffect } from 'react'
import './EllipsisMenu.css'

export function EllipsisMenu({ items }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleItemClick = (onClick) => {
    onClick()
    setIsOpen(false)
  }

  return (
    <div className="ellipsis-menu-wrapper" ref={menuRef}>
      <button
        className="ellipsis-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="ellipsis-dropdown">
          {items.map((item, index) => (
            <button
              key={index}
              className={`ellipsis-item ${item.variant || ''}`}
              onClick={() => handleItemClick(item.onClick)}
            >
              {item.icon && <span className="ellipsis-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
