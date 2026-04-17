import { Link, useLocation } from 'react-router-dom'
import './TabBtn.css'

export function TabBtn({ route, label, icon: Icon }) {
    const location = useLocation()
    const isActive = location.pathname === `/${route}` || (route === '' && location.pathname === '/')

    return (
        <Link to={`/${route}`} className={`tab-btn ${isActive ? 'tab-btn--active' : ''}`}>
            {Icon && <span className="tab-btn__icon"><Icon /></span>}
            <span className="tab-btn__label">{label}</span>
        </Link>
    )
}
