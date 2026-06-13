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
    const isApp     = ['posts', 'user', 'rawgAPI', 'post'].includes(resultURL);

    const [theme, setTheme]       = useState(() => localStorage.getItem('theme') || 'light');
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // FIX 6: cerrar menú al cambiar de ruta
    useEffect(() => { setMenuOpen(false); }, [resultURL]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const goTo = (path) => { navigate(path); setMenuOpen(false); };

    return (
        <>
            <header>
                <div className="header-content">

                    {/* LOGO */}
                    <span className="header-logo-text" onClick={() => navigate(isApp ? '/posts' : '/')}>
                        GG<span>Post</span>
                    </span>

                    {/* BUSCADOR — solo desktop y solo en la app */}
                    {isApp && (
                        <div className="header-search">
                            <i className="fa fa-search header-search-icon"></i>
                            <input type="text" placeholder="Buscar" readOnly onClick={() => navigate('/posts')} />
                        </div>
                    )}

                    <div className="header-right">
                        {isApp && (
                            <>
                                {/* Iconos navegación desktop */}
                                <button className="header-icon-btn desktop-only" onClick={() => navigate('/posts')} aria-label="inicio">
                                    <i className="fa-solid fa-house"></i>
                                </button>
                                <button className="header-icon-btn desktop-only notif-dot" aria-label="notificaciones">
                                    <i className="fa-regular fa-heart"></i>
                                </button>
                                <div className="profile-icon desktop-only" onClick={() => navigate('/user')}>
                                    {iconUser
                                        ? <img src={iconUser} alt="Perfil" className="profile-img" />
                                        : <div className="profile-initials">
                                            {localStorage.getItem('username')?.slice(0,2).toUpperCase() || 'U'}
                                          </div>
                                    }
                                </div>
                            </>
                        )}

                        {/* Toggle tema */}
                        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="cambiar tema">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        {/* FIX 6: botón hamburguesa solo en móvil con contraste garantizado */}
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

            {/* FIX 6: menú lateral con fondo sólido, siempre contraste correcto */}
            {menuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
                    <nav className="mobile-menu" onClick={e => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-logo">GG<span>Post</span></span>
                            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="cerrar menú">✕</button>
                        </div>

                        {iconUser
                            ? <img src={iconUser} alt="perfil" className="mobile-menu-avatar" />
                            : <div className="mobile-menu-avatar-initials">
                                {localStorage.getItem('username')?.slice(0,2).toUpperCase() || 'U'}
                              </div>
                        }
                        <div className="mobile-menu-username">{localStorage.getItem('username')}</div>

                        <div className="mobile-menu-links">
                            <button onClick={() => goTo('/posts')}>
                                <i className="fa-solid fa-house"></i> Inicio
                            </button>
                            <button onClick={() => goTo('/user')}>
                                <i className="fa-regular fa-user"></i> Mi perfil
                            </button>
                            <button onClick={() => goTo('/rawgAPI')}>
                                <i className="fa-solid fa-gamepad"></i> Explorar juegos
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