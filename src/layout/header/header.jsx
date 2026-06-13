import './header.css';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { url } from '../../functions/url.js';

const Header = () => {
    const { icon } = useContext(UserContext);
    const navigate = useNavigate();
    const resultURL = url();
    const iconUser = icon !== 'default.png' ? icon : '../images/default.png';

    const isApp = ['posts', 'user', 'rawgAPI', 'post'].includes(resultURL);

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <header>
            <div className="header-content">

                <div className="header-logo" onClick={() => navigate(isApp ? '/posts' : '/')}>
                    <span className="header-logo-text">GG<span>Post</span></span>
                </div>

                {isApp && (
                    <div className="header-search">
                        <i className="fa fa-search header-search-icon"></i>
                        <input
                            type="text"
                            placeholder="Buscar"
                            onFocus={() => navigate('/posts')}
                            readOnly
                        />
                    </div>
                )}

                <div className="header-right">
                    {isApp && (
                        <>
                            <button className="header-icon-btn" onClick={() => navigate('/posts')} aria-label="inicio">
                                <i className="fa-solid fa-house"></i>
                            </button>
                            <button className="header-icon-btn notif-dot" aria-label="notificaciones">
                                <i className="fa-regular fa-heart"></i>
                            </button>
                            <div className="profile-icon" onClick={() => navigate('/user')}>
                                <img src={iconUser} alt="Perfil" className="profile-img" />
                            </div>
                        </>
                    )}
                    <button onClick={toggleTheme} className="theme-toggle-btn">
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;