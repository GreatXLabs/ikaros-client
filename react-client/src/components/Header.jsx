import { useNavigate } from 'react-router-dom'
import { Logo } from "./Logo"
import "./Header.css"
import { TabBtn } from "./TabBtn"
import { ScrollText, Rocket, Users, CalendarDays, IdCard, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV_ITEMS = [
	{ route: 'Logs', label: 'Logs', icon: ScrollText, permission: 'logs:view' },
	{ route: 'Misiones', label: 'Misiones', icon: Rocket, permission: 'misiones:view' },
	{ route: 'Eventos', label: 'Eventos', icon: CalendarDays, permission: 'eventos:view' },
	{ route: 'Tripulantes', label: 'Tripulantes', icon: Users, permission: 'tripulantes:view' },
	{ route: 'Cuentas', label: 'Cuentas', icon: IdCard, permission: 'cuentas:view' },
]

export function Header() {
	const navigate = useNavigate()
	const { logout, hasPermission } = useAuth()

	const visibleItems = NAV_ITEMS.filter(item => hasPermission(item.permission))

	const handleLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<header className='header-app'>
			<Logo />

			<div className="tabs">
				{visibleItems.map(item => (
					<TabBtn key={item.route} route={item.route} label={item.label} icon={item.icon} />
				))}
			</div>

			<button id="logout" title="Cerrar Sesión" aria-label="Cerrar Sesión" onClick={handleLogout}>
				<LogOut size={20} />
			</button>
		</header>
	)
}
