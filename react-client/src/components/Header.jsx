import { Logo } from "./Logo"
import "./Header.css"
import { Link } from 'react-router-dom'
import { TabBtn } from "./TabBtn"
import { ScrollText, Rocket, Users, CalendarDays, IdCard, LogOut} from 'lucide-react'

export function Header() {
    return (

            <header>
                <Logo />

                <div className="tabs">
                    <TabBtn route="Logs" label="Logs" icon={ScrollText} />
                    <TabBtn route="Misiones" label="Misiones" icon={Rocket} />
                    <TabBtn route="Eventos" label="Eventos" icon={CalendarDays} />    
                    <TabBtn route="Tripulantes" label="Tripulantes" icon={Users} /> 
                    <TabBtn route="Cuentas" label="Cuentas" icon={IdCard} /> 
                </div>

                 <button id="logout" title="Cerrar Sesión" aria-label="Cerrar Sesión">
                    <LogOut size={20} />
                </button>
            </header>

    )
}
