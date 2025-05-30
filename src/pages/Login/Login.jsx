import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schemaValidations';
import './Login.css';
import FormCard from '../../components/FormCard/FormCard'
import { useNavigate } from 'react-router-dom';
import userService from '../../services/api';

const Login = () => {

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {

        try {
            const userData = {
                'username': data.username,
                'password': data.password
            };

            let handleError = false;

            const loginUserR = await userService.loginUser(userData);

            if (loginUserR.data.username === false || loginUserR.data.password === false) {

                setError('password', {
                    type: 'manual',
                    message: 'Datos erróneos.'
                });
                handleError = true;
            };

            if (handleError) return;

            navigate('/post');

        } catch (error) {
            console.error("Error al verificar el usuario:", error);

        };
    };

    return (
        <div className="page-wrapper">

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