// Estilos
import './header.css';

// React y librerías de terceros
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

// Contextos
import { UserContext } from "../../context/UserContext";

// Funciones/utilidades
import { url } from '../../functions/url.js';

const Header = () => {
    const { icon } = useContext(UserContext);

    let header = '';
    let logo = '';
    const navigate = useNavigate();
    const resultURL = url();

    const iconUser = icon !== 'default.png' ? icon : '../images/default.png';


    if (resultURL !== 'posts' && resultURL !== 'user' && resultURL !== 'rawgAPI') {

        logo = (
            <img src="../images/logo_small.webp"
                alt="Logo GGPost"
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/posts')} />
        );
    } else {

        logo = (
            <img src="../images/logo_small.webp"
                alt="Logo GGPost"
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/post')} />
        );

        header = (
            <div className="header-right">
                <div className="profile-icon">
                    <img
                        src={`${iconUser}`}
                        alt="Perfil"
                        id="profile-image"
                        className="profile-img"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/user')} />
                </div>
            </div>
        );
    };

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <header>
            <div className="header-content">
                <div className="header-logo">{logo}</div>

                <div className="header-right">
                    {header}

                    <button onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;