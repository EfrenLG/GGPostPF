import './header.css';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { url } from '../../functions/url.js';

const Header = () => {
    const { icon } = useContext(UserContext);
    const navigate  = useNavigate();
    const resultURL = url();
    const iconUser  = icon && icon !== 'default.png' ? icon : null;
    const username  = localStorage.getItem('username');
    const isApp     = ['posts', 'user', 'rawgAPI', 'post', 'perfil'].includes(resultURL);

    // FIX: comprobamos si hay sesión iniciada (token/userId guardado), no solo en qué página estamos
    const isLoggedIn = !!localStorage.getItem('userId');

    const [theme, setTheme]       = useState(() => localStorage.getItem('theme') || 'light');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Cerrar menú al navegar
    useEffect(() => { setMenuOpen(false); }, [resultURL]);

    // Cerrar menú con Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const goTo = (path) => { navigate(path); setMenuOpen(false); };

    // FIX: el logo lleva a /posts si hay sesión iniciada (sea cual sea la página actual),
    // y solo al login ('/') si no hay sesión
    const handleLogoClick = () => navigate(isLoggedIn ? '/posts' : '/');

    return (
        <>
            <header>
                <div className="header-content">

                    {/* LOGO */}
                    <span className="header-logo-text" onClick={handleLogoClick}>
                        GG<span>Post</span>
                    </span>

                    <div className="header-right">
                        {isApp && (
                            <>
                                <button
                                    className="header-icon-btn desktop-only"
                                    onClick={() => navigate('/posts')}
                                    aria-label="inicio"
                                >
                                    <i className="fa-solid fa-house"></i>
                                </button>
                                <button
                                    className="header-icon-btn desktop-only notif-dot"
                                    aria-label="notificaciones"
                                >
                                    <i className="fa-regular fa-heart"></i>
                                </button>
                                <div
                                    className="profile-icon desktop-only"
                                    onClick={() => navigate('/user')}
                                    role="button"
                                    tabIndex={0}
                                    aria-label="mi perfil"
                                >
                                    {iconUser
                                        ? <img src={iconUser} alt="Perfil" className="profile-img" />
                                        : <div className="profile-initials">
                                            {username?.slice(0,2).toUpperCase() || 'U'}
                                          </div>
                                    }
                                </div>
                            </>
                        )}

                        {/* Toggle tema — siempre visible */}
                        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="cambiar tema">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        {/* Hamburguesa solo en móvil */}
                        {isApp && (
                            <button
                                className="hamburger-btn"
                                onClick={() => setMenuOpen(o => !o)}
                                aria-label="abrir menú"
                                aria-expanded={menuOpen}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Menú lateral con fondo sólido + publicaciones visibles */}
            {menuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => setMenuOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="menú de navegación"
                >
                    <nav className="mobile-menu" onClick={e => e.stopPropagation()}>

                        <div className="mobile-menu-header">
                            <span className="mobile-menu-logo">GG<span>Post</span></span>
                            <button
                                className="mobile-menu-close"
                                onClick={() => setMenuOpen(false)}
                                aria-label="cerrar menú"
                            >✕</button>
                        </div>

                        {/* Avatar */}
                        {iconUser
                            ? <img src={iconUser} alt="perfil" className="mobile-menu-avatar" />
                            : <div className="mobile-menu-avatar-initials">
                                {username?.slice(0,2).toUpperCase() || 'U'}
                              </div>
                        }
                        <div className="mobile-menu-username">{username}</div>

                        <div className="mobile-menu-links">
                            <button onClick={() => goTo('/posts')}>
                                <i className="fa-solid fa-house"></i>
                                Publicaciones
                            </button>
                            <button onClick={() => goTo('/user')}>
                                <i className="fa-regular fa-user"></i>
                                Mi perfil
                            </button>
                            <button onClick={() => goTo('/rawgAPI')}>
                                <i className="fa-solid fa-gamepad"></i>
                                Explorar juegos
                            </button>
                            <button onClick={toggleTheme}>
                                {theme === 'light'
                                    ? <><i className="fa-solid fa-moon"></i> Modo oscuro</>
                                    : <><i className="fa-solid fa-sun"></i> Modo claro</>
                                }
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Header;