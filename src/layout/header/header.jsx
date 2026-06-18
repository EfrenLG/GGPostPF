import './header.css';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { url } from '../../functions/url.js';
import userService from '../../services/api';
import FollowRequestsModal from '../../components/FollowRequestsModal/FollowRequestsModal';

const Header = () => {
    const { icon } = useContext(UserContext);
    const navigate  = useNavigate();
    const resultURL = url();
    const iconUser  = icon && icon !== 'default.png' ? icon : null;
    const username  = localStorage.getItem('username');
    const isApp     = ['posts', 'user', 'rawgAPI', 'post', 'perfil'].includes(resultURL);
    const isLoggedIn = !!localStorage.getItem('userId');

    const [theme, setTheme]       = useState(() => localStorage.getItem('theme') || 'light');
    const [menuOpen, setMenuOpen] = useState(false);
    const [requestsCount, setRequestsCount] = useState(0);
    const [showRequestsModal, setShowRequestsModal] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => { setMenuOpen(false); }, [resultURL]);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setShowRequestsModal(false); } };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;
        userService.getFollowRequests()
            .then(res => setRequestsCount(res.data.length))
            .catch(() => {});
    }, [isLoggedIn, resultURL]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    const goTo = (path) => { navigate(path); setMenuOpen(false); };
    const handleLogoClick = () => navigate(isLoggedIn ? '/posts' : '/');

    return (
        <>
            <header>
                <div className="header-content">
                    <span className="header-logo-text" onClick={handleLogoClick}>
                        GG<span>Post</span>
                    </span>

                    <div className="header-right">
                        {isApp && (
                            <>
                                <button className="header-icon-btn desktop-only" onClick={() => navigate('/posts')} aria-label="inicio">
                                    <i className="fa-solid fa-house"></i>
                                </button>
                                <button
                                    className={`header-icon-btn desktop-only ${requestsCount > 0 ? 'notif-dot' : ''}`}
                                    aria-label="solicitudes de seguimiento"
                                    onClick={() => setShowRequestsModal(true)}
                                >
                                    <i className="fa-regular fa-bell"></i>
                                </button>
                                <div className="profile-icon desktop-only" onClick={() => navigate('/user')} role="button" tabIndex={0} aria-label="mi perfil">
                                    {iconUser
                                        ? <img src={iconUser} alt="Perfil" className="profile-img" />
                                        : <div className="profile-initials">{username?.slice(0,2).toUpperCase() || 'U'}</div>
                                    }
                                </div>
                            </>
                        )}
                        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="cambiar tema">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        {isApp && (
                            <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} aria-label="abrir menú" aria-expanded={menuOpen}>
                                <span></span><span></span><span></span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} role="dialog" aria-modal="true" aria-label="menú de navegación">
                    <nav className="mobile-menu" onClick={e => e.stopPropagation()}>
                        <div className="mobile-menu-header">
                            <span className="mobile-menu-logo">GG<span>Post</span></span>
                            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="cerrar menú">✕</button>
                        </div>
                        {iconUser
                            ? <img src={iconUser} alt="perfil" className="mobile-menu-avatar" />
                            : <div className="mobile-menu-avatar-initials">{username?.slice(0,2).toUpperCase() || 'U'}</div>
                        }
                        <div className="mobile-menu-username">{username}</div>
                        <div className="mobile-menu-links">
                            <button onClick={() => goTo('/posts')}><i className="fa-solid fa-house"></i>Publicaciones</button>
                            <button onClick={() => goTo('/user')}><i className="fa-regular fa-user"></i>Mi perfil</button>
                            <button onClick={() => { setMenuOpen(false); setShowRequestsModal(true); }}>
                                <i className="fa-regular fa-bell"></i>
                                Solicitudes{requestsCount > 0 ? ` (${requestsCount})` : ''}
                            </button>
                            <button onClick={() => goTo('/rawgAPI')}><i className="fa-solid fa-gamepad"></i>Explorar juegos</button>
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

            {showRequestsModal && (
                <FollowRequestsModal
                    onClose={() => setShowRequestsModal(false)}
                    onCountChange={setRequestsCount}
                />
            )}
        </>
    );
};

export default Header;