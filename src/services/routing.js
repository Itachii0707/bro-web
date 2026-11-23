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
    'MG Road Metro Station': { lat: 12.9756, lon: 77.6066, short: 'MG Road Metro' }
  },
  Mumbai: {
    'Chhatrapati Shivaji Maharaj Airport (T2)': { lat: 19.0896, lon: 72.8656, short: 'CSMIA Airport (T2)' },
    'Bandra Kurla Complex (BKC)': { lat: 19.0657, lon: 72.8687, short: 'BKC, Bandra East' },
    'Nariman Point': { lat: 18.9256, lon: 72.8242, short: 'Nariman Point, South Mumbai' },
    'Andheri West Station': { lat: 19.1197, lon: 72.8464, short: 'Andheri West' },
    'Powai Hiranandani': { lat: 19.1197, lon: 72.9051, short: 'Hiranandani Gardens, Powai' }
  },
  'Delhi-NCR': {
    'Indira Gandhi International Airport (T3)': { lat: 28.5562, lon: 77.1000, short: 'IGI Airport (T3)' },
    'Connaught Place': { lat: 28.6304, lon: 77.2177, short: 'Connaught Place, Central Delhi' },
    'Cyber Hub Gurgaon': { lat: 28.4950, lon: 77.0895, short: 'DLF Cyber City, Gurgaon' },
    'Noida Sector 62': { lat: 28.6258, lon: 77.3653, short: 'Sector 62, Noida' },
    'Hauz Khas Village': { lat: 28.5535, lon: 77.1943, short: 'Hauz Khas Village' }
  },
  Hyderabad: {
    'Rajiv Gandhi International Airport': { lat: 17.2403, lon: 78.4294, short: 'RGIA Airport, Shamshabad' },
    'HITEC City Cyber Towers': { lat: 17.4504, lon: 78.3808, short: 'Cyber Towers, HITEC City' },
    'Jubilee Hills Check Post': { lat: 17.4319, lon: 78.4073, short: 'Jubilee Hills' },
    'Gachibowli Stadium': { lat: 17.4435, lon: 78.3489, short: 'Gachibowli' }
  },
  Chennai: {
    'Chennai International Airport': { lat: 12.9941, lon: 80.1709, short: 'Chennai Airport, Meenambakkam' },
    'T Nagar': { lat: 13.0418, lon: 80.2341, short: 'T. Nagar, Central Chennai' },
    'OMR Thoraipakkam': { lat: 12.9366, lon: 80.2312, short: 'OMR IT Corridor, Thoraipakkam' },
    'Marina Beach': { lat: 13.0499, lon: 80.2824, short: 'Marina Beach' }
  },
  Pune: {
    'Pune International Airport': { lat: 18.5822, lon: 73.9197, short: 'Pune Airport, Lohegaon' },
    'Hinjawadi Phase 1': { lat: 18.5913, lon: 73.7389, short: 'Hinjawadi IT Park Ph 1' },
    'Koregaon Park': { lat: 18.5362, lon: 73.8940, short: 'Koregaon Park' },
    'Viman Nagar': { lat: 18.5679, lon: 73.9143, short: 'Viman Nagar' }
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
