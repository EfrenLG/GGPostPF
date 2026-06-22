// Axios
import axios from 'axios';

const URL_API = import.meta.env.VITE_URL_API;

const api = axios.create({
    baseURL: URL_API,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
    // FIX: withCredentials eliminado — ya no se usan cookies cross-domain.
    // Las cookies httpOnly entre dominios distintos (Vercel <-> Render) se
    // bloquean con protecciones de privacidad (Brave Shields, Safari ITP,
    // uBlock/AdBlock en modo estricto), provocando 401 constantes y un bucle
    // de recargas. Ahora la sesión se gestiona con JWT en localStorage,
    // enviado manualmente como header Authorization.
});

// NUEVO: interceptor de request — añade el token guardado a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de response — limpia sesión y redirige solo si hace falta,
// evitando el bucle de recargas que había antes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthError =
            error.response?.status === 401 ||
            error.response?.data?.error === 'Acceso no autorizado';

        if (isAuthError && window.location.pathname !== '/') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('userIcon');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

const userService = {

    // SERVICE TOKEN CONTROL
    checkToken: () => api.get('/api/verify'),

    // SERVICE USER
    checkUser: (userData) => api.post('/auth/check', userData),
    registerUser: (userData) => api.post('/auth/register', userData),
    emailUser: (userData) => api.post('/email/send-email', userData),
    loginUser: (userData) => api.post('/auth/login', userData),
    getUser: (id) => api.get(`/api/user/${id}`),
    getUsers: () => api.get(`/api/user/all`),
    updateIconUser: (userData) => api.put('/api/user/icon', userData),
    followUser: (targetUserId) => api.post(`/api/user/follow/${targetUserId}`),
    getPublicProfile: (id) => api.get(`/api/user/profile/${id}`),
    getFollowList: (id, type) => api.get(`/api/user/follow-list/${id}`, { params: { type } }),
    togglePrivacy: () => api.put('/api/user/privacy'),
    getFollowRequests: () => api.get('/api/user/follow-requests'),
    acceptFollowRequest: (requesterId) => api.post(`/api/user/follow-requests/${requesterId}/accept`),
    rejectFollowRequest: (requesterId) => api.post(`/api/user/follow-requests/${requesterId}/reject`),
    updateBio: (bio) => api.put('/api/user/bio', { bio }),
    saveIconUser: (formData) => api.post('/api/icon/upload/icon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // SERVICES POSTS
    getPost: (id) => api.get(`/api/post/${id}`),
    getPosts: () => api.get('/api/post/all'),
    viewPost: (idPost) => api.put('/api/post/view', idPost),
    likePost: (dataPost) => api.put('/api/post/like', dataPost),
    editPost: (postData) => api.put('/api/post/edit', postData),
    deletePost: (idPost) => api.delete(`/api/post/delete/${idPost}`),
    newPost: (dataPost) => api.post('/api/post/register', dataPost),
    newImagePost: (formData) => api.post('/api/icon/upload/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // SERVICE OPENAI
    chatWithAI: (message) => api.post('/api/chat', { message }),
};

export default userService;