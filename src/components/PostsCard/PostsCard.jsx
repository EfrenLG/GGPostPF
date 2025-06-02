import { useState } from 'react';
import userService from '../../services/api';
import './PostsCard.css';

const PostsCard = ({ posts }) => {

    const username = localStorage.getItem('username');
    const [selectedPost, setselectedPost] = useState(null);

    const handlePostClick = (post) => {
        setselectedPost(post);
    };

    const closeModal = () => {
        setselectedPost(null);
    };

    /*const editPost = async () => {


    };*/

    const deletePost = async (idPost) => {

        await userService.deletePost(idPost);
    };

    return (<>

        <div id="userPosts" className="posts-container">
            {posts.map((post) => (
                <div className="post-card" key={post._id} onClick={() => handlePostClick(post)}>
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
            ))};
        </div>

        {selectedPost && (
            <div id="postModal" className='modal'>
                <div className="modal-content">
                    <span className="close-btn" onClick={closeModal}>&times;</span>
                    <p id="modal-id">{selectedPost.id}</p>
                    <img
                        id="modal-img"
                        src={`https://ggpostb.onrender.com/post/${selectedPost.file}`}
                    />
                    <input type="text" id="modal-title" value={selectedPost.tittle} disabled />
                    <input type="text" id="modal-description" value={selectedPost.description} disabled />
                    {username === 'admin' && (
                        <>
                            <button type="button" className="edit-btn" id="editPost">Editar</button>
                            <button className="delete-btn" id="deletePost" onClick={() => deletePost(selectedPost.id)}>Eliminar</button>
                        </>
                    )};
                </div>
            </div>
        )}
    </>
    );
};

export default PostsCard;