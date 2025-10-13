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

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        
        const verifyToken = async () => {
            try {
                const res = await userService.checkToken(); 

                if (res.data.message === 'Token válido') {   
                    console.log('Token válido');
                } else {
                    navigate('/');                            
                }
            } catch (err) {
                navigate('/'); 
            }
        };

        verifyToken();
    }, [navigate]);

    const loadPost = async () => {

        try {
            const getPostsR = await userService.getPosts();

            setDataPost(getPostsR.data.posts);

            const dataUserR = await userService.getUser(userId);

            setDataUser(dataUserR.data.usuario);

        } catch (error) {

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