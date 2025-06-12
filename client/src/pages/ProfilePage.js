// client/src/pages/ProfilePage.js (EMPTYSTATE BİLEŞENİ İLE GÜNCELLENDİ)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Heading, Text, SimpleGrid, Spinner, Center, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import PropertyCard from '../components/PropertyCard';
import EmptyState from '../components/EmptyState'; // Yeni bileşenimizi import ediyoruz
import { FaRegHeart } from 'react-icons/fa'; // EmptyState için bir ikon import ediyoruz

const ProfilePage = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/favorites/details');
        setFavoriteProperties(res.data);
      } catch (err) {
        setError('Favori ilanlar yüklenirken bir hata oluştu. Lütfen tekrar giriş yapmayı deneyin.');
        console.error("ProfilePage Hata:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteDetails();
  }, []);

  if (loading) {
    return (
      <Center height="80vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Hata durumunu da daha şık bir Alert bileşeni ile gösterelim
  if (error) {
    return (
      <Center height="80vh" p={4}>
        <Alert status="error" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px" borderRadius="lg">
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Bir Hata Oluştu!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error}
          </AlertDescription>
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={8}>
      <Heading as="h1" mb={8} textAlign="center">
        Favori İlanlarım
      </Heading>
      {favoriteProperties.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {favoriteProperties.map(property => (
            // PropertyCard'a burada onMouseEnter/Leave göndermiyoruz, bu yüzden hata vermeyecek
            <PropertyCard key={property.property_id} property={property} />
          ))}
        </SimpleGrid>
      ) : (
        // --- DEĞİŞİKLİK: Basit metin yerine yeni EmptyState bileşenini kullanıyoruz ---
        <EmptyState 
          icon={FaRegHeart}
          title="Henüz Favoriniz Yok"
          description="Beğendiğiniz ilanların yanındaki kalp ikonuna tıklayarak onları buraya ekleyebilirsiniz. Hayalinizdeki evi bulmaya başlayın!"
          ctaText="İlanları Keşfet"
          ctaLink="/" // Kullanıcıyı ana sayfaya yönlendiren buton
        />
      )}
    </Box>
  );
};

export default ProfilePage;