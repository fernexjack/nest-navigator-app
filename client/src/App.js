// client/src/App.js (ROTA SIRALAMASI DÜZELTİLDİ)

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Button, Heading, Spacer, Link } from '@chakra-ui/react';

import HomePage from './pages/HomePage';
import WizardPage from './pages/WizardPage'; 
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return <Button colorScheme="teal" variant="outline" onClick={handleLogout}>Logout</Button>;
}

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Box>
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
          <Flex align="center" mr={5}>
            <Heading as="h1" size="lg" letterSpacing={"tighter"}>
              <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>Nest Navigator</Link>
            </Heading>
          </Flex>
          <Spacer />
          <Box>
            <Link as={RouterLink} to="/" p={3} _hover={{ bg: "teal.600", borderRadius: "md" }}>Home</Link>
            <Link as={RouterLink} to="/wizard" p={3} _hover={{ bg: "teal.600", borderRadius: "md" }}>Home Finder Wizard</Link>
            
            {token ? (
              <>
                <Button as={RouterLink} to="/add-property" colorScheme="yellow" ml={4} mr={4} size="sm">
                  + Add Property
                </Button>
                <Link as={RouterLink} to="/profile" p={3} _hover={{ bg: "teal.600", borderRadius: "md" }}>Profile</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link as={RouterLink} to="/login" p={3} _hover={{ bg: "teal.600", borderRadius: "md" }}>Login</Link>
                <Button as={RouterLink} to="/register" colorScheme="whiteAlpha" variant="outline">Register</Button>
              </>
            )}
          </Box>
        </Flex>

        <Box>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wizard" element={<WizardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* --- DEĞİŞİKLİK BURADA: Spesifik yol, dinamik yoldan önce gelmeli --- */}
            <Route path="/properties" element={<ResultsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/add-property" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;