// React y hooks
import { useEffect, useState } from 'react';

// Navegación
import { useNavigate } from 'react-router-dom';

// Estilos
import './Post.css';

// Servicios
import userService from '../../services/api';

// Componentes
import MenuToggle from '../../components/MenuToggle/MenuToggle';
import PostsCard from '../../components/PostsCard/PostsCard';


const Post = () => {

    const [dataPost, setDataPost] = useState([]);
    const [dataUser, setDataUser] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadPost();
    }, []);

    const userId = localStorage.getItem('userId');

    const loadPost = async () => {

        try {
            const getPostsR = await userService.getPosts();

            setDataPost(getPostsR.data.posts);

            const dataUserR = await userService.getUser(userId);

            setDataUser(dataUserR.data.usuario);

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
            <PostsCard posts={dataPost} usuario={dataUser} />
        </>
    );
};

export default Post;