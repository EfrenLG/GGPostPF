import { useEffect, useState } from 'react';
import userService from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Post = () => {

    const [dataPost, setDataPost] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {

        try {
            const getPostsR = await userService.getPosts();

            setDataPost(getPostsR.data.posts);

            console.log(dataPost);
        } catch (error) {

            if(error === 'Acceso no autorizado'){
                navigate('/')
            }
            console.log('Error cargando los post', error);
        };
    };

    return (
        <div>
            <h1>hpaa</h1>
        </div>
    );
};

export default Post;