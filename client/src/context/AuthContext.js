import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async () => {
    if (token) {
      try {
        const res = await axios.get('/api/favorites');
        setFavorites(res.data);
      } catch (err) {
        console.error("Favoriler yüklenemedi", err);
        setFavorites([]); // Hata durumunda favorileri boşalt
      }
    } else {
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

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  const toggleFavorite = async (propertyId) => {
    const isFavorited = favorites.includes(propertyId);
    try {
      if (isFavorited) {
        await axios.delete(`/api/favorites/${propertyId}`);
        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        await axios.post('/api/favorites', { propertyId });
        setFavorites(prev => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Favori durumu değiştirilemedi", err);
    }
  };

  const contextValue = {
    token,
    login,
    logout,
    favorites,
    toggleFavorite,
    isFavorited: (propertyId) => favorites.includes(propertyId)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };