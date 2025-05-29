import './Container.css';
import { url } from '../../functions/url.js';
import Login from '../../pages/Login/Login.jsx';
import Register from '../../pages/Register/Register.jsx';

const Container = () => {

    let content;
    let lastPart = url();

    switch (lastPart) {
        case '':
        case 'index.html':
            content = <Login />;
            break;
        case 'register.html':
            content = <Register />;
            break;
        default:
            content = <div>Página no encontrada</div>;
    };

    return (
        <>
            {content}
        </>
    );
};

export default Container;