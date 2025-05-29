import * as yup from 'yup';

const schema = yup.object({
    username: yup
        .string()
        .required('El campo nombre es requerido.'),
    email: yup
        .string()
        .required('El campo email es requerido.')
        .email('Introduzca un email válido.'),
    password: yup
        .string()
        .required('El campo contraseña es requerido.')
        .min(8, 'Mínimo 8 caracteres.'),
    passwordRepeat: yup
        .string()
        .required('El campo contraseña es requerido.')
        .min(8, 'Mínimo 8 caracteres.')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden.')
});

export default schema;