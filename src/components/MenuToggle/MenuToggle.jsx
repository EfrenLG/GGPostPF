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

    const handleNavigate = (path) => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = false; // cierra menú
        }
        navigate(path);
    };

    return (
        <div className="menu-toggle-container">
            <input type="checkbox" id="menu-toggle" hidden ref={checkboxRef} />
            <label htmlFor="menu-toggle" className="menu-button" onClick={handleToggleClick}>☰ Menú</label>
            <label htmlFor="menu-toggle" className="overlay"></label>
            <aside className="side-menu">
                <nav>
                    <ul>
                        <li><a onClick={() => handleNavigate("/post")}>Publicaciones</a></li>
                        <li><a onClick={() => handleNavigate("/rawgAPI")}>Los Mejores Valorados</a></li>
                    </ul>
                </nav>
            </aside>
        </div >
    );
};

export default MenuToggle;