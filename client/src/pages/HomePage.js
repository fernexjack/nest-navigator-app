import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Map from '../components/Map';
import './HomePage.css';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    maxPrice: '',
    minBeds: '',
    searchTerm: '',
    homeOffice: false,
    solarPanels: false,
    smartSecurity: false
  });

  const { token, isFavorited, toggleFavorite } = useContext(AuthContext);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true); setError('');
        const response = await axios.get('/api/properties');
        setProperties(response.data);
      } catch (err) {
        setError('Ev verileri yüklenirken bir hata oluştu.');
        console.error(err);
      } finally { setLoading(false); }
    };
    fetchProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const { maxPrice, minBeds, searchTerm, homeOffice, solarPanels, smartSecurity } = filters;
      
      if (maxPrice && parseFloat(property.price) > parseInt(maxPrice, 10)) return false;
      if (minBeds && property.bedrooms < parseInt(minBeds, 10)) return false;
      if (searchTerm && 
          !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.address.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (homeOffice && !property.has_home_office) return false;
      if (solarPanels && !property.has_solar_panels) return false;
      if (smartSecurity && !property.has_smart_security) return false;
      
      return true;
    });
  }, [properties, filters]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="homepage-layout">
      <div className="filter-section">
        <h1>Explore Properties</h1>
        <div className="filter-container">
            <div className="main-filters">
                <input type="text" name="searchTerm" placeholder="Search..." value={filters.searchTerm} onChange={handleFilterChange} className="filter-input"/>
                <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} className="filter-input"/>
                <select name="minBeds" value={filters.minBeds} onChange={handleFilterChange} className="filter-input">
                    <option value="">Min. Bedrooms</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option>
                </select>
            </div>
            <div className="advanced-filters">
                <label><input type="checkbox" name="homeOffice" checked={filters.homeOffice} onChange={handleFilterChange} /> Home Office</label>
                <label><input type="checkbox" name="solarPanels" checked={filters.solarPanels} onChange={handleFilterChange} /> Solar Panels</label>
                <label><input type="checkbox" name="smartSecurity" checked={filters.smartSecurity} onChange={handleFilterChange} /> Smart Security</label>
            </div>
        </div>
      </div>

      <div className="content-section">
        <div className="property-list-container">
          <div className="property-list">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <Link to={`/property/${property.property_id}`} key={property.property_id} className="property-card-link">
                  <div className="property-card">
                    {token && (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(property.property_id); }} className={`favorite-button ${isFavorited(property.property_id) ? 'favorited' : ''}`}>
                        ♥
                      </button>
                    )}
                    <img src={property.image_url} alt={property.title} className="property-image" />
                    <div className="property-details">
                      <h3>{property.title}</h3>
                      <p className="property-price">${parseFloat(property.price).toLocaleString()}</p>
                      <p className="property-address">{property.address}</p>
                      <p className="property-specs">{property.bedrooms} Bed, {property.bathrooms} Bath</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No properties found matching your criteria.</p>
            )}
          </div>
        </div>
        <div className="map-container">
          <Map properties={filteredProperties} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;