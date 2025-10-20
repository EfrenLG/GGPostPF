// React
import React from 'react';
import { useState, useEffect, useRef } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Servicios y funciones
import userService from '../../services/api';
import { url } from '../../functions/url';

// Componentes
import AdBanner from '../AdBanner/AdBanner';

// Estilos
import './PostsCard.css';

// Variables

const adClient = import.meta.env.VITE_ADSLOT;
const adSlot = import.meta.env.VITE_ADCLIENT;


const PostsCard = ({ posts, usuarios }) => {

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const [usuariosD, setUsuariosD] = useState([]);
    const [selectedPost, setselectedPost] = useState(null);
    const [seeker, setSeeker] = useState('');
    const [likesData, setLikesData] = useState({});
    const [disabledV, setDisabled] = useState(true);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [selectedCategorie, setSelectedCategorie] = useState(null);

    const resultURL = url();
    const navigate = useNavigate();

    //CHAT
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const wsRef = useRef(null);

    useEffect(() => {
        if (Array.isArray(usuarios)) {
            setUsuariosD(usuarios);
        }
    }), [usuarios];

    useEffect(() => {
        if (!selectedPost) return;

        const URL_API = import.meta.env.VITE_URL_API;

        const ws = new WebSocket(URL_API);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket conectado');

            ws.send(JSON.stringify({ type: 'join', postId: selectedPost._id }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'history') {
                setMessages(data.messages);
            } else if (data.type === 'message') {
                setMessages((prev) => [...prev, data]);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket cerrado');
        };

        return () => {
            ws.close();
            wsRef.current = null;
            setMessages([]);
        };
    }, [selectedPost]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    type: 'message',
                    postId: selectedPost._id,
                    user: username,
                    message: newMessage,
                })
            );
            setNewMessage('');
        }
    };

    useEffect(() => {
        if (resultURL === 'user') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [resultURL]);

    useEffect(() => {
        if (selectedPost) {
            setSelectedTitle(selectedPost.tittle || '');
            setSelectedDescription(selectedPost.description || '');
            setSelectedCategorie(selectedPost.categories || '');
        }
    }, [selectedPost]);

    const handlePostClick = (post) => {
        setselectedPost(post);
    };

    const closeModal = () => {
        setselectedPost(null);
    };

    // Servicios
    const sendView = async (idPost) => {

        const dataPost = {
            'idPost': idPost
        };

        try {

            await userService.viewPost(dataPost);

        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.log('Error cargando los post', error);
        };
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

    const editPost = async (idPost) => {

        const dataPost = {
            'idPost': idPost,
            'tittlePost': selectedTitle,
            'descriptionPost': selectedDescription,
            'categoriesPost': selectedCategorie
        };

        try {

            await userService.editPost(dataPost);

            window.location.reload();
        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.log('Error cargando los post', error);
        };
    };

    const deletePost = async (idPost) => {
        const confirmed = confirm('Va a eliminar un post, desea seguir?');
        if (!confirmed) return;

        try {

            await userService.deletePost(idPost);
            window.location.reload();

        } catch (error) {
            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.error("Error eliminando el post:", error);
            alert("No se pudo eliminar el post. Inténtalo de nuevo.");
        };
    };

    const filterPosts = posts.filter(post => {
        if (!seeker) return true;

        if (!post.categories || typeof post.categories !== 'string') return false;

        const categorias = post.categories.split(',');

        return categorias.some(cat => cat.toLowerCase().includes(seeker.toLowerCase()));
    });

    return (<>

        <div className='seeker'>
            <input type="text" id="buscador" placeholder='Introduzca un #...' value={seeker} onChange={(e) => setSeeker(e.target.value)} />
        </div>

        <div className="post-wrapper">
            <div id="userPosts" className="posts-container">
                {filterPosts.map((post, index) => (
                    <React.Fragment key={post._id}>

                        <div className="post-card" key={post._id}
                            onClick={(e) => {
                                const isFollowButton = e.target.closest('.follow-button');
                                if (!isFollowButton) {
                                    handlePostClick(post);
                                    post.idUser !== userId && sendView(post._id);
                                }
                            }}
                        >
                            {resultURL !== 'user' && (
                                <div className="post-header">
                                    <img src={usuariosD.find(u => u.id === post.idUser)?.icon} alt='icon' className='icon' id={post.idUser} ></img>
                                    <span className="author-name">{post.username}</span>
                                    {post.idUser !== userId && (
                                        <button id={post.idUser}
                                            className="follow-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleFollow(post.idUser);
                                            }}
                                        >
                                            Seguir
                                        </button>
                                    )}
                                </div>
                            )}

                            <img src={post.file} alt={post.tittle} className="post-image-card" />

                            <div className="post-title">{post.tittle}</div>
                            <div className="post-description">{post.description}</div>

                            <div className="post-footer">
                                <span className="views-count">{post.views} vistas</span>
                                <span className="likes-count">
                                    <span className="likes-count">
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
                                    </span>
                                </span>
                            </div>
                        </div>

                        {(index + 1) % 5 === 0 && (
                            <AdBanner adClient={adClient} adSlot={adSlot} style={{ margin: '20px 0' }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {selectedPost && (
            <div id="postModal" className='modal' onClick={(e) => {
                if (e.target.classList.contains('modal')) closeModal();
            }}>
                <div className="modal-content">
                    <div className="post-meta">

                        <span className="close-btn" onClick={closeModal}>&times;</span>
                    </div>
                    <p id="modal-id">{selectedPost._id}</p>
                    <img
                        id="modal-img"
                        src={`${selectedPost.file}`}
                    />
                    <input type="text" id="modal-title"
                        value={selectedTitle}
                        disabled={disabledV}
                        onChange={(e) => setSelectedTitle(e.target.value)}
                        required
                    />

                    <textarea
                        id="modal-description"
                        value={selectedDescription}
                        disabled={disabledV}
                        onChange={(e) => setSelectedDescription(e.target.value)}
                        required
                    />

                    <input type="text" id="modal-categories"
                        value={selectedCategorie}
                        disabled={disabledV}
                        onChange={(e) => setSelectedCategorie(e.target.value)}
                        required
                    />

                    {(username === 'admin' || resultURL === 'user') && (
                        <>
                            <button type="button" className="edit-btn" id="editPost" onClick={() => editPost(selectedPost._id)}>Editar</button>
                            <button className="delete-btn" id="deletePost" onClick={() => deletePost(selectedPost._id)}>Eliminar</button>
                        </>
                    )}
                    <div className="chat-container">
                        <div className="chat-header">
                            <h1>Chat del post</h1>
                        </div>
                        <div className="chat-messages" id="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className="chat-message">
                                    <strong>{msg.username}: </strong>{msg.message}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                id="messageInput"
                                placeholder="Escribe un mensaje..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button id="sendButton" onClick={handleSendMessage}>Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
    );
};

export default PostsCard;