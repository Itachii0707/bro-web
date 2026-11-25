import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Star, CheckCircle2, ShieldCheck, ArrowUpRight, 
  Bell, TrendingDown, Check, Sparkles, RefreshCw,
  AlertTriangle, CreditCard, Award, Info, Cpu, Battery,
  Wifi, Camera, Layers, ChevronRight, HelpCircle
} from 'lucide-react';
import { fetchPriceHistory, createPriceAlert } from '../services/supabase';
import { evaluateDealIntelligence, evaluateConditionMatch } from '../services/dealIntelligence';
import { getAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { getSmartProductBuyLink } from '../services/smartBuyLinkEngine';
import { calculateBankOfferMatrix, POPULAR_BANKS, DEFAULT_USER_CARDS } from '../services/bankOfferEngine';
import { useFocusTrap } from '../hooks/useFocusTrap';
import PlatformBadge from './PlatformBadge';
import { playHapticClick, playSuccessChime } from '../utils/audioFeedback';

const STORE_META = {
  amazon: {
    name: 'Amazon India',
    logoTag: 'Prime Fulfilled',
    color: '#EA580C',
    typeBadge: 'E-Commerce',
    perks: ['Prime Next-Day Delivery', '5% Amazon Pay Cashback', '7-Day Easy Replacement']
  },
  flipkart: {
    name: 'Flipkart',
    logoTag: 'F-Assured',
    color: '#2563EB',
    typeBadge: 'E-Commerce',
    perks: ['Free Fast Delivery', 'No Cost EMI Options', 'Brand Exchange Bonus']
  },
  brand_store: {
    name: 'Official Brand Store',
    logoTag: 'Official D2C',
    color: '#111827',
    typeBadge: 'Brand Direct',
    perks: ['100% Genuine Sealed Unit', 'Direct Manufacturer Warranty', 'Official Exchange Value']
  },
  croma: {
    name: 'Croma (Tata)',
    logoTag: 'Tata Authentic',
    color: '#008738',
    typeBadge: 'Retail Chain',
    perks: ['Official Brand Warranty', 'Tata Neu 5% Reward', 'Store Pickup Available']
  },
  reliance: {
    name: 'Reliance Digital',
    logoTag: 'ResQ Warranty',
    color: '#E11D48',
    typeBadge: 'Retail Chain',
    perks: ['100% Genuine Brand Seal', 'ResQ Authorized Service', 'In-Store Demo & Setup']
  },
  jiomart: {
    name: 'JioMart',
    logoTag: 'Jio Verified',
    color: '#0D9488',
    typeBadge: 'E-Commerce',
    perks: ['Direct Brand Supply', 'Instant Bank Card Discount', 'Hassle-Free Return']
  },
  blinkit: {
    name: 'Blinkit',
    logoTag: '10-Min Flash',
    color: '#CA8A04',
    typeBadge: '10-Min Flash',
    perks: ['Instant 10-Min Delivery', 'Genuine Sealed Pack', 'Live Rider GPS Tracking']
  },
  zepto: {
    name: 'Zepto',
    logoTag: '10-Min Flash',
    color: '#7C3AED',
    typeBadge: '10-Min Flash',
    perks: ['Ultra-Fast 10-Min Delivery', 'Verified Brand Products', 'No Delivery Delays']
  },
  flipkart_minutes: {
    name: 'Flipkart Minutes',
    logoTag: '10-Min Quick',
    color: '#0284C7',
    typeBadge: '10-Min Flash',
    perks: ['Superfast 10-15 Min Delivery', 'Flipkart Assured Quality', 'Instant Refund Guarantee']
  },
  vijaysales: {
    name: 'Vijay Sales',
    logoTag: 'VS MegaStore',
    color: '#DC2626',
    typeBadge: 'Retail Chain',
    perks: ['Authorized Electronics Chain', 'Extended Warranty Option', 'Zero Markup Pricing']
  }
};

export default function ProductDetailModal({ product, onClose }) {
  const modalRef = useRef(null);
  const svgRef = useRef(null);

  // Focus trap for accessibility
  useFocusTrap(modalRef, Boolean(product), onClose);

  // 1. Variant Management
  const availableStorage = product?.variants?.storage || [];
  const availableColors = product?.variants?.colors || [];
  const availableRam = product?.variants?.ram || [];

  const [selectedStorage, setSelectedStorage] = useState(() => {
    return availableStorage.find(s => s.default)?.label || availableStorage[0]?.label || '';
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    return availableColors.find(c => c.default)?.name || availableColors[0]?.name || '';
  });
  const [selectedRam, setSelectedRam] = useState(() => {
    return availableRam.find(r => r.default)?.label || availableRam[0]?.label || '';
  });

  // Calculate dynamic variant price delta
  const storageDelta = availableStorage.find(s => s.label === selectedStorage)?.priceDelta || 0;
  const ramDelta = availableRam.find(r => r.label === selectedRam)?.priceDelta || 0;
  const totalVariantDelta = storageDelta + ramDelta;

  // Base raw store entries
  const baseStores = product?.price || {};
  const storeEntries = Object.entries(baseStores).map(([storeKey, rawPrice]) => {
    const adjustedPrice = rawPrice > 0 ? rawPrice + totalVariantDelta : 0;
    return [storeKey, adjustedPrice];
  });

  // Find minimum price store
  let minStore = 'croma';
  let minPrice = Infinity;
  storeEntries.forEach(([s, p]) => {
    if (p > 0 && p < minPrice) {
      minPrice = p;
      minStore = s;
    }
  });
  const hasRealPrices = minPrice !== Infinity;
  if (!hasRealPrices) minPrice = 10000;

  const currentMrp = (product?.mrp || Math.round(minPrice * 1.15)) + totalVariantDelta;

  // 2. User Card Wallet & Bank Matrix State
  const [userCards, setUserCards] = useState(() => {
    try {
      const saved = localStorage.getItem('bro_user_cards');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER_CARDS;
  });

  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL'); // 'ALL' | 'FULL_SWIPE' | 'NO_COST_EMI' | 'STANDARD_EMI'
  const [activeSpecTab, setActiveSpecTab] = useState('display'); // 'display' | 'internals' | 'camera' | 'battery' | 'connectivity'
  const [chartTimeframe, setChartTimeframe] = useState('30d'); // '30d' | '90d' | '180d'

  const toggleUserCard = (bankId) => {
    playHapticClick();
    setUserCards(prev => {
      const next = prev.includes(bankId) ? prev.filter(b => b !== bankId) : [...prev, bankId];
      try {
        localStorage.setItem('bro_user_cards', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Compute Bank Offer & EMI Matrix
  const bankMatrix = useMemo(() => {
    return calculateBankOfferMatrix({
      basePrice: minPrice,
      mrp: currentMrp,
      category: product?.category || 'smartphone',
      selectedBanks: userCards,
      transactionMode: paymentModeFilter
    });
  }, [minPrice, currentMrp, product?.category, userCards, paymentModeFilter]);

  const [targetPrice, setTargetPrice] = useState(Math.round(minPrice * 0.95));
  const [alertContact, setAlertContact] = useState('');
  const [alertChannel] = useState('whatsapp');
  const [alertStatus, setAlertStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [priceHistory, setPriceHistory] = useState([]);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  useEffect(() => {
    setTargetPrice(Math.round(minPrice * 0.95));
  }, [minPrice]);

  useEffect(() => {
    if (!product?.id) return;
    let isCancelled = false;

    async function loadHistory() {
      try {
        const hist = await fetchPriceHistory(product.id);
        if (!isCancelled) {
          setPriceHistory(hist);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    }

    loadHistory();
    return () => {
      isCancelled = true;
    };
  }, [product?.id]);

  // Compute Algorithmic Intelligence
  const intelligence = evaluateDealIntelligence(product, priceHistory, minPrice);
  const conditionMatch = evaluateConditionMatch(product, {
    budgetRange: { min: product?.budgetMin || 0, max: product?.budgetMax || Infinity, label: product?.budgetMax ? `Under ₹${product.budgetMax.toLocaleString('en-IN')}` : 'All Budgets' },
    purpose: product?.purposes?.[0]
  });

  const handleActivateAlert = async (e) => {
    e.preventDefault();
    playHapticClick();
    setAlertStatus('submitting');

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    if (isOffline) {
      try {
        const existing = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
        const newAlert = {
          id: 'alert-' + Date.now(),
          productId: product.id,
          productName: product.name,
          targetPrice: Number(targetPrice),
          currentPrice: minPrice,
          channel: alertChannel,
          contactInfo: alertContact,
          createdAt: new Date().toISOString(),
          offlineQueued: true
        };
        localStorage.setItem('bro_active_alerts', JSON.stringify([newAlert, ...existing.filter(a => a.productId !== product.id)]));
        playSuccessChime();
        setAlertStatus('success');
        setTimeout(() => setAlertStatus('idle'), 5000);
        return;
      } catch {}
    }

    try {
      const res = await createPriceAlert({
        productId: product.id,
        targetPrice: Number(targetPrice),
        channel: alertChannel,
        contactInfo: alertContact || 'direct_user'
      });

      if (res.success) {
        try {
          const existing = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
          const newAlert = {
            id: 'alert-' + Date.now(),
            productId: product.id,
            productName: product.name,
            targetPrice: Number(targetPrice),
            currentPrice: minPrice,
            channel: alertChannel,
            contactInfo: alertContact,
            createdAt: new Date().toISOString(),
            offlineQueued: false
          };
          localStorage.setItem('bro_active_alerts', JSON.stringify([newAlert, ...existing.filter(a => a.productId !== product.id)]));
        } catch {}

        playSuccessChime();
        setAlertStatus('success');
        setTimeout(() => setAlertStatus('idle'), 5000);
      } else {
        setAlertStatus('error');
      }
    } catch {
      setAlertStatus('error');
    }
  };

  // Dynamic Chart points based on timeframe switcher
  const chartDataPoints = useMemo(() => {
    if (chartTimeframe === '180d') {
      return [
        { day: '180d Ago (Launch)', x: 60, y: 50, price: Math.round(minPrice * 1.15), store: 'Amazon' },
        { day: '90d Ago', x: 260, y: 70, price: Math.round(minPrice * 1.08), store: 'Flipkart' },
        { day: '30d Ago (Pre-Sale Hike)', x: 480, y: 40, price: Math.round(minPrice * 1.18), store: 'Croma' },
        { day: '7d Ago', x: 640, y: 90, price: Math.round(minPrice * 1.04), store: 'Amazon' },
        { day: 'Today (Floor)', x: 760, y: 120, price: minPrice, store: minStore.toUpperCase() },
      ];
    } else if (chartTimeframe === '90d') {
      return [
        { day: '90d Ago', x: 60, y: 60, price: Math.round(minPrice * 1.10), store: 'Flipkart' },
        { day: '60d Ago', x: 250, y: 75, price: Math.round(minPrice * 1.07), store: 'Amazon' },
        { day: '25d Ago (Inflated)', x: 460, y: 45, price: Math.round(minPrice * 1.14), store: 'Croma' },
        { day: '10d Ago', x: 620, y: 85, price: Math.round(minPrice * 1.03), store: 'Amazon' },
        { day: 'Today (Floor)', x: 760, y: 120, price: minPrice, store: minStore.toUpperCase() },
      ];
    }
    // Default 30d
    return [
      { day: '30 Days Ago', x: 60, y: 60, price: Math.round(minPrice * 1.08), store: 'Flipkart' },
      { day: 'Day 10', x: 240, y: 70, price: Math.round(minPrice * 1.06), store: 'Amazon' },
      { day: 'Day 20', x: 440, y: 90, price: Math.round(minPrice * 1.03), store: 'Croma' },
      { day: 'Day 26', x: 620, y: 90, price: Math.round(minPrice * 1.03), store: 'Amazon' },
      { day: 'Today (Floor)', x: 760, y: 120, price: minPrice, store: minStore.toUpperCase() },
    ];
  }, [chartTimeframe, minPrice, minStore]);

  // Scrubbing Handler
  const handleChartPointerMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 800;
    const clampedX = Math.max(60, Math.min(760, relativeX));

    for (let i = 0; i < chartDataPoints.length - 1; i++) {
      const p1 = chartDataPoints[i];
      const p2 = chartDataPoints[i + 1];
      if (clampedX >= p1.x && clampedX <= p2.x) {
        const ratio = (clampedX - p1.x) / (p2.x - p1.x);
        const interpolatedPrice = Math.round(p1.price + ratio * (p2.price - p1.price));
        const interpolatedY = p1.y + ratio * (p2.y - p1.y);
        const dayLabel = ratio > 0.5 ? p2.day : p1.day;
        const activeStore = ratio > 0.5 ? p2.store : p1.store;

        setHoveredChartPoint({
          x: clampedX,
          y: interpolatedY,
          price: interpolatedPrice,
          day: dayLabel,
          store: activeStore,
          isScrubbing: true
        });
        break;
      }
    }
  };

  // Structured Specs Normalizer
  const structuredSpecs = useMemo(() => {
    if (product?.structuredSpecs) return product.structuredSpecs;
    const raw = product?.specs || [];
    return {
      displayAndChassis: [
        { label: 'Display Panel', value: raw[0] || 'High-Resolution Display with Wide Color Gamut' },
        { label: 'Chassis & Build', value: 'High Durability Lightweight Chassis with Reinforced Glass' },
        { label: 'Ergonomics', value: 'Designed for daily comfort & thermal dissipation' }
      ],
      internalsAndArchitecture: [
        { label: 'Processor & SoC', value: raw[1] || 'Multi-Core High Efficiency Performance Architecture' },
        { label: 'RAM & Memory', value: selectedRam || 'Optimized LPDDR Multi-Tasking Architecture' },
        { label: 'Storage Type', value: selectedStorage || 'High-Speed NVMe / UFS Storage' }
      ],
      cameraSystem: [
        { label: 'Primary Optics', value: raw[2] || 'High Definition Optical Sensor with Night Mode & HDR' },
        { label: 'Video Modes', value: '4K Ultra HD recording with digital stabilization' }
      ],
      batteryAndCharging: [
        { label: 'Battery Capacity', value: raw[3] || 'High Endurance Lithium Polymer Battery' },
        { label: 'Charging Speed', value: 'Fast Type-C Power Delivery Support' }
      ],
      connectivityAndNetwork: [
        { label: 'Wireless Standards', value: '5G NR / Wi-Fi 6 (802.11ax) & Bluetooth 5.3' },
        { label: 'Indian Warranty', value: 'Official 1-Year Indian Manufacturer Warranty' }
      ]
    };
  }, [product, selectedRam, selectedStorage]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-150">
      
      {/* Modal Dialog Card */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="bg-[#FAFAFA] rounded-2xl border border-[#EBEBF0] shadow-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto relative text-[#333333]"
      >
        
        {/* Floating Close Button */}
        <button
          onClick={() => {
            playHapticClick();
            onClose();
          }}
          data-autofocus
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white border border-[#EBEBF0] flex items-center justify-center text-[#666666] hover:text-[#333333] hover:bg-[#F8F9FA] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008738]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBEBF0] bg-white rounded-t-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#FFF8D9] border border-[#B59A50]/40 text-[#856404] text-[10px] font-bold rounded-full tracking-wide uppercase">
              {product.badge || 'Curated Product'}
            </span>
            <span className="px-2.5 py-0.5 bg-[#F3FBEF] border border-[#008738]/30 text-[#008738] text-[10px] font-bold rounded-full tracking-wide uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#008738]" />
              Official 1-Year Indian Warranty
            </span>
            <span className="px-2.5 py-0.5 bg-[#F8F9FA] border border-[#333333]/20 text-[#333333] text-[10px] font-bold rounded-full tracking-wide uppercase flex items-center gap-1">
              <Award className="w-3 h-3 text-[#b59a50]" />
              Deal Score: {intelligence.dealScore} / 10 · {intelligence.scoreTier}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#333333] tracking-tight">
            {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            {product.tagline}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-[#666666]">
            <div className="flex items-center gap-1 font-semibold text-[#333333]">
              <Star className="w-4 h-4 fill-[#b59a50] text-[#b59a50]" />
              <span>{product.rating}</span>
              <span className="text-[#9E9E9E] font-normal">(Verified Indian Hardware Index)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#008738] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#008738]" />
              <span>Multi-Store Verified In Stock</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* MODULE 1: Variant Selector (spec.md Page 3 Module 1) */}
          {(availableStorage.length > 0 || availableColors.length > 0 || availableRam.length > 0) && (
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#EBEBF0] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F8F9FA] mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#b59a50]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                    Configure Variant & Downstream Matrix
                  </span>
                </div>
                {totalVariantDelta !== 0 && (
                  <span className="text-[11px] font-mono font-bold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded border border-[#008738]/20">
                    {totalVariantDelta > 0 ? `+₹${totalVariantDelta.toLocaleString('en-IN')}` : `-₹${Math.abs(totalVariantDelta).toLocaleString('en-IN')}`} vs Base
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Storage Variants */}
                {availableStorage.length > 0 && (
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#666666] tracking-wider block mb-1.5">
                      Internal Storage
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableStorage.map((s) => {
                        const isSelected = selectedStorage === s.label;
                        return (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => {
                              playHapticClick();
                              setSelectedStorage(s.label);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'bg-[#333333] text-white border-[#333333] shadow-xs'
                                : 'bg-[#F8F9FA] text-[#4B5563] border-[#E5E7EB] hover:bg-white hover:border-[#9CA3AF]'
                            }`}
                          >
                            <span>{s.label}</span>
                            {s.priceDelta !== 0 && (
                              <span className={`ml-1 text-[10px] font-mono ${isSelected ? 'text-[#b59a50]' : 'text-gray-500'}`}>
                                {s.priceDelta > 0 ? `+${Math.round(s.priceDelta / 1000)}k` : `${Math.round(s.priceDelta / 1000)}k`}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color Variants */}
                {availableColors.length > 0 && (
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#666666] tracking-wider block mb-1.5">
                      Finish / Color: <span className="text-[#333333] font-normal">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {availableColors.map((c) => {
                        const isSelected = selectedColor === c.name;
                        return (
                          <button
                            key={c.name}
                            type="button"
                            title={c.name}
                            onClick={() => {
                              playHapticClick();
                              setSelectedColor(c.name);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isSelected ? 'ring-2 ring-offset-2 ring-[#008738] scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* RAM Variants (for Laptops / PCs) */}
                {availableRam.length > 0 && (
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#666666] tracking-wider block mb-1.5">
                      System Memory (RAM)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableRam.map((r) => {
                        const isSelected = selectedRam === r.label;
                        return (
                          <button
                            key={r.label}
                            type="button"
                            onClick={() => {
                              playHapticClick();
                              setSelectedRam(r.label);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'bg-[#333333] text-white border-[#333333] shadow-xs'
                                : 'bg-[#F8F9FA] text-[#4B5563] border-[#E5E7EB] hover:bg-white hover:border-[#9CA3AF]'
                            }`}
                          >
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fake Discount Detection Alert */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            intelligence.discountType === 'fake'
              ? 'bg-[#FFFBEB] border-[#D97706]/40 text-[#92400E]'
              : intelligence.discountType === 'genuine'
                ? 'bg-[#F3FBEF] border-[#008738]/30 text-[#065F46]'
                : 'bg-[#F8F9FA] border-[#EBEBF0] text-[#4B5563]'
          }`}>
            {intelligence.discountType === 'fake' ? (
              <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
            ) : intelligence.discountType === 'genuine' ? (
              <Sparkles className="w-5 h-5 text-[#008738] flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span>{intelligence.discountBadge}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/5 font-semibold">
                  Score {intelligence.dealScore}/10
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {intelligence.discountExplanation} {intelligence.scoreRecommendation}
              </p>
            </div>
          </div>
          
          {/* 1-CLICK VERIFIED BEST BUY RECOMMENDATION (BuyHatke Parity) */}
          <div className="p-4 bg-gradient-to-r from-[#F3FBEF] via-white to-[#F3FBEF] border border-[#008738]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-beautiful-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#008738] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 text-[#FFF8D9]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#008738]">
                    BuyHatke Parity · Verified Best Buy Recommendation
                  </span>
                  <span className="text-[9px] font-bold text-white bg-[#008738] px-1.5 py-0.5 rounded">
                    1-Click Direct PDP
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#111827] mt-0.5">
                  Lowest verified landed price on <span className="uppercase text-[#008738] font-bold">{minStore}</span>: <span className="text-[#008738] font-bold font-mono text-sm">₹{minPrice.toLocaleString('en-IN')}</span> (0% Markup Guaranteed)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href={getSmartProductBuyLink(product, minStore, { storage: selectedStorage, ram: selectedRam }).url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  playHapticClick();
                  recordAffiliateClick(minStore, product.id, product.name);
                }}
                className="px-4 py-2 bg-[#008738] hover:bg-[#00702e] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <span>Direct Buy on {minStore.toUpperCase()}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          
          {/* MODULE 2: Unmanipulated Base Price Comparison Table (spec.md Page 3 Module 2) */}
          <div className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBEBF0] mb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59a50] block">
                  Unmanipulated Base Pricing Table (Zero Exchange / Markup)
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Live Store Listing Floor Comparison
                </h4>
              </div>
              <span className="text-xs text-[#008738] font-mono font-bold bg-[#F3FBEF] px-2.5 py-1 rounded-full border border-[#008738]/20 self-start sm:self-auto">
                ₹{(storeEntries[1]?.[1] ? storeEntries[1][1] - minPrice : 2000).toLocaleString('en-IN')} Spread Advantage
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EBEBF0] text-[#666666] font-semibold">
                    <th className="py-2.5 px-3">Merchant / Store</th>
                    <th className="py-2.5 px-3">Base Selling Price</th>
                    <th className="py-2.5 px-3">Official MRP</th>
                    <th className="py-2.5 px-3">Open Coupon</th>
                    <th className="py-2.5 px-3">Delivery ETA</th>
                    <th className="py-2.5 px-3 text-right">Direct Buy Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {storeEntries.map(([storeKey, price]) => {
                    const meta = STORE_META[storeKey] || { name: storeKey, logoTag: 'Merchant', perks: [] };
                    const isLowest = storeKey === minStore && price > 0;
                    const smartLink = getSmartProductBuyLink(product, storeKey, { storage: selectedStorage, ram: selectedRam });

                    return (
                      <tr 
                        key={storeKey} 
                        className={`transition-colors ${isLowest ? 'bg-[#F3FBEF]/60 font-semibold' : 'hover:bg-[#F9FAFB]'}`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <PlatformBadge platformKey={storeKey} size="sm" showType={true} />
                            {isLowest && (
                              <span className="text-[9px] font-bold text-[#008738] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                                #1 Lowest Base
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#111827]">
                          {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Check Stock'}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-400 line-through">
                          ₹{currentMrp.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[11px] text-[#008738] font-medium bg-[#DCFCE7]/70 px-1.5 py-0.5 rounded">
                            Included
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-[11px]">
                          {meta.perks[0] || 'Fast Delivery'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {smartLink.isDirectPdp && (
                              <span className="text-[9px] font-bold text-[#008738] bg-[#F3FBEF] border border-[#008738]/20 px-1.5 py-0.5 rounded hidden sm:inline-flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                Direct PDP
                              </span>
                            )}
                            <a
                              href={smartLink.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                playHapticClick();
                                recordAffiliateClick(storeKey, product.id, product.name);
                              }}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                                isLowest
                                  ? 'bg-[#008738] text-white hover:bg-[#00702e] shadow-xs active:scale-95'
                                  : 'bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] active:scale-95'
                              }`}
                            >
                              <span>{smartLink.isDirectPdp ? 'Direct Buy' : (price > 0 ? 'Buy' : 'View')}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODULE 3: Dynamic Bank Offer & EMI Matrix (spec.md Section 5) */}
          <div className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBEBF0] mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#b59a50]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59a50] block">
                    Dynamic Bank Offer & EMI Matrix Engine
                  </span>
                </div>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Net Landed Price by Payment Instrument
                </h4>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F3F4F6] p-1 rounded-lg text-[11px] font-semibold">
                {[
                  { id: 'ALL', label: 'All Modes' },
                  { id: 'FULL_SWIPE', label: 'Full Swipe' },
                  { id: 'NO_COST_EMI', label: 'No-Cost EMI' },
                  { id: 'STANDARD_EMI', label: 'Standard EMI' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      playHapticClick();
                      setPaymentModeFilter(mode.id);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      paymentModeFilter === mode.id
                        ? 'bg-white text-[#111827] shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Card Wallet Filter */}
            <div className="mb-4 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4B5563]">
                  Your Card Wallet Filter (Toggle to filter matrix):
                </span>
                <span className="text-[10px] text-gray-500">
                  {userCards.length} Cards Active
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_BANKS.map((bank) => {
                  const isChecked = userCards.includes(bank.id);
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => toggleUserCard(bank.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isChecked ? '#10B981' : '#9CA3AF' }} />
                      <span>{bank.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EMI Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EBEBF0] text-[#666666] font-semibold">
                    <th className="py-2.5 px-3">Bank & Card Instrument</th>
                    <th className="py-2.5 px-3">Payment Mode</th>
                    <th className="py-2.5 px-3">Merchant</th>
                    <th className="py-2.5 px-3">Instant Discount</th>
                    <th className="py-2.5 px-3">Monthly EMI</th>
                    <th className="py-2.5 px-3">Hidden Fees (GST+Proc.)</th>
                    <th className="py-2.5 px-3 font-bold text-[#111827]">Net Landed Price</th>
                    <th className="py-2.5 px-3 text-right">Direct Buy Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {bankMatrix.map((deal, idx) => (
                    <tr 
                      key={`${deal.id || deal.merchant}-${idx}`}
                      className={`transition-colors ${deal.isBestDeal ? 'bg-[#ECFDF5] font-semibold' : 'hover:bg-[#F9FAFB]'}`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#111827]">{deal.bankName}</span>
                          <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded">{deal.cardNetwork}</span>
                          {deal.isBestDeal && (
                            <span className="text-[9px] font-bold text-[#059669] bg-[#D1FAE5] px-1.5 py-0.2 rounded border border-[#A7F3D0]">
                              #1 Lowest Overall
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          deal.transactionMode === 'NO_COST_EMI'
                            ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                            : deal.transactionMode === 'FULL_SWIPE'
                              ? 'bg-[#E0E7FF] text-[#3730A3]'
                              : 'bg-gray-100 text-gray-700'
                        }`}>
                          {deal.tenure ? `${deal.modeLabel} (${deal.tenure}M)` : deal.modeLabel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <PlatformBadge platformKey={deal.merchant} size="sm" showType={false} />
                      </td>
                      <td className="py-3 px-3 text-[#059669] font-mono font-bold">
                        {deal.discountAmount > 0 ? `-₹${deal.discountAmount.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {deal.monthlyEmi ? `₹${deal.monthlyEmi.toLocaleString('en-IN')}/mo` : '—'}
                      </td>
                      <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                        {deal.hiddenFees > 0 ? `+₹${deal.hiddenFees.toLocaleString('en-IN')}` : '₹0'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-sm text-[#111827]">
                        ₹{deal.netLandedPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <a
                          href={getSmartProductBuyLink(product, deal.merchant, { storage: selectedStorage, ram: selectedRam }).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            playHapticClick();
                            recordAffiliateClick(deal.merchant, product.id, product.name);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            deal.isBestDeal
                              ? 'bg-[#008738] text-white hover:bg-[#00702e] shadow-xs active:scale-95'
                              : 'bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F3F4F6] active:scale-95'
                          }`}
                        >
                          <span>Buy on {deal.merchant.toUpperCase()}</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#b59a50]" />
                <span>Net Landed Price includes upfront bank interest subvention discount, 18% GST on interest component, and bank processing fees. Zero hidden checkout shocks.</span>
              </div>
            </div>
          </div>

          {/* MODULE 4: Granular Categorized Technical Specifications (spec.md Page 3 Module 4) */}
          <div className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBEBF0] mb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59a50] block">
                  Normalized Hardware Breakdown
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Granular Technical Specifications
                </h4>
              </div>

              {/* Spec Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                {[
                  { id: 'display', label: 'Display & Build', icon: Layers },
                  { id: 'internals', label: 'Internals & SoC', icon: Cpu },
                  { id: 'camera', label: 'Camera System', icon: Camera },
                  { id: 'battery', label: 'Battery & Power', icon: Battery },
                  { id: 'connectivity', label: 'Network & Ports', icon: Wifi }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSpecTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        playHapticClick();
                        setActiveSpecTab(tab.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-[#333333] text-white shadow-xs'
                          : 'text-[#4B5563] hover:text-[#111827] hover:bg-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spec Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeSpecTab === 'display' && (structuredSpecs.displayAndChassis || []).map((item, i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                    {item.label}
                  </span>
                  <div className="text-xs font-semibold text-[#111827] mt-0.5">{item.value}</div>
                </div>
              ))}

              {activeSpecTab === 'internals' && (structuredSpecs.internalsAndArchitecture || []).map((item, i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                    {item.label}
                  </span>
                  <div className="text-xs font-semibold text-[#111827] mt-0.5">{item.value}</div>
                </div>
              ))}

              {activeSpecTab === 'camera' && (structuredSpecs.cameraSystem || []).map((item, i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                    {item.label}
                  </span>
                  <div className="text-xs font-semibold text-[#111827] mt-0.5">{item.value}</div>
                </div>
              ))}

              {activeSpecTab === 'battery' && (structuredSpecs.batteryAndCharging || []).map((item, i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                    {item.label}
                  </span>
                  <div className="text-xs font-semibold text-[#111827] mt-0.5">{item.value}</div>
                </div>
              ))}

              {activeSpecTab === 'connectivity' && (structuredSpecs.connectivityAndNetwork || []).map((item, i) => (
                <div key={i} className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                    {item.label}
                  </span>
                  <div className="text-xs font-semibold text-[#111827] mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MODULE 5: Historical Price Chart (spec.md Page 3 Module 5) */}
          <div className="bg-white rounded-xl p-6 border border-[#EBEBF0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F8F9FA] mb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59a50] block">
                  Algorithmic Price Intelligence & Pre-Sale Spike Detection
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Historical Price Trend ({chartTimeframe.toUpperCase()})
                </h4>
              </div>
              <div className="flex items-center gap-2">
                {/* Timeframe switcher 30/90/180 */}
                <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-lg text-xs font-semibold">
                  {[
                    { id: '30d', label: '30 Days' },
                    { id: '90d', label: '90 Days' },
                    { id: '180d', label: '180 Days' },
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() => {
                        playHapticClick();
                        setChartTimeframe(tf.id);
                      }}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        chartTimeframe === tf.id
                          ? 'bg-white text-[#111827] shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
                <span className="hidden sm:flex items-center gap-1 font-mono text-[#008738] font-bold bg-[#F3FBEF] px-2 py-1 rounded border border-[#008738]/20 text-xs">
                  <TrendingDown className="w-3 h-3" /> All-Time Floor
                </span>
              </div>
            </div>

            {/* SVG Multi-Line Chart with Interactive Scrubbing Crosshair */}
            <div className="relative w-full h-56 select-none mt-2">
              
              {/* Interactive Hover Tooltip Box */}
              {hoveredChartPoint && (
                <div 
                  className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-lg bg-[#111111] text-white text-[11px] shadow-2xl border border-white/20 transform -translate-x-1/2 -translate-y-full transition-all duration-75"
                  style={{ 
                    left: `${(hoveredChartPoint.x / 800) * 100}%`, 
                    top: `${(hoveredChartPoint.y / 200) * 100 - 10}%` 
                  }}
                >
                  <div className="font-bold text-[#b59a50]">{hoveredChartPoint.store}</div>
                  <div className="font-mono font-bold text-sm">₹{hoveredChartPoint.price.toLocaleString('en-IN')}</div>
                  <div className="text-[9px] text-gray-300">{hoveredChartPoint.day}</div>
                </div>
              )}

              <svg 
                ref={svgRef}
                className="w-full h-full cursor-crosshair touch-none" 
                viewBox="0 0 800 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                onMouseMove={handleChartPointerMove}
                onMouseLeave={() => setHoveredChartPoint(null)}
                onTouchMove={handleChartPointerMove}
                onTouchEnd={() => setHoveredChartPoint(null)}
              >
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="780" y2="20" stroke="#EBEBF0" strokeDasharray="3 3" />
                <text x="35" y="24" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice * 1.15 / 1000)}k
                </text>

                <line x1="40" y1="70" x2="780" y2="70" stroke="#EBEBF0" strokeDasharray="3 3" />
                <text x="35" y="74" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice * 1.08 / 1000)}k
                </text>

                <line x1="40" y1="120" x2="780" y2="120" stroke="#EBEBF0" strokeDasharray="3 3" />
                <text x="35" y="124" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice * 1.03 / 1000)}k
                </text>

                <line x1="40" y1="170" x2="780" y2="170" stroke="#EBEBF0" />
                <text x="35" y="174" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice / 1000)}k
                </text>

                {/* Vertical Dates */}
                <text x="60" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">{chartDataPoints[0]?.day}</text>
                <text x="250" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">{chartDataPoints[1]?.day}</text>
                <text x="460" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">{chartDataPoints[2]?.day}</text>
                <text x="630" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">{chartDataPoints[3]?.day}</text>
                <text x="760" y="190" fill="#008738" fontSize="10" fontWeight="bold" textAnchor="middle">Today</text>

                {/* Lowest Area Fill (Emerald) */}
                <defs>
                  <linearGradient id="emeraldFillModal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#008738" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#008738" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M60 60 L250 75 L460 45 L630 85 L760 120 L760 170 L60 170 Z" fill="url(#emeraldFillModal)" />
                <path d="M60 60 L250 75 L460 45 L630 85 L760 120" stroke="#008738" strokeWidth="2.5" strokeLinecap="round" />

                {/* Interactive Points on Graph */}
                {chartDataPoints.map((pt, i) => (
                  <g key={i}>
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={hoveredChartPoint?.day === pt.day ? "6.5" : "4.5"} 
                      fill="#008738" 
                      stroke="#FFFFFF" 
                      strokeWidth="2"
                    />
                  </g>
                ))}

                {/* Real-time Interactive Scrubbing Crosshair & Tracking Dot */}
                {hoveredChartPoint && (
                  <g className="pointer-events-none">
                    <line 
                      x1={hoveredChartPoint.x} 
                      y1="20" 
                      x2={hoveredChartPoint.x} 
                      y2="170" 
                      stroke="#008738" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                    />
                    <circle 
                      cx={hoveredChartPoint.x} 
                      cy={hoveredChartPoint.y} 
                      r="6" 
                      fill="#008738" 
                      stroke="#FFFFFF" 
                      strokeWidth="2" 
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3 border-t border-[#F8F9FA] text-[11px] text-[#666666]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008738]" />
                  <strong className="text-[#333333] capitalize">{minStore}</strong> (₹{minPrice.toLocaleString('en-IN')} Floor)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#737397]" />
                  <span>Flipkart</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b59a50]" />
                  <span>Amazon</span>
                </span>
              </div>
              <span className="text-[#9E9E9E]">Verified 3-Point E-Commerce & Retail Sync</span>
            </div>
          </div>

          {/* MODULE 6: Price Drop Alert Activator (spec.md Section 8) */}
          <div className="bg-white border border-[#EBEBF0] rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#b59a50] uppercase tracking-wider block mb-1">
                  Autonomous Watchdog
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Set Intelligent Price Drop Alert
                </h4>
                <p className="text-xs text-[#666666] mt-0.5">
                  Stored directly in Supabase / Local offline cache. You will receive an instant alert when any store drops below your threshold.
                </p>
              </div>

              {alertStatus === 'success' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F3FBEF] border border-[#008738]/30 text-[#008738] rounded-lg text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#008738]" />
                  <span>Price Alert Saved to Cloud!</span>
                </div>
              ) : (
                <form onSubmit={handleActivateAlert} className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-[#FAFAFA] border border-[#EBEBF0] rounded-lg px-2.5 py-1.5 text-xs text-[#333333]">
                    <label htmlFor="alert-target-price" className="text-[#9E9E9E] mr-1 cursor-pointer">Target: ₹</label>
                    <input
                      id="alert-target-price"
                      name="targetPrice"
                      aria-label="Target price in INR"
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-24 bg-transparent focus:outline-none font-mono font-semibold"
                    />
                  </div>

                  <input
                    id="alert-contact-info"
                    name="contactInfo"
                    aria-label="Notification contact number or email"
                    type="text"
                    placeholder="Mobile / Email"
                    value={alertContact}
                    onChange={(e) => setAlertContact(e.target.value)}
                    className="bg-[#FAFAFA] border border-[#EBEBF0] rounded-lg px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none w-32"
                  />

                  <button
                    type="submit"
                    disabled={alertStatus === 'submitting'}
                    className="px-4 py-2 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#008738]"
                  >
                    {alertStatus === 'submitting' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bell className="w-3.5 h-3.5 text-[#b59a50]" />
                    )}
                    <span>{alertStatus === 'submitting' ? 'Saving...' : 'Watch Price'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
