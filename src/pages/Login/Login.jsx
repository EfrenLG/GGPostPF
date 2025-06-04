// React y hooks
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// Navegación
import { useNavigate } from 'react-router-dom';

// Validación
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schemaValidations';

// Estilos
import './Login.css';

// Componentes
import ChargeCard from '../../components/ChargeCard/ChargeCard';
import FormCard from '../../components/FormCard/FormCard';

// Servicios
import userService from '../../services/api';

const Login = () => {

    const [password, setPassword] = useState('');
    const [showCard, setShowCard] = useState(false);

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {

        try {
            const userData = {
                'username': data.username.trim().toLowerCase(),
                'password': data.password
            };

            const loginUserR = await userService.loginUser(userData);

            setShowCard(true);

            localStorage.setItem('userId', loginUserR.data.user.id);
            localStorage.setItem('username', loginUserR.data.user.username);
            localStorage.setItem('userIcon', loginUserR.data.user.icon);

            navigate('/post');

        } catch (error) {
            console.error("Error al verificar el usuario:", error);

            if (error.response?.status === 401 && error.response.data?.error === 'Credenciales inválidas') {

                setError('password', {
                    type: 'manual',
                    message: 'Credenciales inválidas.'
                });
            };
        };
    };

    return (
        <div className="page-wrapper">

            {showCard && <ChargeCard text='✅ Sesión iniciada' />}

            <FormCard
                title='Iniciar sesión'
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                password={password}
                setPassword={setPassword}
                fields={[
                    { name: 'username', label: 'Usuario:', type: 'text', placeholder: 'Introduzca su nombre...' },
                    { name: 'password', label: 'Contraseña:', type: 'password', placeholder: 'Introduzca su contraseña...' }
                ]}
                buttons={
                    <button type="button" className="btn-back" onClick={() => navigate('/register')}>
                        Registrarse
                    </button>
                }
            />
        </div>
    );
};

export default Login;