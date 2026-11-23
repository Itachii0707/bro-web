import React from 'react';
import { 
  ShoppingBag, Zap, Building2, Store, Truck, Navigation, 
  Car, Shield, CheckCircle2 
} from 'lucide-react';

/**
 * Clean, bespoke SVG platform marks for Indian Retailers and Transit Networks.
 * Pure vector lines, high contrast, zero pixelated or sloppy images.
 */
export const PLATFORM_DATA = {
  // Retailers
  amazon: {
    name: 'Amazon India',
    shortName: 'Amazon',
    themeColor: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
    tag: 'Prime Next-Day',
    type: 'E-Commerce'
  },
  flipkart: {
    name: 'Flipkart',
    shortName: 'Flipkart',
    themeColor: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    tag: 'F-Assured 2-Day',
    type: 'E-Commerce'
  },
  croma: {
    name: 'Croma (Tata)',
    shortName: 'Croma',
    themeColor: '#008738',
    bg: '#F3FBEF',
    border: '#CDEEC6',
    tag: 'Tata Authentic',
    type: 'Retail Chain'
  },
  reliance: {
    name: 'Reliance Digital',
    shortName: 'Reliance',
    themeColor: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3',
    tag: 'ResQ Warranty',
    type: 'Retail Chain'
  },
  jiomart: {
    name: 'JioMart',
    shortName: 'JioMart',
    themeColor: '#0D9488',
    bg: '#F0FDFA',
    border: '#99F6E4',
    tag: 'Jio Verified',
    type: 'E-Commerce'
  },
  blinkit: {
    name: 'Blinkit',
    shortName: 'Blinkit',
    themeColor: '#CA8A04',
    bg: '#FEFCE8',
    border: '#FEF08A',
    tag: '⚡ 10-Min Flash',
    type: '10-Min Flash'
  },
  zepto: {
    name: 'Zepto',
    shortName: 'Zepto',
    themeColor: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    tag: '⚡ 10-Min Flash',
    type: '10-Min Flash'
  },
  flipkart_minutes: {
    name: 'Flipkart Minutes',
    shortName: 'Minutes',
    themeColor: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD',
    tag: '⚡ 10-Min Flash',
    type: '10-Min Flash'
  },
  vijaysales: {
    name: 'Vijay Sales',
    shortName: 'Vijay Sales',
    themeColor: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    tag: 'Store Pickup',
    type: 'Retail Chain'
  },

  // Transit Carriers
  uber: {
    name: 'Uber',
    shortName: 'Uber',
    themeColor: '#111111',
    bg: '#F8F9FA',
    border: '#E5E7EB',
    tag: 'Official Global Fleet',
    type: 'Cab / Auto'
  },
  ola: {
    name: 'Ola Cabs',
    shortName: 'Ola',
    themeColor: '#4D7C0F',
    bg: '#F7FEE7',
    border: '#D9F99D',
    tag: 'Prime Fleet',
    type: 'Cab / Auto'
  },
  rapido: {
    name: 'Rapido',
    shortName: 'Rapido',
    themeColor: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    tag: 'Fast Traffic Pass',
    type: 'Bike / Auto'
  },
  nammayatri: {
    name: 'Namma Yatri',
    shortName: 'Namma Yatri',
    themeColor: '#008738',
    bg: '#F3FBEF',
    border: '#CDEEC6',
    tag: '0% Driver Commission',
    type: 'ONDC Open Mobility'
  }
};

function normalizeKey(rawKey) {
  if (!rawKey) return 'amazon';
  const s = String(rawKey).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s.includes('amazon')) return 'amazon';
  if (s.includes('flipkartminutes') || s.includes('minutes')) return 'flipkart_minutes';
  if (s.includes('flipkart')) return 'flipkart';
  if (s.includes('croma')) return 'croma';
  if (s.includes('reliance')) return 'reliance';
  if (s.includes('jiomart') || s.includes('jio')) return 'jiomart';
  if (s.includes('blinkit')) return 'blinkit';
  if (s.includes('zepto')) return 'zepto';
  if (s.includes('vijay')) return 'vijaysales';
  if (s.includes('uber')) return 'uber';
  if (s.includes('ola')) return 'ola';
  if (s.includes('rapido')) return 'rapido';
  if (s.includes('namma')) return 'nammayatri';
  return s;
}

export default function PlatformBadge({ 
  platformKey, 
  name, 
  size = 'sm', 
  showName = true, 
  showTag = false,
  showType = false,
  className = ''
}) {
  const resolvedKey = normalizeKey(platformKey || name);
  const p = PLATFORM_DATA[resolvedKey] || {
    name: name || platformKey || 'Store',
    shortName: name || platformKey || 'Store',
    themeColor: '#333333',
    bg: '#F8F9FA',
    border: '#EBEBF0',
    tag: 'Verified',
    type: 'Partner'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border transition-all ${
        size === 'xs' 
          ? 'px-1.5 py-0.5 text-[10px]' 
          : size === 'lg' 
          ? 'px-3 py-1.5 text-xs' 
          : 'px-2 py-0.5 text-[11px]'
      } ${className}`}
      style={{
        backgroundColor: p.bg,
        borderColor: p.border,
        color: p.themeColor
      }}
    >
      <span 
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: p.themeColor }}
      />
      {showName && <span className="font-semibold tracking-tight">{p.shortName}</span>}
      {showType && (
        <span className="text-[9.5px] font-normal opacity-75 border-l pl-1.5 border-current">
          {p.type}
        </span>
      )}
      {showTag && (
        <span className="text-[9.5px] font-normal opacity-85 border-l pl-1.5 border-current">
          {p.tag}
        </span>
      )}
    </span>
  );
}
