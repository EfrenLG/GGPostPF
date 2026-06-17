import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';
import { url } from '../../functions/url';
import AdBanner from '../AdBanner/AdBanner';
import './PostsCard.css';

const adClient = import.meta.env.VITE_ADCLIENT;
const adSlot   = import.meta.env.VITE_ADSLOT;

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';
const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)    return 'ahora';
    if (diff < 3600)  return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} d`;
};

const FeedSidebar = ({ usuarios, userId, username, userIcon, navigate }) => {
    const suggestions = usuarios.filter(u => String(u.id) !== String(userId)).slice(0, 5);
    const [followingIds, setFollowingIds] = useState([]);

    // FIX: cargar el estado real de "siguiendo" al montar, en vez de asumir que está vacío
    useEffect(() => {
        if (!userId) return;
        const loadFollowing = async () => {
            try {
                const res = await userService.getPublicProfile(userId);
                const following = res.data.usuario.following || [];
                setFollowingIds(following.map(String));
            } catch {}
        };
        loadFollowing();
    }, [userId]);

    const handleFollow = async (targetId) => {
        try {
            const res = await userService.followUser(targetId);
            const action = res.data.action;
            setFollowingIds(prev =>
                action === 'follow'
                    ? [...prev, targetId]
                    : prev.filter(id => id !== targetId)
            );
        } catch {}
    };

    return (
        <aside className="feed-sidebar">
            <div className="sidebar-profile">
                <div className="sidebar-avatar" style={{ cursor: 'pointer' }} onClick={() => navigate('/user')}>
                    {userIcon && userIcon !== 'default.png'
                        ? <img src={userIcon} alt={username} />
                        : getInitials(username)}
                </div>
                <div>
                    <div className="sidebar-name">{username}</div>
                    <div className="sidebar-handle">@{username?.toLowerCase()}</div>
                </div>
                <button className="sidebar-switch-btn" onClick={() => navigate('/user')}>Ver perfil</button>
            </div>
            {suggestions.length > 0 && (
                <div>
                    <div className="sidebar-suggestions-title">
                        <span>Sugerencias para ti</span>
                    </div>
                    {suggestions.map(u => {
                        const isF = followingIds.includes(String(u.id));
                        return (
                            <div key={u.id} className="suggestion-item">
                                <div
                                    className="suggestion-avatar"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/perfil/${u.id}`)}
                                >
                                    {u.icon && u.icon !== 'default.png'
                                        ? <img src={u.icon} alt={u.username} />
                                        : getInitials(u.username || u.id)}
                                </div>
                                <div className="suggestion-info" style={{ cursor: 'pointer' }} onClick={() => navigate(`/perfil/${u.id}`)}>
                                    <div className="suggestion-name">{u.username || u.id?.slice(0, 10)}</div>
                                    <div className="suggestion-sub">Sugerido para ti</div>
                                </div>
                                <button
                                    className="suggestion-follow-btn"
                                    onClick={() => handleFollow(String(u.id))}
                                >
                                    {isF ? 'Siguiendo' : 'Seguir'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="sidebar-footer">
                <div><a href="#">Acerca de</a> · <a href="#">Ayuda</a> · <a href="#">API</a></div>
                <div>© 2025 GGPost</div>
            </div>
        </aside>
    );
};

const PostsCard = ({ posts, usuarios }) => {
    const userId   = localStorage.getItem('userId');
    const userIcon = localStorage.getItem('userIcon');
    const username = localStorage.getItem('username');

    const [usuariosD, setUsuariosD]   = useState([]);
    const [postsState, setPostsState] = useState([]);
    const [seeker, setSeeker]         = useState('');
    const [showUserResults, setShowUserResults] = useState(false); // NUEVO
    const searchRef    = useRef(null);
    const searchBoxRef = useRef(null); // NUEVO: para detectar click fuera

    const isUserPage = url() === 'user';
    const navigate   = useNavigate();

    useEffect(() => { if (Array.isArray(usuarios)) setUsuariosD(usuarios); }, [usuarios]);
    useEffect(() => { if (Array.isArray(posts)) setPostsState(posts.map(p => ({ ...p }))); }, [posts]);

    // NUEVO: cerrar el dropdown de usuarios al hacer click fuera de la barra de búsqueda
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setShowUserResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sendView   = async (idPost) => { try { await userService.viewPost({ idPost }); } catch {} };
    const toggleLike = (postId) => {
        setPostsState(prev => prev.map(p => {
            if (p._id !== postId) return p;
            const liked = p.likes?.includes(userId);
            return { ...p, likes: liked ? p.likes.filter(id => id !== userId) : [...(p.likes || []), userId] };
        }));
        try { userService.likePost({ idPost: postId, userId }); } catch {}
    };
    const handlePostClick = (post) => {
        if (post.idUser !== userId) sendView(post._id);
        navigate('/post/' + post._id);
    };

    // NUEVO: navegar al perfil del autor
    const handleAuthorClick = (e, post) => {
        e.stopPropagation();
        if (post.idUser === userId) {
            navigate('/user');
        } else {
            navigate(`/perfil/${post.idUser}`);
        }
    };

    // NUEVO: ir al perfil de un usuario desde el dropdown de búsqueda
    const goToSearchedProfile = (u) => {
        setSeeker('');
        setShowUserResults(false);
        if (String(u.id) === String(userId)) {
            navigate('/user');
        } else {
            navigate(`/perfil/${u.id}`);
        }
    };

    const filteredPosts = seeker.trim()
        ? postsState.filter(p => {
            const q = seeker.toLowerCase().replace(/^#/, '').trim();
            return (
                p.categories?.toLowerCase().includes(q) ||
                p.tittle?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            );
          })
        : postsState;

    // NUEVO: usuarios que coinciden con el texto buscado (por username)
    const matchedUsers = seeker.trim() && !seeker.trim().startsWith('#')
        ? usuariosD.filter(u =>
            u.username?.toLowerCase().includes(seeker.toLowerCase().trim())
          ).slice(0, 6)
        : [];

    const storyUsers = usuariosD.slice(0, 10);

    return (
        <div className="post-wrapper">

            <div className="search-bar-wrapper" ref={searchBoxRef}>
                <div className="search-bar-inner">
                    <i className="fa fa-search search-icon"></i>
                    <input
                        ref={searchRef}
                        type="text"
                        className="search-input"
                        placeholder="Buscar usuarios o #categoría..."
                        value={seeker}
                        onChange={e => { setSeeker(e.target.value); setShowUserResults(true); }}
                        onFocus={() => setShowUserResults(true)}
                        autoComplete="off"
                    />
                    {seeker && (
                        <button
                            className="search-clear"
                            onClick={() => { setSeeker(''); setShowUserResults(false); searchRef.current?.focus(); }}
                        >✕</button>
                    )}
                </div>

                {/* NUEVO: dropdown de usuarios coincidentes */}
                {showUserResults && matchedUsers.length > 0 && (
                    <div className="search-users-dropdown">
                        {matchedUsers.map(u => (
                            <div
                                key={u.id}
                                className="search-user-item"
                                onClick={() => goToSearchedProfile(u)}
                            >
                                <div className="search-user-avatar">
                                    {u.icon && u.icon !== 'default.png'
                                        ? <img src={u.icon} alt={u.username} />
                                        : getInitials(u.username || u.id)}
                                </div>
                                <div className="search-user-name">{u.username}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* STORIES — clickables → perfil */}
            {!isUserPage && storyUsers.length > 0 && (
                <div className="stories-bar">
                    <div className="stories-inner">
                        {storyUsers.map(u => (
                            <div
                                key={u.id}
                                className="story-item"
                                onClick={() => String(u.id) === String(userId)
                                    ? navigate('/user')
                                    : navigate(`/perfil/${u.id}`)
                                }
                            >
                                <div className="story-ring">
                                    <div className="story-avatar-initials">{getInitials(u.username || u.id)}</div>
                                </div>
                                <span className="story-label">{u.username || u.id?.slice(0, 6)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="feed-layout">
                <div className="feed-wrapper">

                    {filteredPosts.length === 0 && seeker && (
                        <div className="no-results">
                            No hay posts con <strong>#{seeker.replace(/^#/, '')}</strong>
                        </div>
                    )}

                    <div className="posts-grid">
                        {filteredPosts.map((post, index) => {
                            const author  = usuariosD.find(u => String(u.id) === String(post.idUser));
                            const isLiked = post.likes?.includes(userId);
                            const isOwner = post.idUser === userId;
                            const tags    = post.categories
                                ? post.categories.split(',').map(t => t.trim()).filter(Boolean)
                                : [];

                            return (
                                <React.Fragment key={post._id}>
                                    <div className="post-card" data-likes={post.likes?.length || 0}>

                                        {/* HEADER — avatar y nombre clickables → perfil */}
                                        {!isUserPage && (
                                            <div className="post-header">
                                                <div
                                                    className="post-header-left"
                                                    onClick={(e) => handleAuthorClick(e, post)}
                                                >
                                                    <div className="post-avatar">
                                                        {author?.icon && author.icon !== 'default.png'
                                                            ? <img src={author.icon} alt={post.username} />
                                                            : getInitials(post.username)}
                                                    </div>
                                                    <div>
                                                        <div className="post-username">{post.username}</div>
                                                        {tags[0] && <div className="post-location">#{tags[0]}</div>}
                                                    </div>
                                                </div>
                                                <div className="post-more-wrapper">
                                                    <button className="post-more-btn" aria-label="opciones">
                                                        <i className="fa-solid fa-ellipsis"></i>
                                                    </button>
                                                    <div className="post-more-menu">
                                                        {!isOwner && (
                                                            <button onClick={(e) => { e.stopPropagation(); navigate(`/perfil/${post.idUser}`); }}>
                                                                Ver perfil de {post.username}
                                                            </button>
                                                        )}
                                                        <button>Reportar</button>
                                                        <button>Copiar enlace</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="post-image-wrapper" onClick={() => handlePostClick(post)}>
                                            <img
                                                src={post.file}
                                                alt={post.tittle}
                                                className="post-image-card"
                                                onDoubleClick={e => { e.stopPropagation(); toggleLike(post._id); }}
                                            />
                                        </div>

                                        <div className="post-actions-row">
                                            <div className="actions-left">
                                                <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={() => toggleLike(post._id)} aria-label="me gusta">
                                                    <i className={isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                                </button>
                                                <button className="action-btn" onClick={() => handlePostClick(post)} aria-label="comentar">
                                                    <i className="fa-regular fa-comment"></i>
                                                </button>
                                                <button className="action-btn" aria-label="compartir">
                                                    <i className="fa-regular fa-paper-plane"></i>
                                                </button>
                                            </div>
                                            <button className="save-btn" aria-label="guardar">
                                                <i className="fa-regular fa-bookmark"></i>
                                            </button>
                                        </div>

                                        <div className="post-info">
                                            <div className="likes-count">{post.likes?.length || 0} me gusta</div>
                                            <div className="post-caption">
                                                {!isUserPage && (
                                                    <span
                                                        className="uname"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={(e) => handleAuthorClick(e, post)}
                                                    >
                                                        {post.username}{' '}
                                                    </span>
                                                )}
                                                <strong>{post.tittle}</strong>
                                                {post.description?.length > 80
                                                    ? ' — ' + post.description.slice(0, 80) + '...'
                                                    : post.description ? ' — ' + post.description : ''}
                                            </div>
                                            {tags.length > 0 && (
                                                <div className="post-tags">
                                                    {tags.map(t => (
                                                        <span key={t} className="post-tag" onClick={() => setSeeker(t)}>#{t}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <button className="view-comments-btn" onClick={() => handlePostClick(post)}>Ver comentarios</button>
                                            <div className="post-time">{timeAgo(post.fechaAlta)}</div>
                                        </div>

                                        <div className="comment-bar">
                                            <div className="comment-av">
                                                {userIcon && userIcon !== 'default.png' ? <img src={userIcon} alt="tú" /> : getInitials(username)}
                                            </div>
                                            <span className="comment-fake-input" onClick={() => handlePostClick(post)}>Añade un comentario...</span>
                                            <button className="comment-post-btn" onClick={() => handlePostClick(post)}>Publicar</button>
                                        </div>
                                    </div>

                                    {(index + 1) % 5 === 0 && (
                                        <AdBanner adClient={adClient} adSlot={adSlot} style={{ margin: '12px 0' }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <FeedSidebar usuarios={usuariosD} userId={userId} username={username} userIcon={userIcon} navigate={navigate} />
            </div>
        </div>
    );
};

export default PostsCard;