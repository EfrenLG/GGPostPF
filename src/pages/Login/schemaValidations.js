import * as yup from 'yup';

const schema = yup.object({
    username: yup
        .string()
        .required('El nombre es requerido.'),
    password: yup
        .string()
        .required('La contraseña es requerida.')
        .min(8, 'Mínimo 8 caracteres.'),
});

export default schema;