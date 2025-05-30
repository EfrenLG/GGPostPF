import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schemaValidations';
import './Register.css';
import FormCard from '../../components/FormCard/FormCard'
import ChargeCard from '../../components/ChargeCard/ChargeCard'
import userService from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        const userData = {
            'username': data.username,
            'email': data.email
        };
        try {
            const checkUserR = await userService.checkUser(userData);
            let hasError = false;

            if (checkUserR.data.username === true) {
                setError('username', {
                    type: 'manual',
                    message: 'El usuario ya está en uso.'
                });
                hasError = true;
            };

            if (checkUserR.data.email === true) {
                setError('email', {
                    type: 'manual',
                    message: 'El email ya está en uso.'
                });
                hasError = true;
            };

            if (hasError) return;

            <ChargeCard
                text='Usuario creado'
            />

            const registerData = {
                'username': data.username,
                'email': data.email,
                'password': data.password
            };

            const registerUserR = await userService.registerUser(registerData);

            const emailData = {
                'email': data.email
            };

            if (registerUserR) { const emailUserR = await userService.emailUser(emailData) }

        } catch (error) {
            console.error("Error al verificar el usuario:", error);

        };

    };

    return (
        <div className="page-wrapper">

            <FormCard
                title='Registro'
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                password={password}
                setPassword={setPassword}
                fields={[
                    { name: 'username', label: 'Usuario:', type: 'text', placeholder: 'Introduzca su usuario...' },
                    { name: 'email', label: 'Email:', type: 'email', placeholder: 'Introduzca su email...' },
                    { name: 'password', label: 'Contraseña:', type: 'password', placeholder: 'Introduzca su contraseña...' },
                    { name: 'passwordRepeat', label: 'Repita la contraseña:', type: 'password', placeholder: 'Repita la contraseña...' },
                ]}
                buttons={
                    <button type="button" className="btn-back" onClick={() => navigate('/')}>
                        Atrás
                    </button>
                }
            />
        </div>
    );
};

export default Register;