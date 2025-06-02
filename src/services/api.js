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
    getUser: (id) => api.get(`/api/user/${id}`),

    //SERVICES POSTS
    getPosts: () => api.get('/api/post/all'),
    viewPost: (idPost) => api.put('/api/post/view', idPost),
    likePost: (dataPost) => api.put('/api/post/like', dataPost),
    editPost: (postData) => api.put('/api/post/edit', postData),
    deletePost: (idPost) => api.delete(`/api/post/delete/${idPost}`),

};

export default userService;