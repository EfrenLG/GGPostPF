// React
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Servicios
import userService from "../../services/api";

// Estilos
import "./PostCard.css";

const PostCard = ({ post, user }) => {

    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    const [localPost, setLocalPost] = useState(null); // FIX: estado propio, no mutamos props
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const wsRef = useRef(null);

    const navigate = useNavigate();

    // FIX: sincronizar localPost cuando llegue el prop post
    useEffect(() => {
        if (post && post._id) {
            setLocalPost({ ...post });
        }
    }, [post]);

    useEffect(() => {
        if (!post?._id) return;

        const URL_API = import.meta.env.VITE_URL_API;
        const ws = new WebSocket(URL_API);

        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                postId: post._id
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "history") {
                setMessages(data.messages);
            } else if (data.type === "message") {
                setMessages(prev => [...prev, data]);
            }
        };

        return () => {
            ws.close();
        };
    }, [post?._id]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        wsRef.current?.send(
            JSON.stringify({
                type: "message",
                postId: post._id,
                user: username,
                message: newMessage
            })
        );

        setNewMessage("");
    };

    // FIX: handleFollow definida (antes no existía y daba error en runtime)
    const handleFollow = async (targetUserId) => {
        try {
            await userService.followUser(targetUserId);
        } catch (error) {
            if (error.response?.data?.error === 'Acceso no autorizado') {
                navigate('/');
            }
            console.log('Error al seguir al usuario', error);
        }
    };

    // FIX: toggle de like sin mutar props, usando localPost
    const toggleLike = async () => {
        if (!localPost) return;

        const alreadyLiked = localPost.likes?.includes(userId);
        const updatedLikes = alreadyLiked
            ? localPost.likes.filter(id => id !== userId)
            : [...(localPost.likes || []), userId];

        setLocalPost(prev => ({ ...prev, likes: updatedLikes }));

        try {
            await userService.likePost({ idPost: localPost._id, userId });
        } catch (error) {
            // Revertir si falla
            setLocalPost(prev => ({ ...prev, likes: localPost.likes }));
            if (error.response?.data?.error === 'Acceso no autorizado') {
                navigate('/');
            }
        }
    };

    if (!localPost || !localPost._id) return null;

    return (
        <div className="post-page">

            <div className="post-header">
                <img src={user.icon} className="post-user-avatar" alt="user avatar" />

                <div className="post-user-block">
                    <h3>{user.username}</h3>
                    <span className="post-date">{localPost.date}</span>
                </div>

                {localPost.idUser !== userId && (
                    <button className="follow-btn" onClick={() => handleFollow(localPost.idUser)}>
                        Seguir
                    </button>
                )}
            </div>

            <div className="post-media-container">
                <img src={localPost.file} alt={localPost.tittle} className="post-media" />
            </div>

            <div className="post-actions">
                {/* FIX: un solo handler toggleLike, sin doble onClick anidado */}
                <div className="likes-handler" onClick={toggleLike}>
                    {localPost.likes?.includes(userId) ? (
                        <i className="fa fa-heart" style={{ color: '#ff0000' }} />
                    ) : (
                        <i className="fa-regular fa-heart" />
                    )}
                    <span className="like-number">{localPost.likes?.length || 0}</span>
                </div>

                <div className="categories-container">
                    {localPost.categories?.split(",").map(cat => (
                        <span key={cat} className="category-tag">
                            #{cat.trim()}
                        </span>
                    ))}
                </div>
            </div>

            <div className="post-body">
                <h1 className="post-title">{localPost.tittle}</h1>
                <p className="post-description">{localPost.description}</p>
            </div>

            <div className="comments-section">
                <h3>Comentarios</h3>

                <div className="comments-box">
                    {messages.length === 0 ? (
                        <p className="no-comments">Sé el primero en comentar</p>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className="comment">
                                <strong>{msg.username}:</strong> {msg.message}
                            </div>
                        ))
                    )}
                </div>

                <div className="comment-input">
                    <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage}>Enviar</button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
