import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css'
import { AuthContext } from '../../context/auth-context'

const MainNavigation = () => {
    const {token} = useContext(AuthContext);
  return (
    <header className='main-navigation'>
        <div className="main-navigation__logo">
        <h1>EasyEvent</h1>
        </div>
        <nav className="main-navigation__items">
            <ul>
                {token && <li> <NavLink to='/auth'>Authenticated</NavLink> </li>}
                <li> <NavLink to='/bookings'>Bookings</NavLink> </li>
                {token && <li> <NavLink to='/events'>Events</NavLink> </li>}
            </ul>
        </nav>
    </header>
  )
}

export default MainNavigation