import './MenuToggle.css';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

const MenuToggle = () => {

    const navigate = useNavigate();

    const checkboxRef = useRef(null);

    const handleToggleClick = () => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = !checkboxRef.current.checked;
        }
    };

    return (
    <div>
      <input type="checkbox" id="menu-toggle" hidden ref={checkboxRef} />
            <label for="menu-toggle" class="menu-button" onClick={handleToggleClick}>☰ Menú</label>
            <label for="menu-toggle" class="overlay"></label>
            <aside class="side-menu">
                <nav>
                    <ul>
                        <li><a onClick={() => navigate("/post")}>Publicaciones</a></li>
                        <li><a onClick={() => navigate("/rawgAPI")}>Los Mejores Valorados</a></li>
                    </ul>
                </nav>
            </aside>
        </div >
    );
};

export default MenuToggle;