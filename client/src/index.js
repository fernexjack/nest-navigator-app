// client/src/index.js - TAMAMEN TEMİZLENMİŞ VE DOĞRU İÇERİK

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Kendi global CSS dosyanız
import App from './App'; // Ana App componentiniz
import { AuthProvider } from './context/AuthContext'; // AuthContext'iniz
import { ChakraProvider } from '@chakra-ui/react'; // Chakra UI

// Not: API ayarlarını artık client/src/api/index.js dosyasında yaptığımız için
// burada axios ile ilgili bir kod olmasına gerek yok.
// Eğer o dosyayı sildiyseniz ve ayarı burada yapmak istiyorsanız,
// bir önceki cevaplarımdaki gibi axios ayarını buraya ekleyebilirsiniz.
// Şimdilik en temiz haliyle bırakıyoruz.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);