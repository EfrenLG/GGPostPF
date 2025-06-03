import './User.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';
import PostsCard from '../../components/PostsCard/PostsCard';
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const User = () => {

    const [dataUser, setDataUser] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const [selectedTab, setSelectedTab] = useState('datos');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);

    const navigate = useNavigate();

    const { icon, setIcon } = useContext(UserContext);

    const userId = localStorage.getItem('userId');

    const dataUserAPI = async (userId) => {

        try {
            const dataUserR = await userService.getUser(userId);

            setDataUser(dataUserR.data.usuario);
            setDataPost(dataUserR.data.post);

            localStorage.setItem('userIcon', dataUserR.data.usuario.icon);

        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.log('Error cargando los post', error);
        };
    };

    useEffect(() => {
        if (userId) {
            dataUserAPI(userId);
        } else {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("No se ha seleccionado ninguna imagen.");
            return;
        };

        const formData = {

            "id": userId,
            "file": selectedFile.name
        };

        await userService.updateIconUser(formData);

        const formData2 = new FormData();
        formData2.append("id", userId);
        formData2.append("file", selectedFile);

        await userService.saveIconUser(formData2);

        localStorage.setItem("userIcon", selectedFile.name);
        setIcon(selectedFile.name);
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("No se ha seleccionado ninguna imagen.");
            return;
        };

        const formData = {
            'idUser': userId,
            'file': selectedFile.name,
            'tittle': selectedTitle,
            'description': selectedDescription,
        };

        await userService.newPost(formData);

        const formData2 = new FormData();
        formData2.append("file", selectedFile);

        await userService.newImagePost(formData2);
    };

    return (
        <section className="user-panel">
            <h2>Panel de Usuario</h2>

            <input
                type="radio"
                name="tab"
                id="tab-datos"
                checked={selectedTab === 'datos'}
                onChange={() => setSelectedTab('datos')}
            />
            <label htmlFor="tab-datos">Mis Datos</label>

            <input
                type="radio"
                name="tab"
                id="tab-user_posts"
                checked={selectedTab === 'user_posts'}
                onChange={() => setSelectedTab('user_posts')}
            />
            <label htmlFor="tab-user_posts">Mis Posts</label>

            <input
                type="radio"
                name="tab"
                id="tab-add_posts"
                checked={selectedTab === 'add_posts'}
                onChange={() => setSelectedTab('add_posts')}
            />
            <label htmlFor="tab-add_posts">Subir Post</label>

            <input
                type="radio"
                name="tab"
                id="tab-close_session"
                checked={selectedTab === 'close_session'}
                onChange={() => setSelectedTab('close_session')}
            />
            <label htmlFor="tab-close_session">Cerrar Sesión</label>

            <div className="tab-content datos">
                <form className="profile-form" id="profile-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="profile-image-wrapper">
                        <input type="file" id="profile-pic" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <label htmlFor="profile-pic" className="profile-image-label">
                            <img src={`https://ggpostb.onrender.com/icons/${icon}`} alt="Imagen de perfil" id="changeIcon"
                                className="profile-image" />
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor={dataUser.username}>Nombre de usuario</label>
                        <input type="text" id={dataUser.username} value={dataUser.username} disabled />
                    </div>

                    <div className="form-group">
                        <label htmlFor={dataUser.email}>Correo electrónico</label>
                        <input type="email" id={dataUser.email} value={dataUser.email} disabled />
                    </div>

                    <button type="submit" className="btn-save-image">Guardar imagen</button>
                </form>
            </div>

            <div className="tab-content user_posts">
                <PostsCard posts={dataPost} />
            </div>

            <div className="tab-content add_posts">
                <form className="post-form" id="post-form" onSubmit={(e) => handleSubmitPost(e)}>
                    <div className="post-image-wrapper">
                        <input type="file" id="post-pic" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <label htmlFor="post-pic" className="post-image-label">
                            <img src="" alt="Imagen del post" id="imagePost" className="post-image" />
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tittle">Título del post</label>
                        <input type="text" id="tittle" required onChange={(e) => setSelectedTitle(e.target.value)} />
                        <p id="mess-titt"></p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción del post</label>
                        <input type="text" id="description" required onChange={(e) => setSelectedDescription(e.target.value)} />
                        <p id="mess-des"></p>
                    </div>

                    <button type="submit" className="btn-save-post">Guardar post</button>
                </form>
            </div>
        </section>
    );
};

export default User;