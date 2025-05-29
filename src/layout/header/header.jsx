import './header.css';
import { url } from '../../functions/url.js';

const Header = () => {


    let header = '';
    let logo = '';

    if (url !== 'post.html' && url !== 'user.html' && url !== 'rawgAPI.html') {

        logo = (
            <a href="./index.html">
                <img src="../images/logo_small.webp" alt="Logo GGPost" className="header-logo" />
            </a>
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
            <a href="./post.html">
                <img src="../images/logo_small.webp" alt="Logo GGPost" className="header-logo" />
            </a>
        );

        header = (
            <div className="header-right">
                <div className="profile-icon">
                    <a href="./user.html">
                        <img src="../images/default.png" alt="Perfil" id="profile-image" className="profile-img" />
                    </a>
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