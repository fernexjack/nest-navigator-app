// client/src/components/EmptyState.js (YENİ DOSYA)

import React from 'react';
import { Box, Center, VStack, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// Bu bileşen, bir başlık, bir açıklama, bir ikon ve opsiyonel bir eylem butonu alır.
const EmptyState = ({ icon, title, description, ctaText, ctaLink }) => {
  return (
    <Center 
        minHeight="50vh" 
        p={8} 
        bg="gray.50" 
        borderRadius="xl"
        borderWidth="2px"
        borderColor="gray.200"
        borderStyle="dashed"
    >
      <VStack spacing={4} textAlign="center">
        <Icon as={icon} boxSize="50px" color="gray.400" />
        <Heading as="h3" size="lg" color="gray.700">
          {title}
        </Heading>
        <Text color="gray.500" maxW="md">
          {description}
        </Text>
        {/* Eğer ctaText ve ctaLink propları verilmişse, butonu göster */}
        {ctaText && ctaLink && (
          <Button 
            as={RouterLink} 
            to={ctaLink} 
            colorScheme="teal" 
            mt={4}
          >
            {ctaText}
          </Button>
        )}
      </VStack>
    </Center>
  );
};

export default EmptyState;