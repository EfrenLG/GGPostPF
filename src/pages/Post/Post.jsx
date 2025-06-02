import { useEffect, useState } from 'react';
import userService from '../../services/api';
import './Post.css';
import { useNavigate } from 'react-router-dom';
import MenuToggle from '../../components/MenuToggle/MenuToggle';
import PostsCard from '../../components/PostsCard/PostsCard';

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

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            }
            console.log('Error cargando los post', error);
        };
    };

    return (
        <>
            <MenuToggle />
            <PostsCard posts={dataPost} />
        </>
    );
};

export default Post;