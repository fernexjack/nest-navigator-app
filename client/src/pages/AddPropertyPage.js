// client/src/pages/AddPropertyPage.js (TÜM JSX HATALARI DÜZELTİLMİŞ HALİ)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Heading, FormControl, FormLabel, Input, Textarea, Select, NumberInput, NumberInputField,
  Checkbox, Button, VStack, HStack, SimpleGrid, useToast, Text
} from '@chakra-ui/react';

const AddPropertyPage = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', address: '', city: '', state: '', zip_code: '',
    latitude: '', longitude: '', image_url: '', property_type: 'Single Family', bedrooms: '',
    bathrooms: '', square_meters: '', year_built: '', heating_type: 'Central', cooling_type: 'Central Air',
    parking_spots: '', stories: '', has_basement: false, has_fireplace: false, has_pool: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNumberChange = (name, valueAsString) => {
    setFormData(prev => ({ ...prev, [name]: valueAsString }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/properties', formData);
      toast({
        title: 'İlan Başarıyla Eklendi!',
        description: `"${response.data.title}" ilanı oluşturuldu.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/property/${response.data.property_id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      toast({
        title: 'Ekleme Başarısız',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} maxW="1000px" mx="auto">
      <Heading as="h1" mb={8}>Add a New Property</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isRequired><FormLabel>Title</FormLabel><Input name="title" value={formData.title} onChange={handleChange} /></FormControl>
            <FormControl isRequired><FormLabel>Price ($)</FormLabel>
              <NumberInput min={0} value={formData.price} onChange={(val) => handleNumberChange('price', val)}>
                <NumberInputField name="price" />
              </NumberInput>
            </FormControl>
          </SimpleGrid>

          <FormControl><FormLabel>Image URL</FormLabel><Input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" /></FormControl>
          <FormControl><FormLabel>Description</FormLabel><Textarea name="description" value={formData.description} onChange={handleChange} /></FormControl>
          
          <Heading size="md" pt={4}>Location Details</Heading>
          <FormControl><FormLabel>Address</FormLabel><Input name="address" value={formData.address} onChange={handleChange} /></FormControl>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <FormControl><FormLabel>City</FormLabel><Input name="city" value={formData.city} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>State</FormLabel><Input name="state" value={formData.state} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Zip Code</FormLabel><Input name="zip_code" value={formData.zip_code} onChange={handleChange} /></FormControl>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl><FormLabel>Latitude</FormLabel><Input name="latitude" value={formData.latitude} onChange={handleChange} /></FormControl>
            <FormControl><FormLabel>Longitude</FormLabel><Input name="longitude" value={formData.longitude} onChange={handleChange} /></FormControl>
          </SimpleGrid>

          <Heading size="md" pt={4}>Property Details</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <FormControl isRequired><FormLabel>Property Type</FormLabel><Select name="property_type" value={formData.property_type} onChange={handleChange}><option>Single Family</option><option>Condo</option><option>Townhouse</option></Select></FormControl>
            <FormControl isRequired><FormLabel>Bedrooms</FormLabel>
              <NumberInput min={0} value={formData.bedrooms} onChange={(val) => handleNumberChange('bedrooms', val)}>
                <NumberInputField name="bedrooms" />
              </NumberInput>
            </FormControl>
            <FormControl isRequired><FormLabel>Bathrooms</FormLabel>
              <NumberInput min={0} step={0.5} value={formData.bathrooms} onChange={(val) => handleNumberChange('bathrooms', val)}>
                <NumberInputField name="bathrooms" />
              </NumberInput>
            </FormControl>
            <FormControl isRequired><FormLabel>Square Meters (m²)</FormLabel>
              <NumberInput min={0} value={formData.square_meters} onChange={(val) => handleNumberChange('square_meters', val)}>
                <NumberInputField name="square_meters" />
              </NumberInput>
            </FormControl>
            <FormControl><FormLabel>Year Built</FormLabel>
              <NumberInput min={1800} max={new Date().getFullYear()} value={formData.year_built} onChange={(val) => handleNumberChange('year_built', val)}>
                <NumberInputField name="year_built" />
              </NumberInput>
            </FormControl>
            <FormControl><FormLabel>Parking Spots</FormLabel>
              <NumberInput min={0} value={formData.parking_spots} onChange={(val) => handleNumberChange('parking_spots', val)}>
                <NumberInputField name="parking_spots" />
              </NumberInput>
            </FormControl>
          </SimpleGrid>
          
          <HStack spacing={10} pt={4}>
            <Text fontWeight="bold">Features:</Text>
            <Checkbox name="has_pool" isChecked={formData.has_pool} onChange={handleChange}>Pool</Checkbox>
            <Checkbox name="has_fireplace" isChecked={formData.has_fireplace} onChange={handleChange}>Fireplace</Checkbox>
            <Checkbox name="has_basement" isChecked={formData.has_basement} onChange={handleChange}>Basement</Checkbox>
          </HStack>

          <Button type="submit" colorScheme="teal" size="lg" mt={6} isLoading={loading}>
            Create Property Listing
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddPropertyPage;