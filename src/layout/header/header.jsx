import './header.css';
import { url } from '../../functions/url.js';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    let header = '';
    let logo = '';
    const navigate = useNavigate();

    if (url !== 'post' && url !== 'user' && url !== 'rawgAPI') {

        logo = (
            <img src="../images/logo_small.webp"
                alt="Logo GGPost"
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/')} />
        );

        header = (
            <div className="header-bar">
                <div className="api">
                    <div className="api-time" id="api-time">

                    </div>
                </div>
            </div>
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
                    <img src="../images/default.png"
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