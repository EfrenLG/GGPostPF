import './User.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';
import PostsCard from '../../components/PostsCard/PostsCard';

const User = () => {

    const [dataUser, setDataUser] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const userIcon = localStorage.getItem('userIcon');

    const dataUserAPI = async (userId) => {

        try {
            const dataUserR = await userService.getUser(userId);

            console.log(dataUserR);
            setDataUser(dataUserR.data.usuario);
            setDataPost(dataUserR.data.post);


        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            }
            console.log('Error cargando los post', error);
        };
    };

    dataUserAPI(userId);

    const icon = userIcon ? userIcon : 'default.png';

    return (
        <>
            <section className="user-panel">
                <h2>Panel de Usuario</h2>

                <input type="radio" name="tab" id="tab-datos" checked />
                <label htmlFor="tab-datos">Mis Datos</label>

                <input type="radio" name="tab" id="tab-user_posts" />
                <label htmlFor="tab-user_posts">Mis Posts</label>

                <input type="radio" name="tab" id="tab-add_posts" />
                <label htmlFor="tab-add_posts">Subir Post</label>

                <input type="radio" name="tab" id="tab-close_session" />
                <label htmlFor="tab-close_session">Cerrar Sesión</label>

                <div className="tab-content datos">
                    <form className="profile-form" id="profile-form">
                        <div className="profile-image-wrapper">
                            <input type="file" id="profile-pic" accept="image/*" />
                            <label htmlFor="profile-pic" className="profile-image-label">
                                <img src={`https://ggpostb.onrender.com/icons/${icon}`} alt="Imagen de perfil" id="changeIcon"
                                    className="profile-image" />
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor={dataUser.username}>Nombre de usuario</label>
                            <input type="text" id={dataUser.username} value={dataUser.username} />
                        </div>

                        <div className="form-group">
                            <label htmlFor={dataUser.email}>Correo electrónico</label>
                            <input type="email" id={dataUser.email} value={dataUser.email} />
                        </div>

                        <button type="submit" className="btn-save-image">Guardar imagen</button>
                    </form>
                </div>

                <div className="tab-content user_posts">
                    <PostsCard posts={dataPost} />
                </div>
                
                <div className="tab-content add_posts">
                    <form className="post-form" id="post-form">
                        <div className="post-image-wrapper">
                            <input type="file" id="post-pic" accept="image/*" />
                            <label htmlFor="post-pic" className="post-image-label">
                                <img src="" alt="Imagen del post" id="imagePost" className="post-image" />
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tittle">Título del post</label>
                            <input type="text" id="tittle" required />
                            <p id="mess-titt"></p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Descripción del post</label>
                            <input type="text" id="description" required />
                            <p id="mess-des"></p>
                        </div>

                        <button type="submit" className="btn-save-post">Guardar post</button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default User;