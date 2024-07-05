import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { List, X } from 'phosphor-react';
import { SiderbarData } from './sideBarData';
import '../styles/sidebar.css';

function SideBar() {
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);

    const hideSidebar = ['/login', '/register', '/', '/personal-data'].includes(location.pathname);

    if (hideSidebar) {
        return null;
    }

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div>
            <div className='sidebar'>
                <Link to='#' className='menu-bars' onClick={toggleMenu}>
                    <button><List size={50} /></button>
                </Link>
            </div>
            <nav className={showMenu ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={toggleMenu}>
                    <li className='navbar-toggle'>
                    <Link to="#" className='menu-bars'>
                        <X size={30} className='close-btn'/>
                    </Link>
                    </li>
                    {SiderbarData.map((item, index) => (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                <div className="sidebar-icons">{item.icon}</div>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default SideBar;
