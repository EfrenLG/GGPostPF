import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schemaValidations';
import './Register.css';
import FormCard from '../../components/FormCard/FormCard'
import userService from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        const userData = {
            "username": data.username,
            "email": data.email
        };
        const checkUserR = await userService.checkUser(userData);
        console.log(checkUserR);
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