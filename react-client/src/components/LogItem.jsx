import { Link, useLocation } from 'react-router-dom'
import './LogItem.css'

export function LogItem({ log }) {

    return (
        <div className="log-item">
            <div className="main-info">
                <p className='overline'>{log.rol}</p>
                <p className='title'>{log.title}</p>
                <p className='actor'>{log.actor}</p>
            </div>

            <div className="time-stamp">
                <p>{log.timestamp}</p>
            </div>


        </div>
    )
}
