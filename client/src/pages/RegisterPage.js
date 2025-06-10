// client/src/pages/RegisterPage.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// DOĞRU IMPORT'LAR
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Alert, Text, Flex, Link } from '@chakra-ui/react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', formData);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex width="full" align="center" justifyContent="center" mt={10}>
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" w="full">
        <VStack spacing={4} align="flex-start" w="full">
          <Heading size="lg">Create an Account</Heading>
          {error && (
            <Alert status="error" borderRadius="md">
               <VStack align="start">
                <Text fontWeight="bold">Error</Text>
                <Text>{error}</Text>
              </VStack>
            </Alert>
          )}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input type="text" name="name" value={formData.name} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} />
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full" isLoading={loading}>
                Register
              </Button>
            </VStack>
          </form>
          <Text>
            Already have an account? <Link as={RouterLink} to="/login" color="teal.500" fontWeight="bold">Login here</Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;