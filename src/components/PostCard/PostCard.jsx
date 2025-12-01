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

    // Likes
    const [likesData, setLikesData] = useState({});
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const wsRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
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
    }, [post._id]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        wsRef.current?.send(
            JSON.stringify({
                type: "message",
                postId: post._id,
                username,
                message: newMessage
            })
        );

        setNewMessage("");
    };

    const sendLike = async (idPost, idUser) => {

        const postData = {
            'idPost': idPost,
            'userId': idUser
        };

        try {

            await userService.likePost(postData);

        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.log('Error cargando los post', error);
        };
    };

    return (
        <div className="post-page">

            <div className="post-header">
                <img src={user.icon} className="post-user-avatar" alt="user avatar" />

                <div className="post-user-block">
                    <h3>{user.username}</h3>
                    <span className="post-date">{post.date}</span>
                </div>

                {post.idUser !== userId && (
                    <button className="follow-btn" onClick={() => handleFollow(post.idUser)}>
                        Seguir
                    </button>
                )}
            </div>

            <div className="post-media-container">
                <img src={post.file} alt={post.tittle} className="post-media" />
            </div>

            <div className="post-actions">
                <div className="likes-handler" onClick={() => sendLike(post._id, userId)}>
                    {post.likes?.includes(userId) ? (
                        <i className="fa fa-heart" style={{ color: '#ff0000' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                sendLike(post._id, userId);
                                post.likes = post.likes.filter(id => id !== userId);
                                setLikesData(prev => ({ ...prev }));
                            }}></i>
                    ) : (
                        <i className="fa-regular fa-heart"
                            onClick={(e) => {
                                e.stopPropagation();
                                sendLike(post._id, userId);
                                post.likes = [...(post.likes || []), userId];
                                setLikesData(prev => ({ ...prev }));
                            }}></i>
                    )}
                    <span className="like-number">{post.likes?.length || 0}</span>
                </div>

                <div className="categories-container">
                    {post.categories?.split(",").map(cat => (
                        <span key={cat} className="category-tag">
                            #{cat.trim()}
                        </span>
                    ))}
                </div>
            </div>

            <div className="post-body">
                <h1 className="post-title">{post.tittle}</h1>
                <p className="post-description">{post.description}</p>

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
