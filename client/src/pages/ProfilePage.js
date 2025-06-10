import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Box, Heading, Text, SimpleGrid, Image, VStack } from '@chakra-ui/react';
import './HomePage.css'; // Kart stilleri için hala kullanabiliriz

const ProfilePage = () => {
  const { favorites } = useContext(AuthContext);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const res = await axios.get('/api/properties');
        setAllProperties(res.data);
      } catch (err) {
        setError('İlanlar yüklenirken bir hata oluştu.');
        console.error("ProfilePage Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProperties();
  }, []);

  const favoriteProperties = allProperties.filter(property => 
    favorites.includes(property.property_id)
  );

  if (loading) return <Text>Yükleniyor...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box p={5}>
      <Heading mb={6}>Favori İlanlarım</Heading>
      {favoriteProperties.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {favoriteProperties.map(property => (
            <Link to={`/property/${property.property_id}`} key={property.property_id}>
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md">
                <Image src={property.image_url} alt={property.title} />
                <Box p="6">
                  <VStack align="start">
                    <Heading size="md">{property.title}</Heading>
                    <Text fontWeight="bold" fontSize="xl">${parseFloat(property.price).toLocaleString()}</Text>
                    <Text>{property.address}</Text>
                  </VStack>
                </Box>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      ) : (
        <Text>Henüz favori ilanınız bulunmamaktadır.</Text>
      )}
    </Box>
  );
};

export default ProfilePage;