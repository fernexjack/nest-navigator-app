// client/src/context/AuthContext.js (EN GÜVENLİ VE TEMİZ HALİ)
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      return;
    }
    try {
      const res = await axios.get('/api/favorites'); // Sadece ID'leri çeker, bu doğru.
      setFavorites(res.data);
    } catch (err) {
      console.error("AuthContext: Favoriler yüklenemedi.", err.response?.data || err);
      setFavorites([]);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchFavorites();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setFavorites([]);
    }
  }, [token, fetchFavorites]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  const toggleFavorite = async (propertyId) => {
    const isFav = favorites.map(String).includes(String(propertyId));
    const originalFavorites = [...favorites]; // Hata durumunda geri dönmek için yedekle

    // Optimistic Update
    if (isFav) {
      setFavorites(prev => prev.filter(id => String(id) !== String(propertyId)));
    } else {
      setFavorites(prev => [...prev, propertyId]);
    }

    // API Call
    try {
      if (isFav) {
        await axios.delete(`/api/favorites/${propertyId}`);
      } else {
        await axios.post('/api/favorites', { propertyId });
      }
    } catch (err) {
      console.error("Favori işlemi başarısız, state geri alınıyor.", err.response?.data || err);
      setFavorites(originalFavorites); // Hata olursa, state'i eski haline döndür
    }
  };
  
  const isFavorited = (propertyId) => favorites.map(String).includes(String(propertyId));

  const contextValue = { token, login, logout, favorites, toggleFavorite, isFavorited };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };