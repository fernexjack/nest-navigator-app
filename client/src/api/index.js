// client/src/api/index.js - HATA AYIKLAMA İÇİN GÜNCELLENMİŞ KOD

import axios from 'axios';

// --- BU BÖLÜMÜ DİKKATLİCE KONTROL EDELİM ---
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Tarayıcı konsoluna, hangi değişkenin okunduğunu ve nihai URL'yi yazdıralım.
console.log("--- API Yapılandırması ---");
console.log("process.env.REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
console.log("Nihai API_URL:", API_URL);
console.log("--------------------------");

const API = axios.create({ baseURL: API_URL });

API.interceptors.request.use(req => {
    // Bu log'u da koruyalım
    console.log(`API isteği yapılıyor: ${req.method.toUpperCase()} ${req.baseURL}${req.url}`);
    return req;
});

export const fetchProperties = (filters) => {
    return API.get('/api/properties', { params: filters });
};

// ... diğer export'larınız ...

export default API;