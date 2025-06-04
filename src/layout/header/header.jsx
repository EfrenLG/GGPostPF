// Estilos
import './header.css';

// React y librerías de terceros
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';

// Contextos
import { UserContext } from "../../context/UserContext";

// Funciones/utilidades
import { url } from '../../functions/url.js';

const Header = () => {
  const { icon } = useContext(UserContext);

    let header = '';
    let logo = '';
    const navigate = useNavigate();
    const resultURL = url();

    const iconUser = icon ? icon : '../images/default.png';

    if (resultURL !== 'post' && resultURL !== 'user' && resultURL !== 'rawgAPI') {

        logo = (
            <img src="../images/logo_small.webp"
                alt="Logo GGPost"
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')} />
        );
    } else {

        logo = (
            <img src="../images/logo_small.webp"
                alt="Logo GGPost"
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/post')} />
        );

        header = (
            <div className="header-right">
                <div className="profile-icon">
                    <img
                        src={`${iconUser}`}
                        alt="Perfil"
                        id="profile-image"
                        className="profile-img"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/user')} />
                </div>
            </div>
        );
    };

    return (
        <header>
            <div className="header-content">
                {logo}

                <h1 className="header-title">GGPost – Noticias, clips y gloria gamer</h1>

                {header}
            </div>
        </header>
    );
};

export default Header;