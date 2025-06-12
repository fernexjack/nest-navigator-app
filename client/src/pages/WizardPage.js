// client/src/pages/WizardPage.js (YENİ DOSYA)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Center, Heading, Text, Button, VStack, HStack, IconButton, Progress, Slider,
    SliderTrack, SliderFilledTrack, SliderThumb, SimpleGrid, useRadio, useRadioGroup, useToast
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Step bileşenleri (Step1, Step2, Step3) ve PropertyTypeCard bileşeni
// (Bir önceki mesajımdaki uzun koddan bu kısımları buraya kopyalayabilirsiniz veya ben size tekrar vereyim)
// ...
// ... Step1, PropertyTypeCard, Step2, Step3 bileşenlerinin kodları buraya gelecek ...
// ...

// Daha temiz olması için Step bileşenlerini buraya tekrar ekliyorum:
const Step1 = ({ data, setData }) => ( <VStack spacing={6} w="100%"> <Heading size="lg">What's your budget?</Heading> <Text fontSize="2xl" fontWeight="bold" color="teal.500">${parseInt(data.maxPrice || 0).toLocaleString()}</Text> <Slider aria-label='price-slider' min={100000} max={5000000} step={50000} value={Number(data.maxPrice)} onChange={(val) => setData({ ...data, maxPrice: val })} > <SliderTrack><SliderFilledTrack /></SliderTrack> <SliderThumb boxSize={6} /> </Slider> </VStack> );
const PropertyTypeCard = (props) => { const { getInputProps, getRadioProps } = useRadio(props); const input = getInputProps(); const checkbox = getRadioProps(); return ( <Box as='label'> <input {...input} /> <Box {...checkbox} cursor='pointer' borderWidth='2px' borderRadius='md' boxShadow='md' _checked={{ bg: 'teal.600', color: 'white', borderColor: 'teal.600', }} _focus={{ boxShadow: 'outline' }} px={5} py={3} fontWeight="bold" > {props.children} </Box> </Box> ); };
const Step2 = ({ data, setData }) => { const types = ['Any', 'Single Family', 'Condo', 'Townhouse']; const { getRootProps, getRadioProps } = useRadioGroup({ name: 'property_type', defaultValue: data.property_type, onChange: (val) => setData({ ...data, property_type: val }), }); const group = getRootProps(); return ( <VStack spacing={6} w="100%"> <Heading size="lg">What type of home are you looking for?</Heading> <HStack {...group}> {types.map((value) => { const radio = getRadioProps({ value }); return ( <PropertyTypeCard key={value} {...radio}> {value} </PropertyTypeCard> ); })} </HStack> </VStack> ); };
const Step3 = ({ data, setData }) => ( <VStack spacing={6} w="100%"> <Heading size="lg">How big should it be?</Heading> <SimpleGrid columns={2} spacing={10} w="full"> <Box> <Text fontWeight="bold">Min. Bedrooms</Text> <HStack> {[1, 2, 3, 4].map(val => ( <Button key={val} onClick={() => setData({...data, minBeds: val})} colorScheme={data.minBeds === val ? 'teal' : 'gray'} > {val}+ </Button> ))} </HStack> </Box> <Box> <Text fontWeight="bold">Min. Square Meters</Text> <HStack> {['100', '150', '200', '250'].map(val => ( <Button key={val} onClick={() => setData({...data, min_square_meters: val})} colorScheme={data.min_square_meters === val ? 'teal' : 'gray'} > {val} m² </Button> ))} </HStack> </Box> </SimpleGrid> </VStack> );


const WizardPage = () => {
    const [step, setStep] = useState(1);
    const [filters, setFilters] = useState({ maxPrice: '2000000', property_type: 'Any', minBeds: '', min_square_meters: '' });
    const navigate = useNavigate();
    const toast = useToast();
    const totalSteps = 3;

    const nextStep = (e) => { e.preventDefault(); setStep((prev) => Math.min(prev + 1, totalSteps)); };
    const prevStep = (e) => { e.preventDefault(); setStep((prev) => Math.max(prev - 1, 1)); };

    const findHomes = (e) => {
        e.preventDefault();
        if (!filters.maxPrice) {
            toast({ title: "Please set a budget.", status: 'warning', duration: 3000 });
            setStep(1); return;
        }
        const cleanFilters = { ...filters };
        if (cleanFilters.property_type === 'Any') delete cleanFilters.property_type;
        const queryString = new URLSearchParams(cleanFilters).toString();
        navigate(`/properties?${queryString}`);
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 data={filters} setData={setFilters} />;
            case 2: return <Step2 data={filters} setData={setFilters} />;
            case 3: return <Step3 data={filters} setData={setFilters} />;
            default: return <Step1 data={filters} setData={setFilters} />;
        }
    };

    return (
        <Center minH="calc(100vh - 80px)" p={4} bg="gray.50">
            <VStack spacing={8} p={10} bg="white" borderRadius="xl" boxShadow="2xl" w="container.md">
                {renderStep()}
                <VStack w="full" spacing={5}>
                    <Progress value={(step / totalSteps) * 100} size="sm" colorScheme="teal" w="full" borderRadius="md" />
                    <HStack justifyContent="space-between" w="full">
                        <IconButton icon={<FaArrowLeft />} onClick={prevStep} isDisabled={step === 1} aria-label="Previous Step" />
                        {step === totalSteps ? (
                            <Button colorScheme="teal" size="lg" onClick={findHomes}>Find My Home!</Button>
                        ) : (
                            <Button rightIcon={<FaArrowRight />} colorScheme="teal" onClick={nextStep}>Next Step</Button>
                        )}
                    </HStack>
                </VStack>
            </VStack>
        </Center>
    );
};

export default WizardPage;