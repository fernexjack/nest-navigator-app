import React from 'react';
import { Button, HStack } from '@chakra-ui/react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Eğer sadece bir sayfa varsa veya hiç sonuç yoksa, sayfalama çubuğunu göstermeye gerek yok.
    if (totalPages <= 1) {
        return null; 
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Basit bir sayfa numaraları dizisi oluşturma
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <HStack spacing="2" my="8" justify="center" wrap="wrap">
            <Button onClick={handlePrevious} disabled={currentPage === 1}>
                Önceki
            </Button>
            
            {pageNumbers.map(number => (
                <Button
                    key={number}
                    onClick={() => onPageChange(number)}
                    isActive={currentPage === number} // Chakra UI'da aktif butonu vurgular
                    colorScheme={currentPage === number ? 'blue' : 'gray'}
                >
                    {number}
                </Button>
            ))}

            <Button onClick={handleNext} disabled={currentPage === totalPages}>
                Sonraki
            </Button>
        </HStack>
    );
};

export default Pagination;