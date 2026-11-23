import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function RouteMap({ origin, destination, polylinePoints = [], distanceKm, durationMinutes }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map instance once
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([origin?.lat || 12.9716, origin?.lon || 77.5946], 12);

      // Add OpenStreetMap raster tiles (Zero-cost, open license)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Custom sleek zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    // Clear previous route markers & polylines
    layerGroup.clearLayers();

    if (!origin?.lat || !destination?.lat) return;

    // Custom Editorial Pin Icons
    const originIcon = L.divIcon({
      className: 'custom-map-pin origin-pin',
      html: `
        <div style="background-color: #008738; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,135,56,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
          A
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const destIcon = L.divIcon({
      className: 'custom-map-pin dest-pin',
      html: `
        <div style="background-color: #333333; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #b59a50; font-size: 11px; font-weight: bold;">
          B
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Escape helper to prevent DOM XSS via user input
    const escapeHtml = (str) => {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Add markers
    const markerA = L.marker([origin.lat, origin.lon], { icon: originIcon }).addTo(layerGroup);
    const markerB = L.marker([destination.lat, destination.lon], { icon: destIcon }).addTo(layerGroup);

    markerA.bindTooltip(`<b>Pickup:</b> ${escapeHtml(origin.name || 'Origin')}`, { direction: 'top', offset: [0, -10] });
    markerB.bindTooltip(`<b>Dropoff:</b> ${escapeHtml(destination.name || 'Destination')}`, { direction: 'top', offset: [0, -10] });

    // Draw route polyline
    let bounds;
    if (polylinePoints && polylinePoints.length > 1) {
      const routeLine = L.polyline(polylinePoints, {
        color: '#008738',
        weight: 4.5,
        opacity: 0.9,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(layerGroup);

      // Subtle shadow border line underneath
      L.polyline(polylinePoints, {
        color: '#ffffff',
        weight: 7,
        opacity: 0.5,
      }).addTo(layerGroup).bringToBack();

      bounds = routeLine.getBounds();
    } else {
      bounds = L.latLngBounds([
        [origin.lat, origin.lon],
        [destination.lat, destination.lon],
      ]);
    }

    // Fit map bounds smoothly
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 15,
      animate: true
    });

    // Invalidate size to ensure container fits properly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [origin, destination, polylinePoints]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#EBEBF0] shadow-sm bg-[#F8F9FA]">
      {/* Route Info Badge Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#EBEBF0] shadow-xs text-xs font-sans">
        <span className="flex items-center gap-1 font-semibold text-[#008738]">
          <Navigation className="w-3.5 h-3.5 text-[#008738]" />
          {distanceKm} km
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-[#333333] font-medium">
          ~{durationMinutes} mins road time
        </span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] font-bold text-[#b59a50] uppercase tracking-wider">
          OSRM Live Road
        </span>
      </div>

      {/* Leaflet Map Div */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[260px] sm:h-[300px] z-0" 
        style={{ background: '#f4f4f4' }} 
      />

      {/* Subtle Map Legend Footer */}
      <div className="bg-white px-4 py-2 border-t border-[#EBEBF0] flex items-center justify-between text-[11px] text-[#666666]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#008738]" />
            Pickup (A)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#333333]" />
            Dropoff (B)
          </span>
        </div>
        <span className="text-[10px] text-gray-400">
          OpenStreetMap & OSRM Engine · $0.00 Cost
        </span>
      </div>
    </div>
  );
}
