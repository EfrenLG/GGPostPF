import axios from 'axios';

const URL_API = 'https://ggpostb.onrender.com';

const api = axios.create({

    baseURL: URL_API,
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json'
    }
});

const userService = {
    checkUser: () => api.get('/auth/check', userData)
};

export default userService;

export const checkUser = async (username, email) => {

    const userData = {
        "username": username,
        "email": email
    };

    try {
        const response = await fetch('https://ggpostb.onrender.com/auth/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Error en la red");
        };

        const data = await response.json();

        let isValid = true;

        if (data.username === true) {

            document.getElementById('user-mess').textContent = "!Error, este usuario ya existe!";

            isValid = false;
        };


        if (data.email === true) {

            document.getElementById('email-mess').textContent = "!Error, este email ya existe!";

            isValid = false;
        };

        return isValid;

    } catch (error) {
        console.error("Hubo un problema con la solicitud:", error);
    };
};

export const createUser = async (username, email, password) => {

    const userData = {
        'username': username,
        'email': email,
        'password': password
    };

    try {

        const response = await fetch(`https://ggpostb.onrender.com/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Error en la red");
        };

        const data = await response.json();

    } catch (error) {
        console.error("Hubo un problema con la solicitud:", error);
    };
};

export const sendEmail = async (username, email) => {

    const userData = {
        'username': username,
        'email': email
    };

    try {

        const response = await fetch(`https://ggpostb.onrender.com/email/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error("Error en la red");
        };

        const data = await response.json();

        if (data.status === 200) {

            window.location.href = '../index.html';

        };

    } catch (error) {
        console.error("Hubo un problema con la solicitud:", error);
    };
};