// RegisterPage.js - ÖRNEK GÜNCELLEME

import React, { useState } from 'react';
// --- DEĞİŞİKLİK BURADA ---
// axios'u doğrudan import etmek yerine, api/index.js'ten fonksiyonumuzu alıyoruz.
import * as api from '../api/index.js'; 
import { useAuth } from '../context/AuthContext'; // Veya nerede kullanıyorsan
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // const { login } = useAuth(); // Eğer kayıt sonrası otomatik giriş yapıyorsan

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // --- DEĞİŞİKLİK BURADA ---
            // Artık axios.post değil, api.registerUser kullanıyoruz.
            const { data } = await api.registerUser(formData);
            
            // Başarılı kayıt sonrası ne yapıyorsan (örn: login'e yönlendir, otomatik giriş yap)
            // Örnek: login(data.token, data.user);
            navigate('/login');

        } catch (err) {
            console.error("Kayıt hatası:", err);
            // Sunucudan gelen hata mesajını göster
            setError(err.response?.data?.error || 'Bir hata oluştu.');
        }
    };

    // ... formun geri kalanı ve JSX ...
    // ...
};

export default RegisterPage;