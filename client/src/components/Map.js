// client/src/components/Map.js (ETKİLEŞİMLİ VURGULAMA ÖZELLİĞİ EKLENDİ)

import React, { useEffect, useRef } from 'react'; // useRef eklendi
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
// --- YENİ: Vurgulanan ikon için farklı bir resim veya renk kullanabiliriz.
// Şimdilik aynı ikonu kullanıp CSS ile büyüteceğiz, ama farklı bir resim için yol:
// import highlightedIconUrl from './path/to/highlighted-icon.png'; 
import 'leaflet/dist/leaflet.css';

// Standart ikon tanımı
const defaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: iconShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- YENİ: Vurgulanmış (highlighted) ikon tanımı ---
// Daha büyük ve dikkat çekici bir ikon
const highlightedIcon = L.icon({
    iconUrl: iconUrl, // Aynı ikonu kullanıyoruz
    shadowUrl: iconShadowUrl,
    iconSize: [38, 55], // Daha büyük boyut
    iconAnchor: [19, 55], // Yeni boyuta göre ayarlanmış çapa
    popupAnchor: [1, -44],
    shadowSize: [55, 55],
    // className: 'blinking-marker' // İstersek CSS ile animasyon ekleyebiliriz
});


// DEĞİŞİKLİK: Bu genel atamayı kaldırıyoruz, çünkü her marker için özel ikon seçeceğiz.
// L.Marker.prototype.options.icon = DefaultIcon; 

// --- DEĞİŞİKLİK: hoveredPropertyId prop'unu kabul ediyoruz ---
const Map = ({ properties, hoveredPropertyId }) => {
  const mapRef = useRef(null); // Haritaya referans almak için

  const defaultPosition = [39.8283, -98.5795];
  const defaultZoom = 4;

  const mapCenter = properties?.length > 0 && properties[0].latitude && properties[0].longitude
    ? [properties[0].latitude, properties[0].longitude]
    : defaultPosition;

  const mapZoom = properties?.length > 0 ? (properties.length === 1 ? 13 : defaultZoom) : defaultZoom;

  // Haritanın, yeni bir ilan listesi geldiğinde kendini yeniden boyutlandırmasını ve merkezlemesini sağlayan useEffect
  useEffect(() => {
    if (mapRef.current && properties?.length > 0) {
      const validCoords = properties.filter(p => p.latitude && p.longitude);
      if (validCoords.length > 0) {
        const bounds = L.latLngBounds(validCoords.map(p => [p.latitude, p.longitude]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [properties]); // Sadece `properties` listesi değiştiğinde çalışır.


  return (
    <MapContainer 
      center={mapCenter} 
      zoom={mapZoom} 
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef} // Haritaya referansı bağlıyoruz
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {properties.filter(p => p.latitude && p.longitude).map(property => {
        // --- DEĞİŞİKLİK: Vurgulanmış mı diye kontrol ediyoruz ---
        const isHighlighted = property.property_id === hoveredPropertyId;

        return (
          <Marker 
            key={property.property_id} 
            position={[property.latitude, property.longitude]}
            // --- DEĞİŞİKLİK: Duruma göre doğru ikonu seçiyoruz ---
            icon={isHighlighted ? highlightedIcon : defaultIcon}
            // --- DEĞİŞİKLİK: Vurgulanan marker'ın diğerlerinin üzerinde olmasını sağlıyoruz ---
            zIndexOffset={isHighlighted ? 1000 : 0}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <h5 style={{ fontWeight: 'bold', margin: '5px 0' }}>{property.title}</h5>
                <p style={{ margin: '5px 0' }}>${parseFloat(property.price).toLocaleString()}</p>
                <Link to={`/property/${property.property_id}`} style={{ color: '#319795', fontWeight: 'bold' }}>
                  Detayları Gör
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  );
};

export default Map;