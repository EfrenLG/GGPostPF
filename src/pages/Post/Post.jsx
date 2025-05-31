import { useEffect, useState } from 'react';
import userService from '../../services/api';

const Post = () => {

    const [dataPost, setDataPost] = useState([]);

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {

        try {
            const getPostsR = await userService.getPosts();

            setDataPost(getPostsR.data);

            console.log(dataPost);
        } catch (error) {

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