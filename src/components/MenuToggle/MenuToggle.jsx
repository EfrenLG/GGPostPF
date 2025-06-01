import './MenuToggle.css';
import { useNavigate } from 'react-router-dom';

const MenuToggle = () => {

    const navigate = useNavigate();

    return (
        <div>
            <input type="checkbox" id="menu-toggle" hidden />
            <label for="menu-toggle" class="menu-button">☰ Menú</label>
            <label for="menu-toggle" class="overlay"></label>
            <aside class="side-menu">
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