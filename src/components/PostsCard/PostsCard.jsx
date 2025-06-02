import { useState, useEffect } from 'react';
import userService from '../../services/api';
import './PostsCard.css';

const PostsCard = ({ posts }) => {

    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const [selectedPost, setselectedPost] = useState(null);
    const [seeker, setSeeker] = useState('');
    const [like, setLike] = useState(false);
    const [likes, setLikes] = useState(0);

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
        }
    }, [selectedPost, userId]);

    const handlePostClick = (post) => {
        setselectedPost(post);
    };

    const viewLike = (likes, operation) => {

        const cont = operation === 'sum' ? likes + 1 : likes - 1;
        return cont;
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

    /*const editPost = async () => {


    };*/

    const deletePost = async (idPost) => {

        await userService.deletePost(idPost);
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
                        post._id !== username ? sendView(post._id) : false;
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
                {setLikes(selectedPost.likes.length)}
                <div className="modal-content">
                    <span>Visitas: {selectedPost.views}</span>
                    {like === true ? (
                        <>
                            <i className="fa fa-heart" style={{ color: '#ff0000' }}
                                onClick={() => {
                                    setLike(false),
                                        sendLike(selectedPost._id, userId),
                                        viewLike(selectedPost.likes.length, 'res')
                                }}></i> Likes: {likes}
                        </>
                    ) : (
                        <>
                            <i className="fa-regular fa-heart"
                                onClick={() => {
                                    setLike(true),
                                        sendLike(selectedPost._id, userId),
                                        viewLike(selectedPost.likes.length, 'sum')
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
                    <input type="text" id="modal-title" value={selectedPost.tittle} disabled />
                    <input type="text" id="modal-description" value={selectedPost.description} disabled />
                    <input type="text" id="modal-categories" value={selectedPost.categories} disabled />

                    {username === 'admin' && (
                        <>
                            <button type="button" className="edit-btn" id="editPost">Editar</button>
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