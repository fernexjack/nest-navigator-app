// client/src/pages/LoginPage.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
// DOĞRU IMPORT'LAR
import { Box, Button, FormControl, FormLabel, Input, Heading, Text, VStack, Alert, Flex, Link } from '@chakra-ui/react';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // login'i AuthContext'ten al

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data.token); // login fonksiyonunu çağır
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex width="full" align="center" justifyContent="center" mt={10}>
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" w="full">
        <VStack spacing={4} align="flex-start" w="full">
          <Heading size="lg">Login to your Account</Heading>
          {error && (
            // AlertIndicator bileşenini kullanalım
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
                <FormLabel>Email Address</FormLabel>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} />
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full" isLoading={loading}>
                Login
              </Button>
            </VStack>
          </form>
          <Text>
            Don't have an account? <Link as={RouterLink} to="/register" color="teal.500" fontWeight="bold">Register here</Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;