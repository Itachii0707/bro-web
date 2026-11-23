// Ride fare data for Indian cities
export const CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow',
];

export const RIDE_TYPES = [
  { id: 'bike', label: 'Bike Taxi', icon: '🏍️', desc: 'Solo ride, fastest for traffic' },
  { id: 'auto', label: 'Auto Rickshaw', icon: '🛺', desc: 'Up to 3 people, economical' },
  { id: 'mini', label: 'Mini Cab', icon: '🚗', desc: 'Small car, solo or couple' },
  { id: 'sedan', label: 'Sedan / Go', icon: '🚙', desc: '4 people, comfortable' },
  { id: 'suv', label: 'SUV / XL', icon: '🚐', desc: '5-6 people, big luggage' },
  { id: 'prime', label: 'Prime / Select', icon: '⭐', desc: 'Premium car, top comfort' },
  { id: 'electric', label: 'Electric', icon: '⚡', desc: 'Eco-friendly, often cheapest' },
  { id: 'intercity', label: 'Intercity', icon: '🛣️', desc: 'City to city travel' },
];

// Base fare rates per km per city (approximate 2024 rates in INR)
const BASE_RATES = {
  Bangalore:   { bike: 5,  auto: 7,  mini: 9,  sedan: 11, suv: 14, prime: 16, electric: 8, intercity: 12 },
  Mumbai:      { bike: 6,  auto: 8,  mini: 10, sedan: 12, suv: 15, prime: 18, electric: 9, intercity: 13 },
  Delhi:       { bike: 5,  auto: 7,  mini: 9,  sedan: 11, suv: 14, prime: 16, electric: 8, intercity: 11 },
  Hyderabad:   { bike: 5,  auto: 7,  mini: 9,  sedan: 10, suv: 13, prime: 15, electric: 8, intercity: 11 },
  Chennai:     { bike: 5,  auto: 8,  mini: 10, sedan: 11, suv: 14, prime: 16, electric: 9, intercity: 12 },
  Pune:        { bike: 5,  auto: 7,  mini: 9,  sedan: 10, suv: 13, prime: 15, electric: 8, intercity: 11 },
  Kolkata:     { bike: 4,  auto: 6,  mini: 8,  sedan: 10, suv: 12, prime: 14, electric: 7, intercity: 10 },
  Ahmedabad:   { bike: 4,  auto: 6,  mini: 8,  sedan: 10, suv: 12, prime: 14, electric: 7, intercity: 10 },
  Jaipur:      { bike: 4,  auto: 6,  mini: 8,  sedan: 9,  suv: 11, prime: 13, electric: 7, intercity: 10 },
  Lucknow:     { bike: 4,  auto: 6,  mini: 8,  sedan: 9,  suv: 11, prime: 13, electric: 7, intercity: 10 },
};

// Minimum fares per city per ride type
const MIN_FARES = {
  Bangalore:   { bike: 25, auto: 35, mini: 50, sedan: 60, suv: 80, prime: 100, electric: 40, intercity: 500 },
  Mumbai:      { bike: 30, auto: 40, mini: 55, sedan: 70, suv: 90, prime: 110, electric: 45, intercity: 600 },
  Delhi:       { bike: 25, auto: 35, mini: 50, sedan: 60, suv: 80, prime: 100, electric: 40, intercity: 500 },
  Hyderabad:   { bike: 25, auto: 35, mini: 50, sedan: 55, suv: 75, prime: 95,  electric: 40, intercity: 500 },
  Chennai:     { bike: 25, auto: 40, mini: 55, sedan: 60, suv: 80, prime: 100, electric: 45, intercity: 500 },
  Pune:        { bike: 25, auto: 35, mini: 50, sedan: 55, suv: 75, prime: 95,  electric: 40, intercity: 450 },
  Kolkata:     { bike: 20, auto: 30, mini: 45, sedan: 55, suv: 70, prime: 90,  electric: 35, intercity: 400 },
  Ahmedabad:   { bike: 20, auto: 30, mini: 45, sedan: 55, suv: 70, prime: 90,  electric: 35, intercity: 400 },
  Jaipur:      { bike: 20, auto: 30, mini: 45, sedan: 50, suv: 65, prime: 85,  electric: 35, intercity: 380 },
  Lucknow:     { bike: 20, auto: 30, mini: 45, sedan: 50, suv: 65, prime: 85,  electric: 35, intercity: 380 },
};

// Platform availability per city
export const PLATFORMS = {
  uber: {
    name: 'Uber',
    color: '#000000',
    bgColor: '#f5f5f5',
    textColor: '#000',
    logo: 'U',
    multiplier: 1.0,
    availability: ['bike', 'mini', 'sedan', 'suv', 'prime', 'electric', 'intercity'],
    deeplink: (city, type) => `https://m.uber.com/go/product`,
    appLink: 'https://play.google.com/store/apps/details?id=com.ubercab',
  },
  rapido: {
    name: 'Rapido',
    color: '#FFD700',
    bgColor: '#fffbe6',
    textColor: '#000',
    logo: 'R',
    multiplier: 0.85, // Usually 15% cheaper
    availability: ['bike', 'auto', 'mini', 'sedan', 'suv', 'electric'],
    deeplink: (city, type) => `https://www.rapido.bike`,
    appLink: 'https://play.google.com/store/apps/details?id=com.rapido.passenger',
  },
  ola: {
    name: 'Ola',
    color: '#3CB371',
    bgColor: '#f0fff4',
    textColor: '#000',
    logo: 'O',
    multiplier: 0.95,
    availability: ['bike', 'auto', 'mini', 'sedan', 'suv', 'prime', 'electric', 'intercity'],
    deeplink: (city, type) => `https://book.olacabs.com`,
    appLink: 'https://play.google.com/store/apps/details?id=com.olacabs.customer',
  },
  blueSmartBikes: {
    name: 'BlueSmart',
    color: '#1565C0',
    bgColor: '#e3f2fd',
    textColor: '#fff',
    logo: 'BS',
    multiplier: 0.80, // Electric usually cheapest
    availability: ['electric'],
    deeplink: () => `https://bluesmart.in`,
    appLink: 'https://play.google.com/store/apps/details?id=com.bluesmart.customer',
  },
  nammaYatri: {
    name: 'Namma Yatri',
    subname: 'ONDC Open Mobility',
    color: '#D97706',
    bgColor: '#FFFBEB',
    textColor: '#92400E',
    badge: '0% Driver Commission',
    logo: 'NY',
    multiplier: 0.78, // Direct auto tariff regulated by RTO
    availability: ['auto'],
    deeplink: (city, type) => `nammayatri://ride`,
    appLink: 'https://play.google.com/store/apps/details?id=in.juspay.nammayatri',
    webLink: 'https://nammayatri.in',
  },
};

// Surge multiplier simulation (time-based)
export function getSurgeMultiplier() {
  const hour = new Date().getHours();
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    return 1.2 + Math.random() * 0.3; // Peak hours: 1.2x – 1.5x
  }
  if (hour >= 23 || hour <= 5) {
    return 1.1 + Math.random() * 0.2; // Late night: 1.1x – 1.3x
  }
  return 1.0;
}

export function calculateFares(city, rideType, distanceKm, passengers = 1, roadDurationMinutes = 30) {
  const rates = BASE_RATES[city] || BASE_RATES['Bangalore'];
  const mins = MIN_FARES[city] || MIN_FARES['Bangalore'];
  const surge = getSurgeMultiplier();
  const baseFarePerKm = rates[rideType] || 10;
  const minFare = mins[rideType] || 50;

  const results = [];

  Object.entries(PLATFORMS).forEach(([platformId, platform]) => {
    if (!platform.availability.includes(rideType)) return;

    const rawFare = Math.max(distanceKm * baseFarePerKm * platform.multiplier, minFare * platform.multiplier);
    // Namma Yatri (ONDC) is commission-free and not subject to private surge multipliers
    const effectiveSurge = platformId === 'nammaYatri' ? 1.0 : surge;
    const fare = Math.round(rawFare * effectiveSurge);
    
    // Pickup ETA in minutes (e.g. 2-8 mins)
    const eta = platformId === 'nammaYatri' ? 4 : Math.round(2 + Math.random() * 6);
    
    // Total Door-to-Door ETA = Driver Pickup ETA + Road Travel Time
    const totalMinutes = eta + (roadDurationMinutes || 30);
    
    // Carpool / split fare per person
    const splitCount = Math.max(1, passengers || 1);
    const farePerPerson = Math.round(fare / splitCount);

    results.push({
      platformId,
      platform,
      fare,
      farePerPerson,
      passengers: splitCount,
      fareMin: Math.round(fare * 0.9),
      fareMax: Math.round(fare * 1.1),
      eta,
      totalMinutes,
      surge: effectiveSurge > 1.1,
      surgeMultiplier: effectiveSurge,
    });
  });

  return results.sort((a, b) => a.fare - b.fare);
}

export const POPULAR_ROUTES = {
  Bangalore: [
    { from: 'Koramangala 4th Block', to: 'Whitefield ITPL', distance: 18 },
    { from: 'Indiranagar 100ft Road', to: 'Electronic City Phase 1', distance: 20 },
    { from: 'MG Road Metro Station', to: 'Kempegowda International Airport', distance: 38 },
    { from: 'HSR Layout Sector 1', to: 'Manyata Tech Park', distance: 19 },
  ],
  Mumbai: [
    { from: 'Bandra Kurla Complex (BKC)', to: 'Andheri West Station', distance: 11 },
    { from: 'Dadar Station', to: 'Bandra West', distance: 6 },
    { from: 'Powai Hiranandani', to: 'Nariman Point', distance: 28 },
    { from: 'Bandra Kurla Complex (BKC)', to: 'Chhatrapati Shivaji Maharaj Airport (T2)', distance: 8 },
  ],
  Delhi: [
    { from: 'Connaught Place', to: 'Cyber Hub Gurgaon', distance: 29 },
    { from: 'Lajpat Nagar Central Market', to: 'Indira Gandhi International Airport (T3)', distance: 18 },
    { from: 'Noida Sector 18', to: 'India Gate', distance: 16 },
    { from: 'Hauz Khas Village', to: 'Cyber Hub Gurgaon', distance: 17 },
  ],
  Hyderabad: [
    { from: 'HITEC City Cyber Towers', to: 'Rajiv Gandhi International Airport', distance: 34 },
    { from: 'Gachibowli Stadium', to: 'Jubilee Hills Check Post', distance: 11 },
    { from: 'Secunderabad Station', to: 'HITEC City Cyber Towers', distance: 20 },
    { from: 'Banjara Hills Road 12', to: 'Rajiv Gandhi International Airport', distance: 30 },
  ],
  Chennai: [
    { from: 'T Nagar Panagal Park', to: 'OMR Thoraipakkam', distance: 15 },
    { from: 'Marina Beach Lighthouse', to: 'Chennai International Airport', distance: 19 },
    { from: 'Guindy Tech Park', to: 'Velachery Phoenix Mall', distance: 6 },
    { from: 'T Nagar Panagal Park', to: 'Chennai International Airport', distance: 12 },
  ],
  Pune: [
    { from: 'Hinjawadi Phase 1', to: 'Shivajinagar Station', distance: 17 },
    { from: 'Koregaon Park', to: 'Pune International Airport', distance: 8 },
    { from: 'Kothrud', to: 'Viman Nagar', distance: 18 },
    { from: 'Hinjawadi Phase 1', to: 'Pune International Airport', distance: 26 },
  ],
  Kolkata: [
    { from: 'Salt Lake Sector V', to: 'Park Street', distance: 12 },
    { from: 'Howrah Railway Station', to: 'Netaji Subhash Airport (CCU)', distance: 16 },
    { from: 'New Town Action Area 1', to: 'Park Street', distance: 15 },
  ],
  Ahmedabad: [
    { from: 'SG Highway', to: 'GIFT City SEZ', distance: 22 },
    { from: 'Prahlad Nagar Garden', to: 'Sardar Patel Airport (AMD)', distance: 19 },
    { from: 'Vastrapur Lake', to: 'SG Highway', distance: 5 },
  ],
  Jaipur: [
    { from: 'C-Scheme', to: 'Jaipur International Airport', distance: 12 },
    { from: 'Vaishali Nagar', to: 'Malviya Nagar World Trade Park', distance: 15 },
    { from: 'Hawa Mahal Walled City', to: 'Jaipur International Airport', distance: 13 },
  ],
  Lucknow: [
    { from: 'Hazratganj Main Market', to: 'Chaudhary Charan Singh Airport', distance: 14 },
    { from: 'Gomti Nagar Wave Mall', to: 'Charbagh Railway Station', distance: 11 },
    { from: 'Aliganj Sector H', to: 'Gomti Nagar Wave Mall', distance: 9 },
  ],
};
