import './footer.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { url } from '../../functions/url.js';

const Footer = () => {
    const navigate  = useNavigate();
    const { icon }  = useContext(UserContext);
    const resultURL = url();
    const iconUser  = icon !== 'default.png' ? icon : '../images/default.png';

    // ACTUALIZADO: 'perfil' añadido para que el footer aparezca en páginas de perfil público
    const isApp = ['posts', 'user', 'rawgAPI', 'post', 'perfil'].includes(resultURL);

    if (!isApp) {
        return (
            <footer>
                <div className="footer-desktop">
                    <span>© 2025 GGPost</span>
                </div>
            </footer>
        );
    }

    return (
        <footer>
            <nav className="bottom-nav" aria-label="navegación principal">
                <button className={`nav-item ${resultURL === 'posts' ? 'active' : ''}`} onClick={() => navigate('/posts')} aria-label="inicio">
                    <i className={resultURL === 'posts' ? 'fa-solid fa-house' : 'fa-regular fa-house'}></i>
                </button>
                <button className="nav-item" onClick={() => navigate('/rawgAPI')} aria-label="explorar">
                    <i className="fa-regular fa-compass"></i>
                </button>
                <button className={`nav-item ${resultURL === 'user' ? 'active' : ''}`} onClick={() => navigate('/user')} aria-label="nuevo post">
                    <i className="fa-regular fa-square-plus"></i>
                </button>
                <button className="nav-item" onClick={() => navigate('/rawgAPI')} aria-label="juegos">
                    <i className="fa-solid fa-gamepad"></i>
                </button>
                <button className="nav-item" onClick={() => navigate('/user')} aria-label="perfil">
                    <div className={`nav-av ${resultURL === 'user' ? 'active' : ''}`}>
                        <img src={iconUser} alt="Perfil" />
                    </div>
                </button>
            </nav>
            <div className="footer-desktop">
                <span>© 2025 GGPost</span>
                <span>Todos los derechos reservados</span>
            </div>
        </footer>
    );
};

export default Footer;