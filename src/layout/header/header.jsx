import './header.css';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { url } from '../../functions/url.js';
import userService from '../../services/api';

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'ahora';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} d`;
};

/* Modal combinado: solicitudes de seguimiento + notificaciones de like/comentario */
const NotificationsModal = ({ onClose, onCountChange }) => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        Promise.all([
            userService.getFollowRequests().catch(() => ({ data: [] })),
            userService.getNotifications().catch(() => ({ data: [] })),
        ]).then(([reqRes, notifRes]) => {
            setRequests(reqRes.data);
            setNotifications(notifRes.data);
            setLoading(false);
            // NUEVO: marcar todas las notificaciones como leídas y reflejarlo en el contador del header
            userService.markAllNotificationsAsRead()
                .then(() => onCountChange?.(reqRes.data.length))
                .catch(() => {});
        });
    }, []);

    const updateCombinedCount = (newRequests) => {
        const unreadNotifs = notifications.filter(n => !n.read).length;
        onCountChange?.(newRequests.length + unreadNotifs);
    };

    const handleRequest = async (id, action) => {
        setProcessingId(id);
        try {
            if (action === 'accept') await userService.acceptFollowRequest(id);
            else await userService.rejectFollowRequest(id);
            setRequests(prev => {
                const updated = prev.filter(r => String(r.id) !== String(id));
                updateCombinedCount(updated);
                return updated;
            });
        } catch {}
        setProcessingId(null);
    };

    const goToProfile = (userId) => {
        onClose();
        navigate(`/perfil/${userId}`);
    };

    const goToPost = (postId) => {
        onClose();
        navigate(`/post/${postId}`);
    };

    return (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
            <div style={{background:'var(--layout)',borderRadius:12,width:'100%',maxWidth:420,maxHeight:'75vh',margin:'0 16px',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 8px 30px rgba(0,0,0,.25)'}} onClick={e=>e.stopPropagation()}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',position:'relative',padding:'14px 16px',borderBottom:'1px solid var(--border)',fontWeight:700,fontSize:15,color:'var(--text)'}}>
                    Notificaciones
                    <button onClick={onClose} style={{position:'absolute',right:14,background:'none',border:'none',fontSize:18,cursor:'pointer',color:'var(--text)'}}>✕</button>
                </div>

                <div style={{overflowY:'auto',flex:1}}>
                    {loading && <p style={{textAlign:'center',padding:'2rem',color:'#8e8e8e',fontSize:14}}>Cargando...</p>}

                    {!loading && requests.length === 0 && notifications.length === 0 && (
                        <p style={{textAlign:'center',padding:'2rem',color:'#8e8e8e',fontSize:14}}>No tienes notificaciones</p>
                    )}

                    {/* SOLICITUDES DE SEGUIMIENTO */}
                    {!loading && requests.length > 0 && (
                        <div>
                            <div style={{padding:'10px 16px 4px',fontSize:12,fontWeight:700,color:'#8e8e8e',textTransform:'uppercase'}}>
                                Solicitudes de seguimiento
                            </div>
                            {requests.map(u => (
                                <div key={u.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',gap:10}}>
                                    <div style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer',flex:1,minWidth:0}} onClick={() => goToProfile(u.id)}>
                                        <div style={{width:44,height:44,borderRadius:'50%',background:'#FBEAF0',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#993556'}}>
                                            {u.icon && u.icon !== 'default.png'
                                                ? <img src={u.icon} alt={u.username} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
                                                : getInitials(u.username)}
                                        </div>
                                        <span style={{fontSize:14,fontWeight:600,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                            <strong>{u.username}</strong> quiere seguirte
                                        </span>
                                    </div>
                                    <div style={{display:'flex',gap:6,flexShrink:0}}>
                                        <button
                                            disabled={processingId === u.id}
                                            onClick={() => handleRequest(u.id, 'accept')}
                                            style={{padding:'6px 12px',borderRadius:8,border:'none',fontSize:12,fontWeight:600,cursor:'pointer',background:'var(--h123)',color:'#fff',opacity: processingId === u.id ? 0.5 : 1}}
                                        >Aceptar</button>
                                        <button
                                            disabled={processingId === u.id}
                                            onClick={() => handleRequest(u.id, 'reject')}
                                            style={{padding:'6px 12px',borderRadius:8,border:'1px solid var(--border)',fontSize:12,fontWeight:600,cursor:'pointer',background:'var(--body)',color:'var(--text)',opacity: processingId === u.id ? 0.5 : 1}}
                                        >Rechazar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* LIKES Y COMENTARIOS */}
                    {!loading && notifications.length > 0 && (
                        <div>
                            <div style={{padding:'14px 16px 4px',fontSize:12,fontWeight:700,color:'#8e8e8e',textTransform:'uppercase'}}>
                                Actividad reciente
                            </div>
                            {notifications.map(n => (
                                <div
                                    key={n._id}
                                    onClick={() => goToPost(n.postId)}
                                    style={{
                                        display:'flex',alignItems:'center',gap:12,padding:'10px 16px',cursor:'pointer',
                                        background: n.read ? 'transparent' : 'rgba(212,83,126,0.06)'
                                    }}
                                >
                                    <div style={{width:40,height:40,borderRadius:'50%',background:'#FBEAF0',flexShrink:0,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#993556'}}>
                                        {n.senderIcon && n.senderIcon !== 'default.png'
                                            ? <img src={n.senderIcon} alt={n.senderUsername} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
                                            : getInitials(n.senderUsername)}
                                    </div>
                                    <div style={{flex:1,minWidth:0,fontSize:13.5,color:'var(--text)',lineHeight:1.4}}>
                                        <strong>{n.senderUsername}</strong>{' '}
                                        {n.type === 'like' ? 'le dio me gusta a tu post' : 'comentó en tu post'}
                                        <div style={{fontSize:11,color:'#8e8e8e',marginTop:2}}>{timeAgo(n.timestamp)}</div>
                                    </div>
                                    {n.postFile && (
                                        <img src={n.postFile} alt="" style={{width:40,height:40,borderRadius:6,objectFit:'cover',flexShrink:0}} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Header = () => {
    const { icon } = useContext(UserContext);
    const navigate  = useNavigate();
    const resultURL = url();
    const iconUser  = icon && icon !== 'default.png' ? icon : null;
    const username  = localStorage.getItem('username');
    const isApp     = ['posts', 'user', 'rawgAPI', 'post', 'perfil'].includes(resultURL);
    const isLoggedIn = !!localStorage.getItem('userId');

    const [theme, setTheme]             = useState(() => localStorage.getItem('theme') || 'light');
    const [menuOpen, setMenuOpen]       = useState(false);
    const [notifCount, setNotifCount]   = useState(0); // ACTUALIZADO: combinado (solicitudes + no leídas)
    const [showNotifModal, setShowNotifModal] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => { setMenuOpen(false); }, [resultURL]);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') { setMenuOpen(false); setShowNotifModal(false); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // ACTUALIZADO: contador combinado de solicitudes pendientes + notificaciones no leídas
    useEffect(() => {
        if (!isLoggedIn) return;
        Promise.all([
            userService.getFollowRequests().catch(() => ({ data: [] })),
            userService.getUnreadNotificationsCount().catch(() => ({ data: { count: 0 } })),
        ]).then(([reqRes, countRes]) => {
            setNotifCount(reqRes.data.length + countRes.data.count);
        });
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
                                    className={`header-icon-btn desktop-only ${notifCount > 0 ? 'notif-dot' : ''}`}
                                    aria-label="notificaciones"
                                    onClick={() => setShowNotifModal(true)}
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
                            <button onClick={() => { setMenuOpen(false); setShowNotifModal(true); }}>
                                <i className="fa-regular fa-bell"></i>
                                Notificaciones{notifCount > 0 ? ` (${notifCount})` : ''}
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

            {showNotifModal && (
                <NotificationsModal
                    onClose={() => setShowNotifModal(false)}
                    onCountChange={setNotifCount}
                />
            )}
        </>
    );
};

export default Header;