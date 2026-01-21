// React
import { useEffect, useState } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

// Componentes
import PostsCard from '../../components/PostsCard/PostsCard';
import ChargeCard from '../../components/ChargeCard/ChargeCard';

// Servicios
import userService from '../../services/api';

// Estilos
import './User.css';

const User = () => {

    const [dataUser, setDataUser] = useState([]);
    const [dataPost, setDataPost] = useState([]);
    const [selectedTab, setSelectedTab] = useState('datos');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrlIcon, setPreviewUrlIcon] = useState(null);
    const [previewUrlPost, setPreviewUrlPost] = useState(null);
    const [selectedTitle, setSelectedTitle] = useState(null);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [showModalIcon, setShowModalIcon] = useState(false);
    const [showModalAddPost, setShowModalAddPost] = useState(false);
    const [showCard, setShowCard] = useState(false);

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
        
        const verifyToken = async () => {
            try {
                const res = await userService.checkToken(); 

                if (res.data.message === 'Token válido') {   
                    dataUserAPI(userId);                      
                } else {
                    navigate('/');                            
                }
            } catch (err) {
                navigate('/'); 
            }
        };

        verifyToken();
    }, [navigate, userId]);

    useEffect(() => {

        if (!showModalIcon) {
            setSelectedFile(null);
            setPreviewUrlIcon(null)
        };

        if (!showModalAddPost) {
            setSelectedFile(null);
            setPreviewUrlPost(null)
        };
    }, [showModalAddPost, showModalIcon]);

    let imageUrlIcon = '';
    let imageUrlPost = '';

    const iconUser = icon !== 'default.png' ? icon : '../images/default.png';

    const handleFileChangeIcon = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {

            const imageUrl = URL.createObjectURL(file);
            setPreviewUrlIcon(imageUrl);

        } else {

            setPreviewUrlIcon(null);
        };
    };

    const handleFileChangePost = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFile(files);

        if (files) {

            const imageUrl = URL.createObjectURL(files);
            setPreviewUrlPost(imageUrl);

        } else {

            setPreviewUrlPost(null);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("No se ha seleccionado ninguna imagen.");
            return;
        };

        try {

            setShowCard(true);

            const formData2 = new FormData();
            formData2.append('file', selectedFile);

            const response = await userService.saveIconUser(formData2);

            imageUrlIcon = response.data.imageUrl;

            localStorage.setItem("userIcon", imageUrlIcon);
            setIcon(imageUrlIcon);

            const formData = {

                "id": userId,
                "file": imageUrlIcon
            };
            await userService.updateIconUser(formData);

            window.location.reload();
        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.log('Error cargando los post', error);
        };
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("No se ha seleccionado ninguna imagen.");
            return;
        };

        try {
            const formData2 = new FormData();
            formData2.append("file", selectedFile);

            const response = await userService.newImagePost(formData2);

            imageUrlPost = response.data.imageUrl;

            const formData = {
                'idUser': userId,
                'file': imageUrlPost,
                'tittle': selectedTitle,
                'description': selectedDescription,
            };

            await userService.newPost(formData);

            window.location.reload();
        } catch (error) {

            if (error.response.data.error === 'Acceso no autorizado') {
                navigate('/')
            };
            console.log('Error cargando los post', error);
        };
    };

    const closeSesion = () => {

        localStorage.removeItem('userIcon');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');

        navigate('/');
    };

    const firstLetter = (string) => {
        if (!string) return "";
        return string.toUpperCase();
    };

    return (
        <section className="user-panel">

            <section className="user-profile-banner">
                <div className="profile-container">

                    <div className="profile-pic-wrapper" onClick={() => setShowModalIcon(true)}>
                        <img src={iconUser} alt="Imagen de perfil" className="profile-pic" />
                    </div>

                    <div className="posts-count">
                        <h3>{dataPost?.length || 0}</h3>
                        <p>Posts totales</p>
                    </div>

                    <div className="user-data">
                        <p><strong>Usuario:</strong> {firstLetter(dataUser?.username)}</p>
                        <p><strong>Email:</strong> {dataUser.email}</p>
                    </div>
                </div>

                {showModalIcon && (
                    <div className="modal-overlay" onClick={() => setShowModalIcon(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {showCard && <ChargeCard text='✅ Imagen Guardada' />}

                            <h2 className='modal-title'>Cambiar foto de perfil</h2>

                            <div className="modal-image-preview">
                                <img src={previewUrlIcon || "../images/no-image.jpeg"} alt="Imagen de perfil" className="profile-pic-preview" />
                            </div>

                            <div className="modal-image-input-wrapper">
                                <input type="file" accept="image/*" id="profile-image-input" className="file-input" onChange={handleFileChangeIcon} />
                                <label htmlFor="profile-image-input" className="custom-file-label">
                                    Seleccionar imagen
                                </label>
                            </div>

                            <button onClick={handleSubmit} className="btn-save-image">Guardar imagen</button>
                        </div>
                    </div>
                )}

                <div className="logout-button-wrapper">
                    <input
                        type="radio"
                        name="tab"
                        id="tab-close_session"
                        checked={selectedTab === 'close_session'}
                        onChange={() => setSelectedTab('close_session')}
                        onClick={() => closeSesion()}
                    />
                    <label htmlFor="tab-close_session" className="logout-label">Cerrar Sesión</label>
                </div>
            </section>

            <section className="user-profile-post">
                <div className="post-header">
                    <div className="post-header-inner">
                        <h2>Mis Post</h2>
                        <button onClick={() => setShowModalAddPost(true)}>+ Nuevo post</button>
                    </div>
                </div>

                {showModalAddPost && (
                    <div className="modal-overlay" onClick={() => setShowModalAddPost(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {showCard && <ChargeCard text="✅ Post subido" />}

                            <h1 className="post-title">Nuevo Post</h1>
                            <form className="post-form" id="post-form" onSubmit={(e) => handleSubmitPost(e)}>
                                <div className="post-image-wrapper">
                                    <input type="file" id="post-pic" accept="image/*" onChange={handleFileChangePost} />
                                    <label htmlFor="post-pic" className="post-image-label">

                                        <img src={previewUrlPost || "../images/no-image.jpeg"} alt="Imagen del post" id="imagePost" className=" post-image" />

                                    </label>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tittle">Título:</label>
                                    <input type="text" id="tittle" placeholder='Titulo del post' required onChange={(e) => setSelectedTitle(e.target.value)} />
                                    <p id="mess-titt"></p>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Descripción:</label>
                                    <input type="text" id="description" placeholder='Descripción del post' required onChange={(e) => setSelectedDescription(e.target.value)} />
                                    <p id="mess-des"></p>
                                </div>

                                <button type="submit" className="btn-save-post">Guardar post</button>
                            </form>
                        </div>
                    </div>
                )}

                <PostsCard posts={dataPost} usuario={dataUser} />
            </section>

        </section>
    );
};

export default User;

