import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en la API:', error);
        return Promise.reject(error);
    }
);

export default api;
