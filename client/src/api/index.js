// client/src/api/index.js - TAM DOSYA İÇERİĞİ

import axios from 'axios';

// Canlı ortam için Vercel'e ekleyeceğimiz ortam değişkenini (REACT_APP_API_URL) kullanır.
// Eğer o değişken tanımlı değilse (yani yerel makinede çalışıyorsak), localhost'u kullanır.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Axios instance'ını bu dinamik URL ile oluşturur.
const API = axios.create({ baseURL: API_URL });

// Hata ayıklama için her isteğin nereye gittiğini konsola yazdıralım.
API.interceptors.request.use(req => {
    console.log(`API isteği yapılıyor: ${req.method.toUpperCase()} ${req.baseURL}${req.url}`);
    return req;
});

/**
 * Mülkleri, verilen filtrelere göre backend'den çeken fonksiyon.
 * @param {object} filters - Filtreleme kriterlerini içeren nesne. 
 */
export const fetchProperties = (filters) => {
    return API.get('/api/properties', { params: filters });
};

// Mevcut veya gelecekteki diğer API çağrılarınız...
// export const fetchPropertyById = (id) => API.get(`/api/properties/${id}`);
// export const createProperty = (newProperty) => API.post('/api/properties', newProperty);

export default API;