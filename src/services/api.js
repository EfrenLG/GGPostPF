import axios from 'axios';

const URL_API = 'https://ggpostb.onrender.com';

const api = axios.create({

    baseURL: URL_API,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }, 
    withCredentials: true

});

const userService = {
    checkUser: (userData) => api.post('/auth/check', userData),
    registerUser: (userData) => api.post('/auth/register', userData),
    emailUser: (userData) => api.post('/email/send-email', userData),
    loginUser: (userData) => api.post('/auth/login', userData),
    getUser: (userData) => api.post('/auth/check', userData),
};

export default userService;