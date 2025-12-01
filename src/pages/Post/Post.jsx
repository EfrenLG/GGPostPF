// React y hooks
import { useEffect, useState } from 'react';

// Navegación
import { useNavigate, useParams  } from 'react-router-dom';

// Estilos
import './Post.css';

// Servicios
import userService from '../../services/api';

// Componentes
import MenuToggle from '../../components/MenuToggle/MenuToggle';
import PostCard from '../../components/PostCard/PostCard';


const Post = () => {

    const [dataPost, setDataPost] = useState([]);
    const [dataUser, setDataUser] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {

        const verifyToken = async () => {
            try {
                const res = await userService.checkToken();

                if (res.data.message === 'Token válido') {
                    console.log('Token válido');
                    loadPost();

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
            const getPost = await userService.getPost(id);

            setDataPost(getPost.data.post);
            setDataUser(getPost.data.user);

        } catch (error) {

            console.log('Error cargando los post', error);
        };
    };

    return (
        <>
            <PostCard post={dataPost} user={dataUser} />
        </>
    );
};

export default Post;