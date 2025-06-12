// client/src/api/index.js   <-- BU YENİ DOSYANIN İÇERİĞİ
import axios from 'axios';

// Backend sunucunuzun adresini tanımlıyoruz. 
// Bu, gelecekte canlıya alırken tek bir yerden değiştirmeyi kolaylaştırır.
const API = axios.create({ baseURL: 'http://localhost:5001' });

/**
 * Mülkleri, verilen filtrelere göre backend'den çeken fonksiyon.
 * @param {object} filters - Filtreleme kriterlerini içeren nesne. 
 * Örn: { maxPrice: 500000, minBeds: 3, search: 'deniz manzaralı' }
 */
export const fetchProperties = (filters) => {
    // Axios'un `params` seçeneği, verdiğimiz nesneyi otomatik olarak 
    // bir URL sorgu dizesine (query string) dönüştürür.
    // Örnek: yukardaki `filters` nesnesi şuna dönüşür:
    // /api/properties?maxPrice=500000&minBeds=3&search=deniz%20manzaral%C4%B1
    
    // Ayrıca, `filters` nesnesindeki değeri olmayan (undefined, null, veya boş string) 
    // anahtarları otomatik olarak URL'e eklemez, bu da tam istediğimiz şey.
    // Bu sayede backend'e sadece dolu olan filtreler gider.
    
    console.log("API'ye gönderilen filtreler:", filters); // Hata ayıklama için

    return API.get('/api/properties', { params: filters });
};

// Gelecekte buraya yeni API çağrıları ekleyebilirsiniz.
// Örnek:
// export const fetchPropertyById = (id) => API.get(`/api/properties/${id}`);
// export const createProperty = (newProperty) => API.post('/api/properties', newProperty);