import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate ekledik
import PropertyCard from '../components/PropertyCard.js';
import Map from '../components/Map.js';
import Pagination from '../components/Pagination.js'; // YENİ: Pagination component'ini import et
import * as api from '../api/index.js';
import { Box, Spinner, Center, Text, Heading } from '@chakra-ui/react';
import './HomePage.css';

const ResultsPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

    // YENİ: Sayfalama için state'ler
    const [paginationInfo, setPaginationInfo] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Mevcut filtreleri ve sayfa numarasını URL'den oku
    const { currentPage, filters } = useMemo(() => {
        const query = new URLSearchParams(location.search);
        const page = parseInt(query.get('page'), 10) || 1;
        query.delete('page'); // 'page' parametresini filtre nesnesinden ayır
        const filterEntries = Object.fromEntries(query.entries());
        return { currentPage: page, filters: filterEntries };
    }, [location.search]);

    const loadProperties = useCallback(async (currentFilters, page) => {
        setLoading(true);
        try {
            // API'ye filtrelerle birlikte 'page' parametresini de gönder
            const { data } = await api.fetchProperties({ ...currentFilters, page });
            
            // GÜNCELLEME: Gelen cevabı doğru şekilde işle
            setProperties(data.properties);
            setPaginationInfo(data.pagination);

        } catch (error) {
            console.error("Sonuçlar yüklenirken hata oluştu:", error);
            setProperties([]); // Hata durumunda listeyi boşalt
            setPaginationInfo(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProperties(filters, currentPage);
    }, [filters, currentPage, loadProperties]);

    // YENİ: Sayfa değiştirildiğinde tetiklenecek fonksiyon
    const handlePageChange = (newPage) => {
        const queryParams = new URLSearchParams(filters);
        queryParams.set('page', newPage);
        navigate(`${location.pathname}?${queryParams.toString()}`);
        window.scrollTo(0, 0); // Sayfa değiştiğinde en üste scroll yap
    };

    return (
        <Box p={6}>
            <Heading as="h1" mb={6} textAlign="center">
                Your Ideal Home Results
            </Heading>
            <div className="home-page" style={{ padding: 0, background: 'none' }}>
                <div className="main-content">
                    <div className="property-list">
                        {loading ? (
                            <Center h="100%"><Spinner size="xl" /></Center>
                        ) : properties.length > 0 ? (
                            <>
                                {properties.map(property => (
                                    <PropertyCard 
                                        key={property.property_id} 
                                        property={property} 
                                        onMouseEnter={() => setHoveredPropertyId(property.property_id)}
                                        onMouseLeave={() => setHoveredPropertyId(null)}
                                    />
                                ))}
                            </>
                        ) : (
                            <Center h="100%"><Text fontSize="xl">No properties found matching your criteria.</Text></Center>
                        )}
                    </div>
                    <div className="map-container">
                        {!loading && <Map properties={properties} hoveredPropertyId={hoveredPropertyId} />}
                    </div>
                </div>
                {/* YENİ: Pagination component'ini sayfanın altına ekliyoruz */}
                {!loading && paginationInfo && (
                     <Pagination
                        currentPage={paginationInfo.currentPage}
                        totalPages={paginationInfo.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </Box>
    );
};

export default ResultsPage;