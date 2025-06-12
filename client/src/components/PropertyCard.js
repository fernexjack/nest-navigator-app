import React from 'react';
import { Box, Image, Text, Badge, Flex, Grid, GridItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const PropertyCard = ({ property, onMouseEnter, onMouseLeave }) => {
    if (!property) return null;

    return (
        <MotionBox
            as={Link}
            to={`/properties/${property.property_id}`}
            display="flex"
            flexDirection="column"
            h="100%"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            _hover={{ textDecoration: 'none' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03, boxShadow: 'xl' }}
        >
            <Box position="relative">
                <Image src={property.image_url || 'https://via.placeholder.com/400x250'} alt={property.title} objectFit="cover" h="200px" w="100%" />
                <Badge
                    position="absolute"
                    top="2"
                    right="2"
                    colorScheme={property.ideality_score > 75 ? 'green' : property.ideality_score > 50 ? 'yellow' : 'red'}
                    fontSize="sm"
                    p={2}
                    borderRadius="md"
                    boxShadow="md"
                >
                    SCORE: {property.ideality_score}
                </Badge>
            </Box>

            <Flex direction="column" p={4} flex="1">
                <Box flex="1">
                    <Text fontWeight="bold" fontSize="lg" isTruncated>{property.title}</Text>
                    <Text fontSize="sm" color="gray.600" isTruncated>{property.address}, {property.city}</Text>
                </Box>
                
                <Box mt={4}>
                    <Text fontWeight="bold" fontSize="xl" color="blue.600" mb={3}>
                        ${new Intl.NumberFormat('en-US').format(property.price)}
                    </Text>
                    
                    {/* --- KESİN ÇÖZÜM: Grid kullanarak hizalama --- */}
                    <Grid templateColumns="repeat(3, 1fr)" gap={2} alignItems="center" fontSize="sm" color="gray.600">
                        <GridItem as={Flex} align="center">
                            <FaBed style={{ marginRight: '4px', flexShrink: 0 }} />
                            <Text as="span" isTruncated>{property.bedrooms} beds</Text>
                        </GridItem>
                        <GridItem as={Flex} align="center">
                            <FaBath style={{ marginRight: '4px', flexShrink: 0 }} />
                            <Text as="span" isTruncated>{property.bathrooms} baths</Text>
                        </GridItem>
                        <GridItem as={Flex} align="center">
                            <FaRulerCombined style={{ marginRight: '4px', flexShrink: 0 }} />
                            <Text as="span" isTruncated>{property.square_meters} m²</Text>
                        </GridItem>
                    </Grid>
                </Box>
            </Flex>
        </MotionBox>
    );
};

export default PropertyCard;