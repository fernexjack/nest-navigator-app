// server/data/mockProperties.js

const properties = [
  {
    id: 'prop1',
    title: 'Modern Aile Evi',
    price: 750000,
    address: '123 Maple St, Austin, TX',
    bedrooms: 4,
    bathrooms: 3,
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Ev Ofisi', 'Güneş Panelleri', 'Açık Konsept'],
    coordinates: [30.2672, -97.7431],
    // --- YENİ DETAYLI ÖZELLİKLER ---
    hasHomeOffice: true,
    hasSolarPanels: true,
    hasSmartSecurity: false,
    isOpenConcept: true
  },
  {
    id: 'prop2',
    title: 'Şehir Merkezi Dairesi',
    price: 450000,
    address: '456 Oak Ave, San Francisco, CA',
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Akıllı Güvenlik', 'Yürünebilirlik Puanı Yüksek'],
    coordinates: [37.7749, -122.4194],
    // --- YENİ DETAYLI ÖZELLİKLER ---
    hasHomeOffice: false,
    hasSolarPanels: false,
    hasSmartSecurity: true,
    isOpenConcept: false
  },
  {
    id: 'prop3',
    title: 'Geniş Bahçeli Villa',
    price: 1200000,
    address: '789 Pine Ln, Miami, FL',
    bedrooms: 5,
    bathrooms: 4.5,
    imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Havuz', 'Açık Mutfak', 'Üç Araçlık Garaj'],
    coordinates: [25.7617, -80.1918],
    // --- YENİ DETAYLI ÖZELLİKLER ---
    hasHomeOffice: true,
    hasSolarPanels: false,
    hasSmartSecurity: true,
    isOpenConcept: true
  },
  {
    id: 'prop4',
    title: 'Sürdürülebilir Tasarım Harikası',
    price: 950000,
    address: '101 Birch Rd, Portland, OR',
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    features: ['Güneş Panelleri', 'Energy Star Cihazlar', 'İyi Yalıtım'],
    coordinates: [45.5051, -122.6750],
    // --- YENİ DETAYLI ÖZELLİKLER ---
    hasHomeOffice: false,
    hasSolarPanels: true,
    hasSmartSecurity: false,
    isOpenConcept: false
  }
];

module.exports = properties;