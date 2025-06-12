// client/src/api/index.js - YENİ AUTH FONKSİYONLARI EKLENDİ

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const API = axios.create({ baseURL: API_URL });

// Hata ayıklama için interceptor
API.interceptors.request.use(req => {
    console.log(`API isteği yapılıyor: ${req.method.toUpperCase()} ${req.baseURL}${req.url}`);
    return req;
});

// --- İLAN FONKSİYONLARI ---
export const fetchProperties = (filters) => API.get('/api/properties', { params: filters });

// --- YENİ: KİMLİK DOĞRULAMA (AUTH) FONKSİYONLARI ---
export const registerUser = (userData) => API.post('/api/auth/register', userData);
export const loginUser = (userData) => API.post('/api/auth/login', userData);

// ...gelecekteki diğer fonksiyonlar...

export default API;