import { useState, useEffect } from 'react';
import userService from '../../services/api';
import './PostsCard.css';
import { url } from '../../functions/url';
import { useNavigate } from 'react-router-dom';

const PostsCard = ({ posts }) => {

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const [selectedPost, setselectedPost] = useState(null);
    const [seeker, setSeeker] = useState('');
    const [like, setLike] = useState(false);
    const [likes, setLikes] = useState(0);
    const [disabledV, setDisabled] = useState(true);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [selectedCategorie, setSelectedCategorie] = useState(null);
    const resultURL = url();

    const navigate = useNavigate();

    useEffect(() => {
        if (resultURL === 'user') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [resultURL]);
    const filterPosts = posts.filter(post => {

        if (!seeker) {
            return true;
        };

        const categorias = post.categories.split(',');

        return categorias.some(cat => cat.toLowerCase().includes(seeker));
    });

    useEffect(() => {
        if (selectedPost && selectedPost.likes) {
            const hasLiked = selectedPost.likes.some((likeId) => likeId === userId);
            setLike(hasLiked);
            setLikes(selectedPost.likes.length);
        }
    }, [selectedPost, userId]);

    const handlePostClick = (post) => {
        setselectedPost(post);
    };

    const viewLike = (operation) => {
        setLikes(prevLikes => operation === 'sum' ? prevLikes + 1 : prevLikes - 1);
    };

    const closeModal = () => {
        setselectedPost(null);
    };

    const sendView = async (idPost) => {

        const dataPost = {
            'idPost': idPost
        };

        await userService.viewPost(dataPost);
    };

    const sendLike = async (idPost, idUser) => {

        const postData = {
            'idPost': idPost,
            'userId': idUser
        };

        await userService.likePost(postData);
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

    return (<>

        <div className='seeker'>
            <input type="text" id="buscador" placeholder='Introduzca un #...' value={seeker} onChange={(e) => setSeeker(e.target.value)} />
            <div id="userPosts" className="posts-container"></div>
        </div>

        <div id="userPosts" className="posts-container">
            {filterPosts.map((post) => (
                <div className="post-card" key={post._id}
                    onClick={() => {
                        handlePostClick(post);
                        post.idUser !== userId ? sendView(post._id) : false;
                    }}>
                    <img
                        src={`https://ggpostb.onrender.com/post/${post.file}`}
                        alt={post.file}
                        className="post-image"
                    />
                    <div className="post-details">
                        <h3>{post.tittle}</h3>
                        <p>{post.description}</p>
                    </div>
                </div>
            ))}
        </div>

        {selectedPost && (
            <div id="postModal" className='modal'>
                <div className="modal-content">
                    <span>Visitas: {selectedPost.views}</span>
                    {like === true ? (
                        <>
                            <i className="fa fa-heart" style={{ color: '#ff0000' }}
                                onClick={() => {
                                    setLike(false),
                                        sendLike(selectedPost._id, userId),
                                        viewLike('res');
                                }}></i> Likes: {likes}
                        </>
                    ) : (
                        <>
                            <i className="fa-regular fa-heart"
                                onClick={() => {
                                    setLike(true),
                                        sendLike(selectedPost._id, userId),
                                        viewLike('sum');
                                }}></i> Likes: {likes}
                        </>
                    )}
                    <span className="like-btn" id="like-btn"> </span>
                    <span className="close-btn" onClick={closeModal}>&times;</span>
                    <p id="modal-id">{selectedPost._id}</p>
                    <img
                        id="modal-img"
                        src={`https://ggpostb.onrender.com/post/${selectedPost.file}`}
                    />
                    <input type="text" id="modal-title"
                        value={selectedPost.tittle}
                        disabled={disabledV}
                        onChange={(e) => setSelectedTitle(e.target.value)}
                        required
                    />

                    <input type="text" id="modal-description"
                        value={selectedPost.description}
                        disabled={disabledV}
                        onChange={(e) => setSelectedDescription(e.target.value)}
                        required
                    />

                    <input type="text" id="modal-categories"
                        value={selectedPost.categories}
                        disabled={disabledV}
                        onChange={(e) => setSelectedCategorie(e.target.value)}
                        required
                    />

                    {username === 'admin' || resultURL === 'user' && (
                        <>
                            <button type="button" className="edit-btn" id="editPost" onClick={() => editPost(selectedPost._id)}>Editar</button>
                            <button className="delete-btn" id="deletePost" onClick={() => deletePost(selectedPost._id)}>Eliminar</button>
                        </>
                    )}
                </div>
            </div>
        )}
    </>
    );
};

export default PostsCard;