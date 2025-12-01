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
        <div className="post-wrapper">
            <div className="post-container">

                {/* ================= WEB ================= */}
                <div className="post-web-layout">

                    {/* Izquierda */}
                    <div className="post-left">
                        <div className="post-header">
                            <img src={user.icon} className="post-user-avatar" />
                            <div className="post-user-block">
                                <h3>{user.username}</h3>
                                <span className="post-date">{post.date}</span>
                            </div>
                            {post.idUser !== userId && (
                                <button className="follow-btn">Seguir</button>
                            )}
                        </div>

                        <div className="post-media-container">
                            <img src={post.file} className="post-media" />
                        </div>
                    </div>

                    {/* Derecha */}
                    <div className="post-right">
                        <div className="post-body">
                            <h1 className="post-title">{post.tittle}</h1>
                            <p className="post-description">{post.description}</p>

                            <div className="post-actions">
                                <div className="likes-handler" onClick={() => sendLike(post._id, userId)}>
                                    {post.likes?.includes(userId) ? (
                                        <i className="fa fa-heart" style={{ color: "#ff0000" }}></i>
                                    ) : (
                                        <i className="fa-regular fa-heart"></i>
                                    )}
                                    <span>{post.likes?.length || 0}</span>
                                </div>

                                <div className="categories-container">
                                    {post.categories?.split(",").map((c) => (
                                        <span key={c}>#{c.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Comentarios */}
                        <div className="comments-section">
                            <h3>Comentarios</h3>
                            <div className="comments-box">
                                {messages.length === 0 ? (
                                    <p className="no-comments">Sé el primero en comentar</p>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div key={i} className="comment">
                                            <strong>{msg.username}: </strong>{msg.message}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="comment-input">
                                <input
                                    placeholder="Escribe un comentario..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                <button onClick={handleSendMessage}>Enviar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= MOVIL ================= */}
                <div className="post-mobile-layout">
                    <div className="post-header">
                        <img src={user.icon} className="post-user-avatar" />
                        <div className="post-user-block">
                            <h3>{user.username}</h3>
                            <span className="post-date">{post.date}</span>
                        </div>
                        {post.idUser !== userId && (
                            <button className="follow-btn">Seguir</button>
                        )}
                    </div>

                    <div className="post-media-container">
                        <img src={post.file} className="post-media" />
                    </div>

                    <div className="post-body">
                        <h1 className="post-title">{post.tittle}</h1>
                        <p className="post-description">{post.description}</p>

                        <div className="post-actions">
                            <div className="likes-handler" onClick={() => sendLike(post._id, userId)}>
                                {post.likes?.includes(userId) ? (
                                    <i className="fa fa-heart" style={{ color: "#ff0000" }}></i>
                                ) : (
                                    <i className="fa-regular fa-heart"></i>
                                )}
                                <span>{post.likes?.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h3>Comentarios</h3>
                        <div className="comments-box">
                            {messages.length === 0 ? (
                                <p className="no-comments">Sé el primero en comentar</p>
                            ) : (
                                messages.map((msg, i) => (
                                    <div key={i} className="comment">
                                        <strong>{msg.username}: </strong>{msg.message}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="comment-input">
                            <input
                                placeholder="Escribe un comentario..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>Enviar</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


export default PostCard;
