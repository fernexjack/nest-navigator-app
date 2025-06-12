// client/src/pages/PropertyDetailPage.js (ANALİZ RAPORU EKLENMİŞ HALİ)

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Heading, Text, Image, Spinner, Alert, SimpleGrid, Tag, Flex, Button, VStack,
  AlertTitle, AlertDescription, Center, Icon, HStack, Divider, Progress // Progress bileşeni eklendi
} from '@chakra-ui/react';
import { 
  FaBed, FaBath, FaHome, FaShieldAlt, FaHeart, FaRegHeart, FaRulerCombined, // FaRulerCombined eklendi
  FaCar, FaFire, FaWater, FaTree, FaWalking, FaBus, FaStar // Yeni analiz ikonları
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Map from '../components/Map';

// Skor rengini belirleyen yardımcı fonksiyon (PropertyCard'daki ile aynı)
const getScoreColor = (score) => {
    if (score > 80) return 'green';
    if (score > 60) return 'blue';
    if (score > 40) return 'yellow';
    return 'red';
};

// Analiz raporu için küçük bir bileşen
const AnalysisItem = ({ icon, color, label, value }) => (
    <HStack justify="space-between" w="full">
        <HStack>
            <Icon as={icon} color={`${color}.500`} />
            <Text>{label}</Text>
        </HStack>
        <Text fontWeight="bold">{value}</Text>
    </HStack>
);

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { token, isFavorited, toggleFavorite } = useContext(AuthContext);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/properties/${id}`);
        // Detay sayfasında skoru göstermek için property'e sahte bir skor ekleyelim
        // Normalde bu skor, arama sonuçlarından gelirdi.
        // Burada, mevcut verilere göre basit bir skor hesaplayabiliriz.
        const prop = response.data;
        if (!prop.ideality_score) {
            let score = 50; // Base score
            if (prop.school_rating > 8) score += 10;
            if (prop.walk_score > 70) score += 15;
            if (prop.year_built > 2020) score += 5;
            prop.ideality_score = Math.min(score, 100);
        }
        setProperty(prop);

      } catch (err) {
        setError('İlan detayları yüklenirken bir hata oluştu veya ilan mevcut değil.');
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [id]);

  // handleFavoriteClick ve yükleme/hata durumları aynı kalıyor
  const handleFavoriteClick = () => { if (!token) { navigate('/login'); return; } toggleFavorite(property.property_id); };
  if (loading) { return ( <Center height="80vh"><Spinner size="xl" /></Center> ); }
  if (error || !property) { return ( <Center height="80vh"><Alert status="error" maxW="800px" mx="auto" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" p={8} borderRadius="md"><AlertTitle fontSize="lg">Hata!</AlertTitle><AlertDescription>{error || 'İlan bulunamadı.'}</AlertDescription><Button as={Link} to="/" mt={4} colorScheme="teal">Ana Sayfaya Dön</Button></Alert></Center> ); }
  
  const score = property.ideality_score || 0;

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
      {/* BAŞLIK VE FAVORİ BUTONU */}
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" mb={4} gap={4}>
        <Box>
          <Heading as="h1" size="xl">{property.title}</Heading>
          <Text color="gray.500" fontSize="lg">{property.address}</Text>
        </Box>
        <Button onClick={handleFavoriteClick} colorScheme={isFavorited(property.property_id) ? 'red' : 'gray'} leftIcon={isFavorited(property.property_id) ? <FaHeart /> : <FaRegHeart />} minW="200px">
          {isFavorited(property.property_id) ? 'Favorilerden Kaldır' : 'Favorilere Ekle'}
        </Button>
      </Flex>

      {/* ANA GÖRSEL */}
      <Image borderRadius="lg" src={property.image_url} alt={property.title} objectFit="cover" w="100%" h={{ base: "300px", md: "500px" }} mb={8} boxShadow="lg" />

      {/* İÇERİK (Detaylar & Sağ Sütun) */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={10}>
        {/* Sol Taraf: Detaylar ve Açıklama */}
        <VStack gridColumn={{ lg: 'span 2' }} align="stretch" spacing={6}>
          <Heading size="lg" borderBottomWidth="2px" borderColor="teal.500" pb={2}>İlan Detayları</Heading>
          <HStack spacing={8} my={2}>
            <Flex align="center"><Icon as={FaBed} w={6} h={6} color="teal.600" mr={2} /> <Text fontSize="xl">{property.bedrooms} Yatak Odası</Text></Flex>
            <Flex align="center"><Icon as={FaBath} w={6} h={6} color="teal.600" mr={2} /> <Text fontSize="xl">{property.bathrooms} Banyo</Text></Flex>
            <Flex align="center"><Icon as={FaRulerCombined} w={6} h={6} color="teal.600" mr={2} /> <Text fontSize="xl">{property.square_meters} m²</Text></Flex>
          </HStack>
          <Text fontSize="4xl" fontWeight="bold" color="teal.600">${parseFloat(property.price).toLocaleString()}</Text>
          <Divider />
          <Heading size="md">Açıklama</Heading>
          <Text color="gray.700" whiteSpace="pre-wrap">{property.description || 'Bu ilan için bir açıklama girilmemiştir.'}</Text>
          <Heading size="md">Yapı Bilgileri</Heading>
          <Text><strong>Yapım Yılı:</strong> {property.year_built || 'Belirtilmemiş'}</Text>
          <Text><strong>Isıtma:</strong> {property.heating_type || 'Belirtilmemiş'}</Text>
          <Text><strong>Otopark:</strong> {property.parking_spots ? `${property.parking_spots} araçlık` : 'Belirtilmemiş'}</Text>
          <Heading size="md">Ekstra Özellikler</Heading>
          <Flex wrap="wrap" gap={3}>
            {property.has_pool && <Tag size="lg" variant="solid" colorScheme="blue"><Icon as={FaWater} mr={2} /> Havuz</Tag>}
            {property.has_fireplace && <Tag size="lg" variant="solid" colorScheme="orange"><Icon as={FaFire} mr={2} /> Şömine</Tag>}
            {property.has_basement && <Tag size="lg" variant="solid" colorScheme="gray"><Icon as={FaHome} mr={2} /> Bodrum</Tag>}
          </Flex>
        </VStack>
        
        {/* Sağ Taraf: Harita ve Analiz Raporu */}
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={4} borderBottomWidth="2px" borderColor="teal.500" pb={2}>Konum</Heading>
            <Box height="300px" borderRadius="md" overflow="hidden" boxShadow="md">
              <Map properties={[property]} />
            </Box>
          </Box>
          
          {/* --- YENİ: ANALİZ RAPORU BÖLÜMÜ --- */}
          <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px">
              <Heading size="lg" mb={4} textAlign="center">Ideal Score: {score}/100</Heading>
              <Progress colorScheme={getScoreColor(score)} size="lg" value={score} borderRadius="md" mb={6} />
              <VStack spacing={4} align="stretch">
                <AnalysisItem icon={FaWalking} color="green" label="Yürüme Mesafesi" value={`${property.walk_score || 'N/A'}/100`} />
                <AnalysisItem icon={FaBus} color="blue" label="Toplu Taşıma" value={`${property.transit_score || 'N/A'}/100`} />
                <AnalysisItem icon={FaStar} color="yellow" label="Okul Puanı" value={`${property.school_rating || 'N/A'}/10`} />
                <AnalysisItem icon={FaShieldAlt} color="red" label="Suç Oranı" value={property.crime_rate_index || 'N/A'} />
              </VStack>
          </Box>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default PropertyDetailPage;