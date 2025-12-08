import axios from 'axios';

const api = axios.create({
    // Usamos la variable de entorno, o un fallback por si acaso
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

// Interceptor para agregar el Token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;