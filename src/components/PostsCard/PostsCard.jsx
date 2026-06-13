import React, { useState, useEffect } from 'react';
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

/* Sidebar de sugerencias — sólo visible en escritorio vía CSS */
const FeedSidebar = ({ usuarios, userId, username, userIcon, navigate }) => {
    const suggestions = usuarios.filter(u => u.id !== userId).slice(0, 5);
    return (
        <aside className="feed-sidebar">
            {/* Perfil propio */}
            <div className="sidebar-profile">
                <div className="sidebar-avatar">
                    {userIcon && userIcon !== 'default.png'
                        ? <img src={userIcon} alt={username} />
                        : getInitials(username)
                    }
                </div>
                <div>
                    <div className="sidebar-name">{username}</div>
                    <div className="sidebar-handle">@{username?.toLowerCase()}</div>
                </div>
                <button className="sidebar-switch-btn" onClick={() => navigate('/user')}>
                    Ver perfil
                </button>
            </div>

            {/* Sugerencias */}
            {suggestions.length > 0 && (
                <div>
                    <div className="sidebar-suggestions-title">
                        <span>Sugerencias para ti</span>
                        <button>Ver todo</button>
                    </div>
                    {suggestions.map((u) => (
                        <div key={u.id} className="suggestion-item">
                            <div className="suggestion-avatar">
                                {u.icon && u.icon !== 'default.png'
                                    ? <img src={u.icon} alt={u.username} />
                                    : getInitials(u.username || u.id)
                                }
                            </div>
                            <div className="suggestion-info">
                                <div className="suggestion-name">{u.username || u.id?.slice(0,10)}</div>
                                <div className="suggestion-sub">Sugerido para ti</div>
                            </div>
                            <button className="suggestion-follow-btn">Seguir</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="sidebar-footer">
                <div>
                    <a href="#">Acerca de</a> · <a href="#">Ayuda</a> · <a href="#">Prensa</a> · <a href="#">API</a>
                </div>
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

    const resultURL = url();
    const navigate  = useNavigate();

    useEffect(() => {
        if (Array.isArray(usuarios)) setUsuariosD(usuarios);
    }, [usuarios]);

    useEffect(() => {
        if (Array.isArray(posts)) setPostsState(posts.map(p => ({ ...p })));
    }, [posts]);

    const sendView = async (idPost) => {
        try { await userService.viewPost({ idPost }); } catch {}
    };

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

    const storyUsers = usuariosD.slice(0, 10);

    return (
        <div className="post-wrapper">

            {/* STORIES — visible en ambas versiones */}
            {resultURL !== 'user' && storyUsers.length > 0 && (
                <div className="stories-bar">
                    <div className="stories-inner">
                        {storyUsers.map((u) => (
                            <div key={u.id} className="story-item">
                                <div className="story-ring">
                                    <div className="story-avatar-initials">
                                        {getInitials(u.username || u.id)}
                                    </div>
                                </div>
                                <span className="story-label">{u.username || u.id?.slice(0,6)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LAYOUT: feed + sidebar (sidebar sólo visible en desktop via CSS) */}
            <div className="feed-layout">

                <div className="feed-wrapper">
                    {postsState.map((post, index) => {
                        const author = usuariosD.find(u => u.id === post.idUser);
                        const isLiked = post.likes?.includes(userId);
                        const tags = post.categories
                            ? post.categories.split(',').map(t => t.trim()).filter(Boolean)
                            : [];

                        return (
                            <React.Fragment key={post._id}>
                                <div className="post-card">

                                    {/* HEADER */}
                                    <div className="post-header">
                                        <div className="post-header-left" onClick={() => handlePostClick(post)}>
                                            <div className="post-avatar">
                                                {author?.icon && author.icon !== 'default.png'
                                                    ? <img src={author.icon} alt={post.username} />
                                                    : getInitials(post.username)
                                                }
                                            </div>
                                            <div>
                                                <div className="post-username">{post.username}</div>
                                                {tags[0] && <div className="post-location">{tags[0]}</div>}
                                            </div>
                                        </div>
                                        <button className="post-more-btn" aria-label="más opciones">
                                            <i className="fa-solid fa-ellipsis"></i>
                                        </button>
                                    </div>

                                    {/* IMAGEN */}
                                    <img
                                        src={post.file}
                                        alt={post.tittle}
                                        className="post-image-card"
                                        onClick={() => handlePostClick(post)}
                                        onDoubleClick={() => toggleLike(post._id)}
                                    />

                                    {/* ACCIONES */}
                                    <div className="post-actions-row">
                                        <div className="actions-left">
                                            <button
                                                className={`action-btn ${isLiked ? 'liked' : ''}`}
                                                onClick={() => toggleLike(post._id)}
                                                aria-label="me gusta"
                                            >
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

                                    {/* INFO */}
                                    <div className="post-info">
                                        <div className="likes-count">{post.likes?.length || 0} me gusta</div>
                                        <div className="post-caption">
                                            <span className="uname">{post.username}</span>
                                            {post.description?.length > 120
                                                ? post.description.slice(0, 120) + '...'
                                                : post.description}
                                        </div>
                                        {tags.length > 0 && (
                                            <div className="post-tags">
                                                {tags.map(t => <span key={t} className="post-tag">#{t}</span>)}
                                            </div>
                                        )}
                                        <button className="view-comments-btn" onClick={() => handlePostClick(post)}>
                                            Ver comentarios
                                        </button>
                                        <div className="post-time">{timeAgo(post.fechaAlta)}</div>
                                    </div>

                                    {/* BARRA COMENTARIO RÁPIDO */}
                                    <div className="comment-bar">
                                        <div className="comment-av">
                                            {userIcon && userIcon !== 'default.png'
                                                ? <img src={userIcon} alt="tú" />
                                                : getInitials(username)
                                            }
                                        </div>
                                        <span className="comment-fake-input" onClick={() => handlePostClick(post)}>
                                            Añade un comentario...
                                        </span>
                                        <button className="comment-post-btn" onClick={() => handlePostClick(post)}>
                                            Publicar
                                        </button>
                                    </div>
                                </div>

                                {(index + 1) % 5 === 0 && (
                                    <AdBanner adClient={adClient} adSlot={adSlot} style={{ margin: '12px 0' }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* SIDEBAR — sólo visible en desktop via CSS */}
                <FeedSidebar
                    usuarios={usuariosD}
                    userId={userId}
                    username={username}
                    userIcon={userIcon}
                    navigate={navigate}
                />
            </div>
        </div>
    );
};

export default PostsCard;