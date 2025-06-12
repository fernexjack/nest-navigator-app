// client/src/pages/HomePage.js - TAM DOSYA İÇERİĞİ

import React, { useState, useEffect, useCallback } from 'react';
import PropertyCard from '../components/PropertyCard.js';
import Map from '../components/Map.js';
import * as api from '../api/index.js';
import { 
    Box, Heading, SimpleGrid, Spinner, Center, Text, Select, Input, Checkbox, Stack,
    VStack, Divider, Slider, SliderTrack, SliderFilledTrack, SliderThumb,
    Grid, Skeleton, SkeletonText
} from '@chakra-ui/react';
import './HomePage.css'; // Yeni CSS dosyasını import ediyoruz

const debounce = (func, delay) => {
    let timeoutId;
    const debouncedFunc = (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
    debouncedFunc.cancel = () => {
        clearTimeout(timeoutId);
    };
    return debouncedFunc;
};

const HomePage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
    const [filters, setFilters] = useState({
        search: '', maxPrice: '2000000', minBeds: '', property_type: 'Any',
        min_square_meters: '', has_pool: false, has_fireplace: false,
    });

    const loadProperties = useCallback(async (currentFilters) => {
        setLoading(true);
        try {
            const cleanFilters = { ...currentFilters };
            if (cleanFilters.property_type === 'Any') delete cleanFilters.property_type;
            if (!cleanFilters.minBeds) delete cleanFilters.minBeds;
            const { data } = await api.fetchProperties(cleanFilters);
            setProperties(data.properties || []);
        } catch (error) {
            console.error("Mülkler çekilirken hata oluştu:", error);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedLoadProperties = useCallback(debounce(loadProperties, 500), [loadProperties]);

    useEffect(() => {
        debouncedLoadProperties(filters);
        return () => { debouncedLoadProperties.cancel(); };
    }, [filters, debouncedLoadProperties]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };
    
    const handleSliderChange = (value) => {
        setFilters(prev => ({ ...prev, maxPrice: value }));
    };

    const renderSkeletons = () => (
        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)", "2xl": "repeat(3, 1fr)" }} gap={6}>
            {Array.from({ length: 6 }).map((_, index) => (
                <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white">
                    <Skeleton height="200px" />
                    <SkeletonText mt="4" noOfLines={4} spacing="4" />
                </Box>
            ))}
        </Grid>
    );

    return (
        <div className="home-page">
            <div className="filter-container">
                <VStack spacing={6} align="stretch">
                    <Heading as="h2" size="md">Find Your Home</Heading>
                    <Input name="search" placeholder="Search by title or address..." value={filters.search} onChange={handleFilterChange} />
                    <Divider />
                    <Box>
                        <Text fontWeight="bold" mb={2}>Max Price: ${parseInt(filters.maxPrice || 0).toLocaleString()}</Text>
                        <Slider aria-label='price-slider' name="maxPrice" min={100000} max={5000000} step={50000} value={Number(filters.maxPrice)} onChangeEnd={handleSliderChange} onChange={val => setFilters(f => ({...f, maxPrice: val}))}>
                            <SliderTrack><SliderFilledTrack /></SliderTrack>
                            <SliderThumb />
                        </Slider>
                    </Box>
                    <SimpleGrid columns={2} spacing={4}>
                        <Select name="minBeds" value={filters.minBeds} onChange={handleFilterChange} placeholder="Min Beds"><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></Select>
                        <Select name="property_type" value={filters.property_type} onChange={handleFilterChange}><option value="Any">Any Type</option><option value="Single Family">Single Family</option><option value="Apartment">Apartment</option><option value="Townhouse">Townhouse</option></Select>
                    </SimpleGrid>
                    <Input name="min_square_meters" placeholder="Min m²" type="number" value={filters.min_square_meters} onChange={handleFilterChange} />
                    <Divider />
                    <Stack spacing={3} direction="column">
                        <Text fontWeight="bold">Features:</Text>
                        <Checkbox name="has_pool" isChecked={filters.has_pool} onChange={handleFilterChange}>Has a Pool</Checkbox>
                        <Checkbox name="has_fireplace" isChecked={filters.has_fireplace} onChange={handleFilterChange}>Has a Fireplace</Checkbox>
                    </Stack>
                </VStack>
            </div>
            <div className="main-content">
                <div className="property-list-container">
                    {loading ? (
                        renderSkeletons()
                    ) : properties.length > 0 ? (
                         <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)", "2xl": "repeat(3, 1fr)" }} gap={6}>
                            {properties.map(property => (
                                <PropertyCard 
                                    key={property.property_id} 
                                    property={property} 
                                    onMouseEnter={() => setHoveredPropertyId(property.property_id)}
                                    onMouseLeave={() => setHoveredPropertyId(null)}
                                />
                            ))}
                        </Grid>
                    ) : (
                        <Center h="100%"><Text>No properties found.</Text></Center>
                    )}
                </div>
                <div className="map-container">
                    {loading ? <Skeleton height="100%" borderRadius="md" /> : <Map properties={properties} hoveredPropertyId={hoveredPropertyId} />}
                </div>
            </div>
        </div>
    );
};

export default HomePage;