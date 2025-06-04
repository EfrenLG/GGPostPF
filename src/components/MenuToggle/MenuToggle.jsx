// Navegación
import { useNavigate } from 'react-router-dom';

// Estilos
import './MenuToggle.css';

const MenuToggle = () => {

    const navigate = useNavigate();

    return (
        <div className='menu-container'>
            <input type="checkbox" id="menu-toggle" hidden />
            <label htmlFor="menu-toggle" className="menu-button">☰ Menú</label>
            <label htmlFor="menu-toggle" className="overlay"></label>
            <aside className="side-menu">
                <nav>
                    <ul>
                        <li><a onClick={() => navigate("/post")}>Publicaciones</a></li>
                        <li><a onClick={() => navigate("/rawgAPI")}>Los Mejores Valorados</a></li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
};

export default MenuToggle;