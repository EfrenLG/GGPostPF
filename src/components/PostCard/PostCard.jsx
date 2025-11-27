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
    const [likes, setLikes] = useState(post.likes || []);

    // Chat
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const wsRef = useRef(null);

    const navigate = useNavigate();

    // --------------------------
    // 🔌 WEBSOCKET CHAT CONEXIÓN
    // --------------------------
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

    // --------------------
    // ❤️ ENVIAR LIKE
    // --------------------
    const handleLike = async () => {
        try {
            await userService.likePost({
                idPost: post._id,
                userId
            });

            setLikes(prev =>
                prev.includes(userId)
                    ? prev.filter(id => id !== userId)
                    : [...prev, userId]
            );

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="post-page">

            {/* HEADER DEL POST */}
            <div className="post-header-section">
                <img src={user.icon} className="post-user-icon" alt="user icon" />
                <div className="post-user-info">
                    <h2>{user.username}</h2>
                    <span className="post-date">{post.date}</span>
                </div>
            </div>

            {/* IMAGEN DEL POST */}
            <img src={post.file} alt={post.tittle} className="post-image-full" />

            {/* INFO DEL POST */}
            <div className="post-content">
                <h1 className="post-title">{post.tittle}</h1>
                <p className="post-description">{post.description}</p>

                <div className="post-likes">
                    {likes.includes(userId) ? (
                        <i className="fa fa-heart heart-liked" onClick={handleLike}></i>
                    ) : (
                        <i className="fa-regular fa-heart heart-not-liked" onClick={handleLike}></i>
                    )}
                    <span>{likes.length} likes</span>
                </div>

                <div className="post-categories">
                    {post.categories?.split(",").map(cat => (
                        <span key={cat} className="cat-tag">#{cat.trim()}</span>
                    ))}
                </div>
            </div>

            {/* CHAT DEL POST */}
            <div className="chat-section">
                <h2>Comentarios</h2>

                <div className="chat-messages">
                    {messages.length === 0 && (
                        <p className="no-msg">Todavía no hay mensajes</p>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className="chat-message">
                            <strong>{msg.username || "Anon"}:</strong> {msg.message}
                        </div>
                    ))}
                </div>

                <div className="chat-input-box">
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
