import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from './schemaValidations';
import './Login.css';
import FormCard from '../../components/FormCard/FormCard'

const Login = () => {

    const [password, setPassword] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => console.log(data.username);

    return (
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
                <button type="button" className="btn-back" onClick={() => window.location.href = './register.html'}>
                    Registrarse
                </button>
            }
        />
    );
};

export default Login;