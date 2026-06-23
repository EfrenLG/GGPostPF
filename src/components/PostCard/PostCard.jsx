import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/api";
import "./PostCard.css";

const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : '?';

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'ahora';
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} d`;
};

const PostCard = ({ post, user }) => {
    const username = localStorage.getItem("username");
    const userId   = localStorage.getItem("userId");

    const [localPost, setLocalPost]         = useState(null);
    const [comments, setComments]           = useState([]);       // ACTUALIZADO: antes "messages"
    const [loadingComments, setLoadingComments] = useState(true);  // NUEVO
    const [newMessage, setNewMessage]       = useState("");
    const [sendingComment, setSendingComment] = useState(false);   // NUEVO
    const [deletingId, setDeletingId]       = useState(null);      // NUEVO
    const [isEditing, setIsEditing]         = useState(false);
    const [editTitle, setEditTitle]         = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategories, setEditCategories]   = useState("");
    const [isFollowing, setIsFollowing]     = useState(false);
    const navigate = useNavigate();

    const isOwner = localPost?.idUser === userId;

    useEffect(() => {
        if (post?._id) {
            setLocalPost({ ...post });
            setEditTitle(post.tittle || "");
            setEditDescription(post.description || "");
            setEditCategories(post.categories || "");
        }
    }, [post]);

    // ACTUALIZADO: comentarios persistentes vía REST, ya no WebSocket
    useEffect(() => {
        if (!post?._id) return;
        setLoadingComments(true);
        userService.getComments(post._id)
            .then(res => setComments(res.data))
            .catch(() => setComments([]))
            .finally(() => setLoadingComments(false));
    }, [post?._id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || sendingComment) return;
        setSendingComment(true);
        try {
            const res = await userService.postComment(localPost._id, newMessage.trim());
            setComments(prev => [...prev, res.data]);
            setNewMessage("");
        } catch (e) {
            console.log('Error al enviar comentario', e);
        } finally {
            setSendingComment(false);
        }
    };

    // NUEVO: borrar comentario (propio o, si eres el dueño del post, cualquiera)
    const handleDeleteComment = async (commentId) => {
        if (deletingId) return;
        setDeletingId(commentId);
        try {
            await userService.deleteComment(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (e) {
            console.log('Error al borrar comentario', e);
        } finally {
            setDeletingId(null);
        }
    };

    const handleFollow = async () => {
        try {
            const res = await userService.followUser(localPost.idUser);
            setIsFollowing(res.data.action === 'follow');
        } catch {}
    };

    const goToAuthorProfile = () => {
        if (localPost?.idUser === userId) {
            navigate('/user');
        } else {
            navigate(`/perfil/${localPost.idUser}`);
        }
    };

    const toggleLike = async () => {
        if (!localPost) return;
        const alreadyLiked = localPost.likes?.includes(userId);
        const updatedLikes = alreadyLiked
            ? localPost.likes.filter(id => id !== userId)
            : [...(localPost.likes || []), userId];
        setLocalPost(prev => ({ ...prev, likes: updatedLikes }));
        try {
            await userService.likePost({ idPost: localPost._id, userId });
        } catch {
            setLocalPost(prev => ({ ...prev, likes: localPost.likes }));
        }
    };

    const handleSaveEdit = async () => {
        if (!editTitle.trim() || !editDescription.trim()) return;
        try {
            await userService.editPost({
                idPost: localPost._id,
                tittlePost: editTitle,
                descriptionPost: editDescription,
                categoriesPost: editCategories,
            });
            setLocalPost(prev => ({
                ...prev, tittle: editTitle,
                description: editDescription, categories: editCategories,
            }));
            setIsEditing(false);
        } catch (e) { console.log('Error al editar', e); }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Seguro que quieres eliminar este post?")) return;
        try {
            await userService.deletePost(localPost._id);
            navigate('/posts');
        } catch (e) { console.log('Error al eliminar', e); }
    };

    if (!localPost?._id) return null;

    const tags = localPost.categories
        ? localPost.categories.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    return (
        <>
            <button className="back-btn" onClick={() => navigate('/posts')}>
                ← Volver
            </button>

            <div className="post-page">

                <div className="post-media-container">
                    <img src={localPost.file} alt={localPost.tittle} className="post-media" />
                </div>

                <div className="post-sidebar">

                    <div className="post-header">
                        <div className="post-header-left" style={{ cursor: 'pointer' }} onClick={goToAuthorProfile}>
                            {user?.icon && user.icon !== 'default.png'
                                ? <img src={user.icon} className="post-user-avatar" alt={user.username} />
                                : <div className="post-user-avatar">{getInitials(user?.username)}</div>
                            }
                            <div className="post-user-block">
                                <h3 style={{ color: 'var(--text)', fontWeight: 600, fontSize: '14px', margin: 0 }}>
                                    {user?.username || 'Usuario'}
                                </h3>
                                <span className="post-date">{timeAgo(localPost.fechaAlta)}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {!isOwner && (
                                <button
                                    className="follow-btn"
                                    onClick={handleFollow}
                                    style={ isFollowing ? { color: '#8e8e8e' } : {} }
                                >
                                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                                </button>
                            )}
                            <button className="post-more-btn" aria-label="más opciones">
                                <i className="fa-solid fa-ellipsis"></i>
                            </button>
                        </div>
                    </div>

                    <div className="post-caption-block">
                        {user?.icon && user.icon !== 'default.png'
                            ? <img src={user.icon} className="caption-avatar" alt="" />
                            : <div className="caption-avatar">{getInitials(user?.username)}</div>
                        }
                        <div className="caption-text">
                            <span className="uname" style={{ cursor: 'pointer' }} onClick={goToAuthorProfile}>
                                {user?.username}
                            </span>
                            <strong>{localPost.tittle} — </strong>
                            {localPost.description}
                            {tags.length > 0 && (
                                <div className="post-tags">
                                    {tags.map(t => <span key={t} className="post-tag">#{t}</span>)}
                                </div>
                            )}
                            {isOwner && !isEditing && (
                                <div className="owner-actions">
                                    <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️ Editar</button>
                                    <button className="btn-delete" onClick={handleDelete}>🗑️ Eliminar</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="edit-form">
                            <input className="edit-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Título" />
                            <textarea className="edit-textarea" value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="Descripción" />
                            <input className="edit-input" value={editCategories} onChange={e => setEditCategories(e.target.value)} placeholder="Categorías (separadas por coma)" />
                            <div className="edit-actions">
                                <button className="btn-save-edit" onClick={handleSaveEdit}>Guardar</button>
                                <button className="btn-cancel-edit" onClick={() => setIsEditing(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}

                    {/* COMENTARIOS — ahora vía REST, persistentes, con borrado */}
                    <div className="comments-section">
                        {loadingComments ? (
                            <p className="no-comments">Cargando comentarios...</p>
                        ) : comments.length === 0 ? (
                            <p className="no-comments">Sé el primero en comentar</p>
                        ) : (
                            comments.map((c) => {
                                const canDelete = String(c.userId) === String(userId) || isOwner;
                                return (
                                    <div key={c._id} className="comment">
                                        <div className="comment-avatar">{getInitials(c.username)}</div>
                                        <div className="comment-body">
                                            <strong>{c.username}</strong>{c.message}
                                        </div>
                                        {canDelete && (
                                            <button
                                                className="comment-delete-btn"
                                                onClick={() => handleDeleteComment(c._id)}
                                                disabled={deletingId === c._id}
                                                aria-label="borrar comentario"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="post-actions">
                        <div className="post-actions-row">
                            <div className="actions-left">
                                <button className={`action-btn ${localPost.likes?.includes(userId) ? 'liked' : ''}`} onClick={toggleLike} aria-label="me gusta">
                                    <i className={localPost.likes?.includes(userId) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                                </button>
                                <button className="action-btn" aria-label="comentar">
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
                        <div className="likes-count">{localPost.likes?.length || 0} me gusta</div>
                        <div className="post-timestamp">{timeAgo(localPost.fechaAlta)}</div>
                    </div>

                    <div className="comment-input">
                        <button className="comment-input-emoji" aria-label="emoji">
                            <i className="fa-regular fa-face-smile"></i>
                        </button>
                        <input
                            type="text"
                            placeholder="Añade un comentario..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                            disabled={sendingComment}
                        />
                        <button onClick={handleSendMessage} disabled={!newMessage.trim() || sendingComment}>
                            {sendingComment ? '...' : 'Publicar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCard;