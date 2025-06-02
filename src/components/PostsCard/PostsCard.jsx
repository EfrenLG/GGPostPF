import { useState } from 'react';
import userService from '../../services/api';
import './PostsCard.css';

const PostsCard = ({ posts }) => {

    const username = localStorage.getItem('username');
    const [selectedPost, setselectedPost] = useState(null);
    const [seeker, setSeeker] = useState('');

    const filterPosts = posts.filter(post => {

        if (!seeker) {
            return true;
        };

        const categorias = post.categories.split(',');

        return categorias.some(cat => cat.toLowerCase().includes(seeker));
    });

    const handlePostClick = (post) => {
        setselectedPost(post);
    };

    const closeModal = () => {
        setselectedPost(null);
    };

    const sendView = async (idPost) => {
        await userService.viewPost(idPost);
    };

    /*const editPost = async () => {


    };*/

    const deletePost = async (idPost) => {

        await userService.deletePost(idPost);
    };

    return (<>

        <div className='seeker'>
            <input type="text" id="buscador" value={seeker} onChange={(e) => setSeeker(e.target.value)} />
            <div id="userPosts" className="posts-container"></div>
        </div>

        <div id="userPosts" className="posts-container">
            {filterPosts.map((post) => (
                <div className="post-card" key={post._id}
                    onClick={() => {
                        handlePostClick(post);
                        post.id !== username ? sendView(post.id) : false;
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
                    <span className="like-btn" id="like-btn"> </span>
                    <span className="close-btn" onClick={closeModal}>&times;</span>
                    <p id="modal-id">{selectedPost.id}</p>
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
                            <button className="delete-btn" id="deletePost" onClick={() => deletePost(selectedPost.id)}>Eliminar</button>
                        </>
                    )}
                </div>
            </div>
        )}
    </>
    );
};

export default PostsCard;