import './header.css';
import { url } from '../../functions/url.js';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const Header = () => {
  const { icon } = useContext(UserContext);

    let header = '';
    let logo = '';
    const navigate = useNavigate();
    const resultURL = url();


    const iconUser = icon ? icon : 'default.png';

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
                        src={`https://ggpostb.onrender.com/icons/${iconUser}`}
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