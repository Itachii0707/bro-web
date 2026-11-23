/**
 * Free Zero-Cost Routing & Geocoding Service
 * Powered by OpenStreetMap (Nominatim) & OSRM (Open Source Routing Machine)
 * 100% Free, no API keys, no monthly fees.
 */

// In-memory cache to avoid duplicate API requests and respect OSM policies
const geocodeCache = new Map();
const routeCache = new Map();

// Known coordinates for fast instant fallback & preset loading across Indian metros
export const CITY_LANDMARKS = {
  Bangalore: {
    'Kempegowda International Airport': { lat: 13.1986, lon: 77.7064, short: 'KIA Airport, Devanahalli' },
    'Koramangala 4th Block': { lat: 12.9352, lon: 77.6245, short: 'Koramangala 4th Block' },
    'Indiranagar 100ft Road': { lat: 12.9733, lon: 77.6405, short: 'Indiranagar 100ft Rd' },
    'Whitefield ITPL': { lat: 12.9863, lon: 77.7337, short: 'ITPL, Whitefield' },
    'HSR Layout Sector 1': { lat: 12.9116, lon: 77.6389, short: 'HSR Layout Sector 1' },
    'Electronic City Phase 1': { lat: 12.8452, lon: 77.6602, short: 'Electronic City Ph 1' },
    'MG Road Metro Station': { lat: 12.9756, lon: 77.6066, short: 'MG Road Metro' },
    'Manyata Tech Park': { lat: 13.0487, lon: 77.6213, short: 'Manyata Tech Park, Hebbal' },
  },
  Mumbai: {
    'Chhatrapati Shivaji Maharaj Airport (T2)': { lat: 19.0896, lon: 72.8656, short: 'CSMIA Airport (T2)' },
    'Bandra Kurla Complex (BKC)': { lat: 19.0657, lon: 72.8687, short: 'BKC, Bandra East' },
    'Nariman Point': { lat: 18.9256, lon: 72.8242, short: 'Nariman Point, South Mumbai' },
    'Andheri West Station': { lat: 19.1197, lon: 72.8464, short: 'Andheri West' },
    'Powai Hiranandani': { lat: 19.1197, lon: 72.9051, short: 'Hiranandani Gardens, Powai' },
    'Dadar Station': { lat: 19.0178, lon: 72.8478, short: 'Dadar Central' },
    'Bandra West': { lat: 19.0596, lon: 72.8295, short: 'Bandra Linking Road' },
  },
  Delhi: {
    'Indira Gandhi International Airport (T3)': { lat: 28.5562, lon: 77.1000, short: 'IGI Airport (T3)' },
    'Connaught Place': { lat: 28.6304, lon: 77.2177, short: 'Connaught Place, Central Delhi' },
    'Cyber Hub Gurgaon': { lat: 28.4950, lon: 77.0895, short: 'DLF Cyber City, Gurgaon' },
    'Noida Sector 18': { lat: 28.5708, lon: 77.3260, short: 'Sector 18 Atta Market, Noida' },
    'Lajpat Nagar Central Market': { lat: 28.5677, lon: 77.2433, short: 'Lajpat Nagar II' },
    'India Gate': { lat: 28.6129, lon: 77.2295, short: 'India Gate, New Delhi' },
    'Hauz Khas Village': { lat: 28.5535, lon: 77.1943, short: 'Hauz Khas Village' },
  },
  'Delhi-NCR': {
    'Indira Gandhi International Airport (T3)': { lat: 28.5562, lon: 77.1000, short: 'IGI Airport (T3)' },
    'Connaught Place': { lat: 28.6304, lon: 77.2177, short: 'Connaught Place, Central Delhi' },
    'Cyber Hub Gurgaon': { lat: 28.4950, lon: 77.0895, short: 'DLF Cyber City, Gurgaon' },
    'Noida Sector 18': { lat: 28.5708, lon: 77.3260, short: 'Sector 18, Noida' },
    'Lajpat Nagar Central Market': { lat: 28.5677, lon: 77.2433, short: 'Lajpat Nagar II' },
  },
  Hyderabad: {
    'Rajiv Gandhi International Airport': { lat: 17.2403, lon: 78.4294, short: 'RGIA Airport, Shamshabad' },
    'HITEC City Cyber Towers': { lat: 17.4504, lon: 78.3808, short: 'Cyber Towers, HITEC City' },
    'Gachibowli Stadium': { lat: 17.4435, lon: 78.3489, short: 'Gachibowli Financial Dist' },
    'Jubilee Hills Check Post': { lat: 17.4319, lon: 78.4073, short: 'Jubilee Hills Rd 36' },
    'Secunderabad Station': { lat: 17.4399, lon: 78.4983, short: 'Secunderabad Junction' },
    'Banjara Hills Road 12': { lat: 17.4156, lon: 78.4350, short: 'Banjara Hills Rd 12' },
  },
  Chennai: {
    'Chennai International Airport': { lat: 12.9941, lon: 80.1709, short: 'Chennai Airport, Meenambakkam' },
    'T Nagar Panagal Park': { lat: 13.0418, lon: 80.2341, short: 'T. Nagar, Central Chennai' },
    'OMR Thoraipakkam': { lat: 12.9366, lon: 80.2312, short: 'OMR IT Corridor, Thoraipakkam' },
    'Marina Beach Lighthouse': { lat: 13.0499, lon: 80.2824, short: 'Marina Beach' },
    'Guindy Tech Park': { lat: 13.0067, lon: 80.2025, short: 'Olympia Tech Park, Guindy' },
    'Velachery Phoenix Mall': { lat: 12.9815, lon: 80.2180, short: 'Velachery Bypass' },
  },
  Pune: {
    'Pune International Airport': { lat: 18.5822, lon: 73.9197, short: 'Pune Airport, Lohegaon' },
    'Hinjawadi Phase 1': { lat: 18.5913, lon: 73.7389, short: 'Hinjawadi IT Park Ph 1' },
    'Koregaon Park': { lat: 18.5362, lon: 73.8940, short: 'Koregaon Park North Main Rd' },
    'Viman Nagar': { lat: 18.5679, lon: 73.9143, short: 'Viman Nagar' },
    'Shivajinagar Station': { lat: 18.5314, lon: 73.8446, short: 'Shivajinagar Central' },
    'Kothrud': { lat: 18.5074, lon: 73.8077, short: 'Kothrud Stand' },
  },
  Kolkata: {
    'Netaji Subhash Airport (CCU)': { lat: 22.6547, lon: 88.4467, short: 'Dumdum Airport (CCU)' },
    'Salt Lake Sector V': { lat: 22.5804, lon: 88.4378, short: 'Sector V IT Hub, Salt Lake' },
    'Park Street': { lat: 22.5517, lon: 88.3527, short: 'Park Street Metro' },
    'Howrah Railway Station': { lat: 22.5855, lon: 88.3426, short: 'Howrah Station' },
    'New Town Action Area 1': { lat: 22.5867, lon: 88.4734, short: 'New Town Axis Mall' },
  },
  Ahmedabad: {
    'Sardar Patel Airport (AMD)': { lat: 23.0772, lon: 72.6347, short: 'Ahmedabad Airport (AMD)' },
    'SG Highway': { lat: 23.0526, lon: 72.5115, short: 'SG Highway, Bodakdev' },
    'Prahlad Nagar Garden': { lat: 23.0125, lon: 72.5108, short: 'Prahlad Nagar' },
    'GIFT City SEZ': { lat: 23.1610, lon: 72.6840, short: 'GIFT City, Gandhinagar' },
    'Vastrapur Lake': { lat: 23.0350, lon: 72.5293, short: 'Vastrapur' },
  },
  Jaipur: {
    'Jaipur International Airport': { lat: 26.8289, lon: 75.8056, short: 'Jaipur Airport (JAI), Sanganer' },
    'Malviya Nagar World Trade Park': { lat: 26.8530, lon: 75.8050, short: 'WTP, Malviya Nagar' },
    'Vaishali Nagar': { lat: 26.9080, lon: 75.7410, short: 'Vaishali Nagar' },
    'C-Scheme': { lat: 26.9090, lon: 75.8000, short: 'C-Scheme, Ashok Nagar' },
    'Hawa Mahal Walled City': { lat: 26.9239, lon: 75.8267, short: 'Badi Chaupar, Old City' },
  },
  Lucknow: {
    'Chaudhary Charan Singh Airport': { lat: 26.7606, lon: 80.8893, short: 'CCS Airport (LKO), Amausi' },
    'Gomti Nagar Wave Mall': { lat: 26.8500, lon: 81.0000, short: 'Gomti Nagar' },
    'Hazratganj Main Market': { lat: 26.8467, lon: 80.9462, short: 'Hazratganj Metro' },
    'Charbagh Railway Station': { lat: 26.8322, lon: 80.9200, short: 'Charbagh Station' },
    'Aliganj Sector H': { lat: 26.8850, lon: 80.9400, short: 'Aliganj' },
  }
};

/**
 * Searches Indian addresses using OpenStreetMap Nominatim.
 * Free, rate-limited reasonably with client-side caching.
 */
export async function searchAddress(query, cityContext = '') {
  if (!query || query.trim().length < 3) return [];

  const normalizedQuery = query.trim();
  const cacheKey = `${normalizedQuery.toLowerCase()}__${(cityContext || '').toLowerCase()}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // Pre-check landmarks for instant matches
  const cityLandmarks = CITY_LANDMARKS[cityContext] || {};
  const localMatches = Object.entries(cityLandmarks)
    .filter(([name]) => name.toLowerCase().includes(normalizedQuery.toLowerCase()))
    .map(([name, data]) => ({
      name,
      shortName: data.short,
      lat: data.lat,
      lon: data.lon,
      isLandmark: true
    }));

  try {
    const searchQuery = cityContext ? `${normalizedQuery}, ${cityContext}, India` : `${normalizedQuery}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=6&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) throw new Error('OSM request failed');
    const data = await res.json();

    const results = data.map((item) => {
      // Create concise short label
      const parts = item.display_name.split(',').map((p) => p.trim());
      const shortName = parts.slice(0, 3).join(', ');

      return {
        name: item.display_name,
        shortName: shortName || item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type,
        isLandmark: false
      };
    });

    // Merge preset landmark matches first, then OSM geocodes
    const combined = [...localMatches, ...results.filter(r => !localMatches.some(l => Math.abs(l.lat - r.lat) < 0.001 && Math.abs(l.lon - r.lon) < 0.001))];
    geocodeCache.set(cacheKey, combined);
    return combined;
  } catch (err) {
    console.warn('Nominatim geocoding failed, trying Photon API fallback:', err.message);
    
    // Tier 2 Zero-Cost Fallback: Photon by Komoot API (OSM-based, high burst limits)
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(normalizedQuery)}&limit=6`;
      const pRes = await fetch(photonUrl);
      if (pRes.ok) {
        const pData = await pRes.json();
        const photonResults = (pData.features || []).map((f) => {
          const props = f.properties || {};
          const labelParts = [props.name, props.street, props.city, props.state].filter(Boolean);
          const fullName = labelParts.join(', ');
          const shortName = props.name || props.street || fullName;

          return {
            name: fullName || shortName,
            shortName: shortName || fullName,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            type: props.osm_value || 'place',
            isLandmark: false
          };
        });

        if (photonResults.length > 0) {
          const combined = [...localMatches, ...photonResults.filter(r => !localMatches.some(l => Math.abs(l.lat - r.lat) < 0.001 && Math.abs(l.lon - r.lon) < 0.001))];
          geocodeCache.set(cacheKey, combined);
          return combined;
        }
      }
    } catch (pErr) {
      console.warn('Photon fallback unreachable, using local landmarks:', pErr.message);
    }

    return localMatches;
  }
}

/**
 * Calculates road driving distance & duration via OSRM (Open Source Routing Machine).
 * 100% Free, zero cost API.
 */
export async function calculateRoadDistance(origin, destination) {
  if (!origin || !destination || !origin.lat || !destination.lat) {
    return null;
  }

  const cacheKey = `${origin.lat.toFixed(4)},${origin.lon.toFixed(4)};${destination.lat.toFixed(4)},${destination.lon.toFixed(4)}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey);
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM routing request failed');

    const data = await res.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = Math.max(1, Math.round((route.distance / 1000) * 10) / 10);
      const durationMin = Math.max(2, Math.round(route.duration / 60));
      
      // Convert GeoJSON [lon, lat] to Leaflet [lat, lon]
      const polylinePoints = (route.geometry?.coordinates || []).map(([lon, lat]) => [lat, lon]);

      const result = {
        distanceKm,
        durationMinutes: durationMin,
        rawDistanceMeters: route.distance,
        rawDurationSeconds: route.duration,
        polylinePoints,
        isRealRoad: true
      };

      routeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('OSRM unreachable, using Haversine road estimation:', err.message);
  }

  // Fallback: Haversine distance multiplied by 1.35 Indian urban circuity factor
  const dLat = (destination.lat - origin.lat) * (Math.PI / 180);
  const dLon = (destination.lon - origin.lon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(origin.lat * (Math.PI / 180)) *
      Math.cos(destination.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = 6371 * c;
  const estimatedRoadKm = Math.max(1, Math.round(straightLineKm * 1.35 * 10) / 10);
  const estimatedMin = Math.round(estimatedRoadKm * 2.2); // ~27 km/h avg city speed

  const fallbackResult = {
    distanceKm: estimatedRoadKm,
    durationMinutes: estimatedMin,
    rawDistanceMeters: estimatedRoadKm * 1000,
    rawDurationSeconds: estimatedMin * 60,
    polylinePoints: [
      [origin.lat, origin.lon],
      [destination.lat, destination.lon]
    ],
    isRealRoad: false
  };

  routeCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}
