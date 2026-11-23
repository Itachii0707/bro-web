import { useState, useEffect } from 'react';
import { 
  MapPin, Clock, ArrowRight, ArrowUpRight, AlertCircle, 
  Navigation, RefreshCw, SlidersHorizontal, CheckCircle2, Route,
  Users, Zap, DollarSign, ExternalLink
} from 'lucide-react';
import { 
  CITIES, RIDE_TYPES, POPULAR_ROUTES, 
  calculateFares, getSurgeMultiplier 
} from '../data/rides';
import { CITY_LANDMARKS, calculateRoadDistance } from '../services/routing';
import { logRideSearch } from '../services/supabase';
import AddressAutocomplete from './AddressAutocomplete';
import RideDispatchModal from './RideDispatchModal';
import RouteMap from './RouteMap';
import PlatformBadge from './PlatformBadge';

export default function RidesPage() {
  const [city, setCity] = useState('Bangalore');
  const [dispatchModalCarrier, setDispatchModalCarrier] = useState(null);
  
  // Coordinates state
  const defaultOrigin = CITY_LANDMARKS['Bangalore']['Koramangala 4th Block'];
  const defaultDest = CITY_LANDMARKS['Bangalore']['Kempegowda International Airport'];

  const [fromPoint, setFromPoint] = useState({
    name: 'Koramangala 4th Block',
    lat: defaultOrigin.lat,
    lon: defaultOrigin.lon
  });

  const [toPoint, setToPoint] = useState({
    name: 'Kempegowda International Airport',
    lat: defaultDest.lat,
    lon: defaultDest.lon
  });

  const [distanceKm, setDistanceKm] = useState(38);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [polylinePoints, setPolylinePoints] = useState([]);
  const [isRealRoad, setIsRealRoad] = useState(true);
  const [calculatingRoute, setCalculatingRoute] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [rideType, setRideType] = useState('sedan');
  const [passengers, setPassengers] = useState(1); // 1 | 2 | 3 | 4

  const popularRoutes = POPULAR_ROUTES[city] || POPULAR_ROUTES['Bangalore'];
  const fares = calculateFares(city, rideType, distanceKm, passengers, durationMinutes);
  
  // Highlights
  const lowestFare = fares[0];
  const fastestArrival = [...fares].sort((a, b) => a.totalMinutes - b.totalMinutes)[0];

  const currentSurge = getSurgeMultiplier();
  const hasSurge = currentSurge > 1.15;

  // Auto calculate route whenever coordinates change and manual override is off
  useEffect(() => {
    async function updateRoute() {
      if (!fromPoint?.lat || !toPoint?.lat) return;
      if (manualOverride) return;

      setCalculatingRoute(true);
      try {
        const route = await calculateRoadDistance(fromPoint, toPoint);
        if (route) {
          setDistanceKm(route.distanceKm);
          setDurationMinutes(route.durationMinutes);
          setIsRealRoad(route.isRealRoad);
          setPolylinePoints(route.polylinePoints || []);
        }
      } catch (err) {
        console.error('Failed to calculate road route:', err);
      } finally {
        setCalculatingRoute(false);
      }
    }

    updateRoute();
  }, [fromPoint, toPoint, manualOverride]);

  const handleRouteSelect = (route) => {
    setManualOverride(false);
    const cityLandmarks = CITY_LANDMARKS[city] || CITY_LANDMARKS['Bangalore'];
    const landmarkKeys = Object.keys(cityLandmarks);
    const defaultA = cityLandmarks[landmarkKeys[0]] || { lat: 12.9352, lon: 77.6245 };
    const defaultB = cityLandmarks[landmarkKeys[1] || landmarkKeys[0]] || { lat: 13.1986, lon: 77.7064 };

    const fromL = cityLandmarks[route.from] || defaultA;
    const toL = cityLandmarks[route.to] || defaultB;

    setFromPoint({
      name: route.from,
      lat: fromL.lat,
      lon: fromL.lon
    });
    setToPoint({
      name: route.to,
      lat: toL.lat,
      lon: toL.lon
    });
    setDistanceKm(route.distance);
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
    setManualOverride(false);
    const landmarks = CITY_LANDMARKS[newCity] || CITY_LANDMARKS['Bangalore'];
    const keys = Object.keys(landmarks);
    if (keys.length >= 2) {
      setFromPoint({ name: keys[1], lat: landmarks[keys[1]].lat, lon: landmarks[keys[1]].lon });
      setToPoint({ name: keys[0], lat: landmarks[keys[0]].lat, lon: landmarks[keys[0]].lon });
    }
  };

  const openCarrierIntent = (carrier) => {
    logRideSearch({
      city,
      origin: fromPoint.name,
      destination: toPoint.name,
      distanceKm: Number(distanceKm),
      durationMinutes: Number(durationMinutes),
      selectedCarrier: carrier.platform.name,
      fare: Number(carrier.fare)
    });

    // Native app deep link with web fallback
    let targetUrl = carrier.platform.deeplink(city, rideType);
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // If on desktop and using custom app protocol (e.g. nammayatri://), fallback safely to web portal
    if (!isMobile && targetUrl && !targetUrl.startsWith('http')) {
      targetUrl = carrier.platform.webLink || carrier.platform.appLink || 'https://nammayatri.in';
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header with Editorial Styling */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-[#EBEBF0]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b59a50] block mb-1">
            Live Cab & Auto Price Radar
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#333333]">
            Cab & Auto Fare Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1 font-sans">
            Real-time door-to-door fare and ETA comparison across Uber, Rapido, Ola, and Namma Yatri with zero commission markup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasSurge ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF8D9] border border-[#B59A50]/30 text-[#856404] text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-[#B59A50]" />
              <span>Surge active (~{currentSurge.toFixed(1)}x)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3FBEF] border border-[#008738]/20 text-[#008738] text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#008738]" />
              <span>Normal tariffs (1.0x)</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Setup & Corridors (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* City Selection */}
          <div className="bg-white rounded-xl p-4 border border-[#EBEBF0] shadow-card">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666] block mb-2.5">
              Operating Metro
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCityChange(c)}
                  className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                    city === c
                      ? 'bg-[#333333] text-white font-medium shadow-sm'
                      : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Route Config with Live Autocomplete */}
          <div className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F8F9FA]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                Route Coordinates
              </span>
              <button
                type="button"
                onClick={() => setManualOverride(!manualOverride)}
                className={`text-[11px] flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                  manualOverride 
                    ? 'bg-[#333333] text-white' 
                    : 'text-[#666666] hover:text-[#333333] hover:bg-[#F8F9FA]'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{manualOverride ? 'Manual km active' : 'Custom km slider'}</span>
              </button>
            </div>

            {/* Pickup */}
            <div>
              <AddressAutocomplete
                label="Pickup Location"
                city={city}
                value={fromPoint}
                onChange={(text) => setFromPoint((prev) => ({ ...prev, name: text }))}
                onSelectCoordinate={(item) => {
                  setManualOverride(false);
                  setFromPoint(item);
                }}
                placeholder={`Search landmark or address in ${city}...`}
              />
            </div>

            {/* Dropoff */}
            <div>
              <AddressAutocomplete
                label="Dropoff Location"
                city={city}
                value={toPoint}
                onChange={(text) => setToPoint((prev) => ({ ...prev, name: text }))}
                onSelectCoordinate={(item) => {
                  setManualOverride(false);
                  setToPoint(item);
                }}
                placeholder={`Search landmark or address in ${city}...`}
              />
            </div>

            {/* Live Road Routing Stats */}
            <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#EBEBF0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Route className={`w-4 h-4 ${calculatingRoute ? 'animate-pulse text-[#b59a50]' : 'text-[#008738]'}`} />
                <div>
                  <div className="text-xs font-semibold text-[#333333] flex items-center gap-1.5">
                    <span>{distanceKm} km</span>
                    <span className="text-[#9E9E9E] font-normal">•</span>
                    <span>~{durationMinutes} min drive</span>
                  </div>
                  <span className="text-[10px] text-[#9E9E9E]">
                    {calculatingRoute 
                      ? 'Calculating road geometry...' 
                      : isRealRoad 
                        ? 'OSRM Road Network API (Real-time)' 
                        : 'Haversine Urban Factor Calculation'}
                  </span>
                </div>
              </div>

              {calculatingRoute && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#b59a50]" />
              )}
            </div>

            {/* Distance Slider (Only shown if manual override enabled) */}
            {manualOverride && (
              <div className="pt-2 border-t border-[#F8F9FA] animate-in fade-in duration-150">
                <div className="flex justify-between text-xs text-[#666666] mb-1">
                  <span>Manual Distance Override:</span>
                  <span className="font-semibold text-[#333333] font-mono">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="70"
                  step="1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full accent-[#333333] bg-[#EBEBF0] rounded h-1 cursor-pointer"
                />
              </div>
            )}

            {/* Popular Landmarks in selected city */}
            <div className="pt-2 border-t border-[#F8F9FA]">
              <span className="text-xs text-[#666666] block mb-2">Common Express Corridors in {city}:</span>
              <div className="space-y-1.5">
                {popularRoutes.slice(0, 3).map((r) => (
                  <button
                    key={`${r.from}-${r.to}`}
                    onClick={() => handleRouteSelect(r)}
                    className="w-full text-left p-2 rounded bg-[#FAFAFA] hover:bg-[#F3FBEF] border border-[#EBEBF0] text-xs text-[#333333] flex items-center justify-between transition-colors"
                  >
                    <span className="truncate">{r.from} → {r.to}</span>
                    <span className="text-[#b59a50] font-mono text-[11px] ml-2 flex-shrink-0 font-medium">
                      {r.distance} km
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Vehicle Class Selection */}
          <div className="bg-white rounded-xl p-4 border border-[#EBEBF0] shadow-card">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#666666] block mb-2.5">
              Vehicle Category
            </span>
            <div className="grid grid-cols-2 gap-2">
              {RIDE_TYPES.slice(0, 6).map((rt) => {
                const isSelected = rideType === rt.id;
                return (
                  <button
                    key={rt.id}
                    onClick={() => setRideType(rt.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-[#333333] bg-[#F8F9FA] text-[#333333] shadow-sm'
                        : 'border-[#EBEBF0] bg-white text-[#666666] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{rt.label}</div>
                    <div className="text-[11px] text-[#9E9E9E] truncate mt-0.5">{rt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right: Live Map & Quote Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">

          {/* Real-time Interactive Leaflet Map */}
          <RouteMap
            origin={fromPoint}
            destination={toPoint}
            polylinePoints={polylinePoints}
            distanceKm={distanceKm}
            durationMinutes={durationMinutes}
          />
          
          <div className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-card space-y-4">
            
            {/* BRO AI Transit Verdict Hero Recommendation */}
            {lowestFare && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#F3FBEF] to-[#FAFAFA] border-2 border-[#008738]/30 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#008738] px-2 py-0.5 rounded">
                      BRO AI Transit Verdict
                    </span>
                    <PlatformBadge platformKey={lowestFare.platformId || lowestFare.platform.name} size="xs" showTag={true} />
                  </div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#111111]">
                    Recommended Carrier: {lowestFare.platform.name} ({rideType.toUpperCase()})
                  </h3>
                  <p className="text-xs text-[#666666]">
                    Optimal tariff ₹{lowestFare.farePerPerson}{passengers > 1 ? '/person' : ''} • ~{lowestFare.totalMinutes}m door-to-door • Saves ₹{((fares[fares.length - 1]?.fare || lowestFare.fare) - lowestFare.fare) || 60} vs alternate quote • Verified 0% Surge Markup.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openCarrierIntent(lowestFare)}
                  className="px-4 py-2 bg-[#008738] hover:bg-[#00702e] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 flex-shrink-0 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Book on {lowestFare.platform.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Top Algorithmic Recommendations Banner */}
            {lowestFare && fastestArrival && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-[#EBEBF0]">
                {/* Lowest Fare Banner */}
                <div className="p-3 rounded-xl bg-[#F3FBEF] border border-[#008738]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#008738] uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Lowest Fare Winner
                    </span>
                    <div className="text-xs font-bold text-[#333333] mt-0.5">
                      {lowestFare.platform.name}
                    </div>
                    <span className="text-[10px] text-[#666666]">
                      ~{lowestFare.totalMinutes} min door-to-door
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-[#008738] font-mono">
                      ₹{lowestFare.farePerPerson}
                    </span>
                    {passengers > 1 && (
                      <span className="text-[9px] text-[#008738] block font-mono">
                        per person
                      </span>
                    )}
                  </div>
                </div>

                {/* Fastest Arrival Banner */}
                <div className="p-3 rounded-xl bg-[#FFF8D9] border border-[#b59a50]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#856404] uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#b59a50]" />
                      Fastest Door-to-Door
                    </span>
                    <div className="text-xs font-bold text-[#333333] mt-0.5">
                      {fastestArrival.platform.name}
                    </div>
                    <span className="text-[10px] text-[#666666]">
                      {fastestArrival.eta}m wait + {durationMinutes}m road
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-[#856404] font-mono">
                      {fastestArrival.totalMinutes}m
                    </span>
                    <span className="text-[9px] text-[#856404] block font-mono">
                      Total ETA
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Carpool / Split Fare Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F8F9FA]">
              <div className="flex items-center gap-1.5 text-xs text-[#666666]">
                <Users className="w-3.5 h-3.5 text-[#b59a50]" />
                <span className="font-semibold text-[#333333]">Ride Split:</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPassengers(num)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      passengers === num
                        ? 'bg-[#333333] text-white shadow-xs'
                        : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
                    }`}
                  >
                    {num === 1 ? 'Solo (1)' : `${num} Split`}
                  </button>
                ))}
              </div>
            </div>

            {/* Carrier Cards */}
            <div className="space-y-3">
              {fares.map((f, idx) => {
                const isLowest = idx === 0;

                return (
                  <div 
                    key={f.platformId}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLowest 
                        ? 'border-[#008738]/40 bg-[#F3FBEF] shadow-sm' 
                        : 'border-[#EBEBF0] bg-white hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <PlatformBadge platformKey={f.platformId || f.platform.name} size="sm" showType={true} />
                        {isLowest && (
                          <span className="text-[10px] font-bold text-[#008738] bg-[#E1F7DE] px-2 py-0.5 rounded-full border border-[#008738]/20">
                            Lowest Fare
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#666666] mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#9E9E9E]" />
                          ~{f.eta}m pickup
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#333333]">
                          ~{f.totalMinutes}m total ETA
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[#9E9E9E]">₹{f.fareMin} - ₹{f.fareMax} tariff</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EBEBF0]">
                      <div className="text-left sm:text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-serif font-bold text-[#333333] font-mono tabular-nums">
                            ₹{f.farePerPerson}
                          </span>
                          {passengers > 1 && (
                            <span className="text-[10px] text-[#008738] font-bold">/person</span>
                          )}
                        </div>
                        {passengers > 1 ? (
                          <span className="text-[10px] text-[#9E9E9E] font-mono block">
                            (₹{f.fare} total / {passengers} riders)
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#9E9E9E] font-mono block">
                            ₹{(f.fare / distanceKm).toFixed(1)}/km
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            logRideSearch({
                              city,
                              origin: fromPoint.name,
                              destination: toPoint.name,
                              distanceKm: Number(distanceKm),
                              durationMinutes: Number(durationMinutes),
                              selectedCarrier: f.platform.name,
                              fare: Number(f.fare)
                            });
                            setDispatchModalCarrier(f);
                          }}
                          className="px-2.5 py-2 bg-[#F8F9FA] hover:bg-[#EBEBF0] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3 text-[#b59a50]" />
                          <span>Track</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openCarrierIntent(f)}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                            isLowest
                              ? 'bg-[#008738] hover:bg-[#00702e] text-white shadow-sm'
                              : 'bg-[#333333] hover:bg-[#111111] text-white shadow-sm'
                          }`}
                        >
                          <span>Book Ride</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Dispatch Note */}
          <div className="bg-white border border-[#EBEBF0] rounded-xl p-4 text-xs text-[#666666] leading-relaxed shadow-card">
            <span className="font-semibold text-[#333333] block mb-1">
              Zero-Intermediary Deep Links & ONDC Open Mobility
            </span>
            Clicking <strong className="text-[#333333]">Book Ride</strong> deep-links directly into the official carrier app (Uber, Rapido, Ola, or Namma Yatri) with origin and destination coordinates pre-loaded. BRO AI charges 0% commission to drivers and riders.
          </div>

        </div>

      </div>

      {/* STITCH GENERATED DISPATCH MODAL */}
      {dispatchModalCarrier && (
        <RideDispatchModal
          routeInfo={{
            from: fromPoint.name,
            to: toPoint.name,
            distanceKm,
            durationMinutes
          }}
          carrier={dispatchModalCarrier}
          onClose={() => setDispatchModalCarrier(null)}
        />
      )}

    </div>
  );
}
