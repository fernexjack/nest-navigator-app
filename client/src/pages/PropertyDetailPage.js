// client/src/pages/PropertyDetailPage.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// DÜZELTİLMİŞ IMPORT SATIRI
import {
  Box,
  Heading,
  Text,
  Image,
  Spinner,
  Alert,
  SimpleGrid,
  Tag,
  Flex,
  Button,
  VStack,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { AuthContext } from '../context/AuthContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { token, isFavorited, toggleFavorite } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        setError('İlan detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  // Chakra'nın Spinner bileşenini kullanalım
  if (loading) {
    return (
      <Flex justify="center" align="center" height="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // DÜZELTİLMİŞ HATA GÖSTERİMİ
  if (error) {
    return (
      <Alert status="error" mt={10} maxW="800px" mx="auto">
        <VStack>
          <AlertTitle>Hata!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </VStack>
      </Alert>
    );
  }
  
  if (!property) {
     return (
      <Alert status="info" mt={10} maxW="800px" mx="auto">
        <VStack>
          <AlertTitle>Bilgi</AlertTitle>
          <AlertDescription>İlan bulunamadı.</AlertDescription>
        </VStack>
      </Alert>
    );
  }


  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h1" size="xl">{property.title}</Heading>
        {token && (
          <Button
            onClick={() => toggleFavorite(property.property_id)}
            colorScheme={isFavorited(property.property_id) ? 'red' : 'gray'}
          >
            {isFavorited(property.property_id) ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
          </Button>
        )}
      </Flex>
      <Image borderRadius="md" src={property.image_url} alt={property.title} objectFit="cover" w="100%" h={{ base: "300px", md: "500px" }} mb={6} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Box>
          <Heading size="lg" mb={4}>Detaylar</Heading>
          <Text fontSize="3xl" fontWeight="bold" color="teal.600" mb={4}>${parseFloat(property.price).toLocaleString()}</Text>
          <Text mb={2}><strong>Adres:</strong> {property.address}</Text>
          <Text mb={2}><strong>Yatak Odası:</strong> {property.bedrooms}</Text>
          <Text mb={4}><strong>Banyo:</strong> {property.bathrooms}</Text>
        </Box>
        <Box>
          <Heading size="lg" mb={4}>Özellikler</Heading>
          <Flex wrap="wrap" gap={2}>
            {property.features && property.features.map(feature => (
              <Tag key={feature} size="lg" variant="subtle" colorScheme="cyan">
                {feature}
              </Tag>
            ))}
          </Flex>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default PropertyDetailPage;