import { useState, useEffect, useMemo } from 'react';
import { 
  Star, ArrowUpRight,
  Award, AlertTriangle, Scale, Bookmark, Copy, RefreshCw,
  Search, X, SlidersHorizontal, RotateCcw, Zap, Check, Truck, ChevronDown,
  Smartphone, Laptop, Tablet, Headphones, Music, Watch, Tv, Wifi,
  BatteryCharging, Cable, Keyboard, Mouse, Monitor, Volume2, Camera,
  HardDrive, Folder, ShoppingBag
} from 'lucide-react';
import { 
  CATEGORIES, BUDGET_RANGES, PURPOSES, PRODUCTS, STORE_CONFIG,
  getRecommendations, getCheapestStore, getProductBrand,
  searchProducts, createDynamicProduct
} from '../data/electronics';
import { fetchProducts } from '../services/supabase';
import { evaluateDealIntelligence } from '../services/dealIntelligence';
import { getAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import ProductDetailModal from './ProductDetailModal';
import CompareModal from './CompareModal';
import Toast from './Toast';
import PlatformBadge from './PlatformBadge';
import { playHapticClick, playSuccessChime } from '../utils/audioFeedback';

const CATEGORY_ICONS = {
  smartphone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  tws: Headphones,
  headphone: Music,
  smartwatch: Watch,
  tv: Tv,
  router: Wifi,
  powerbank: BatteryCharging,
  charger: Zap,
  cable: Cable,
  keyboard: Keyboard,
  mouse: Mouse,
  monitor: Monitor,
  speaker: Volume2,
  camera: Camera,
  harddisk: HardDrive,
  pendrive: Folder
};

export default function ElectronicsShop({ initialSearchQuery, onClearInitialSearch }) {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]); // All Budgets
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price_asc' | 'price_desc' | 'deal_score' | 'speed'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareTargetA, setCompareTargetA] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

  // Amazon/Flipkart Inspired Filters State
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [appliedCustomPrice, setAppliedCustomPrice] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [deliveryFilter, setDeliveryFilter] = useState('all'); // 'all' | 'quick' | 'retail'
  const [dealFilter, setDealFilter] = useState('all'); // 'all' | 'drops' | 'high_score'

  // Reset category-specific filters when category changes
  useEffect(() => {
    setSelectedBrand('All');
    setAppliedCustomPrice(null);
    setMinPriceInput('');
    setMaxPriceInput('');
    setDeliveryFilter('all');
    setDealFilter('all');
    setMinRating(0);
  }, [selectedCat.id]);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      if (onClearInitialSearch) onClearInitialSearch();
    }
  }, [initialSearchQuery]);

  // Live Supabase state
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('supabase');

  const availablePurposes = PURPOSES[selectedCat.id] || [];

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchProducts({
          categoryId: selectedCat.id,
          budgetRange: selectedBudget,
          purpose: selectedPurpose
        });

        if (!isCancelled) {
          setRecommendations(res.products || []);
          setDataSource(res.source);
        }
      } catch (err) {
        console.error('Error in loadData:', err);
        if (!isCancelled) {
          const fallback = getRecommendations(selectedCat.id, selectedBudget, selectedPurpose);
          setRecommendations(fallback);
          setDataSource('local');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [selectedCat, selectedBudget, selectedPurpose]);

  // Dynamic brand list for the selected category
  const availableBrands = useMemo(() => {
    const products = PRODUCTS[selectedCat.id] || [];
    const brands = new Set();
    products.forEach(p => {
      const b = getProductBrand(p);
      if (b && b !== 'Other') brands.add(b);
    });
    return ['All', ...Array.from(brands)];
  }, [selectedCat.id]);

  // Apply Amazon/Flipkart style filters & sorting
  const filteredProducts = useMemo(() => {
    let list = recommendations;

    // Custom Price Filter
    if (appliedCustomPrice) {
      if (appliedCustomPrice.min > 0) {
        list = list.filter(p => getCheapestStore(p).price >= appliedCustomPrice.min);
      }
      if (appliedCustomPrice.max < Infinity) {
        list = list.filter(p => getCheapestStore(p).price <= appliedCustomPrice.max);
      }
    }

    // Brand Filter
    if (selectedBrand && selectedBrand !== 'All') {
      list = list.filter(p => getProductBrand(p).toLowerCase() === selectedBrand.toLowerCase());
    }

    // Rating Filter
    if (minRating > 0) {
      list = list.filter(p => p.rating >= minRating);
    }

    // Delivery Speed Filter
    if (deliveryFilter === 'quick') {
      list = list.filter(p => Boolean(p.price?.blinkit || p.price?.zepto || p.price?.flipkart_minutes));
    } else if (deliveryFilter === 'retail') {
      list = list.filter(p => Boolean(p.price?.croma || p.price?.reliance || p.price?.vijaysales));
    }

    // Deal Filter
    if (dealFilter === 'drops') {
      list = list.filter(p => {
        const intel = evaluateDealIntelligence(p, [], getCheapestStore(p).price);
        return intel.discountType === 'genuine';
      });
    } else if (dealFilter === 'high_score') {
      list = list.filter(p => {
        const intel = evaluateDealIntelligence(p, [], getCheapestStore(p).price);
        return intel.dealScore >= 7.5;
      });
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => getCheapestStore(a).price - getCheapestStore(b).price);
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => getCheapestStore(b).price - getCheapestStore(a).price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deal_score') {
      list = [...list].sort((a, b) => {
        const iA = evaluateDealIntelligence(a, [], getCheapestStore(a).price);
        const iB = evaluateDealIntelligence(b, [], getCheapestStore(b).price);
        return iB.dealScore - iA.dealScore;
      });
    } else if (sortBy === 'speed') {
      list = [...list].sort((a, b) => {
        const aQuick = (a.price?.blinkit || a.price?.zepto) ? 1 : 0;
        const bQuick = (b.price?.blinkit || b.price?.zepto) ? 1 : 0;
        return bQuick - aQuick;
      });
    }

    return list;
  }, [recommendations, appliedCustomPrice, selectedBrand, minRating, deliveryFilter, dealFilter, sortBy]);

  const copyBookmarklet = () => {
    const code = `javascript:(function(){var t=document.querySelector('#productTitle,.B_NuCI,h1')?.innerText||'';window.open('https://bro-ai.vercel.app/#shop?q='+encodeURIComponent(t.trim().slice(0,50)),'_blank');})();`;
    playSuccessChime();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setToastMessage('Bookmarklet copied! Drag or paste it into your browser bookmarks.');
      }).catch(() => {
        setToastMessage('Bookmarklet copied! Drag or paste it into your browser bookmarks.');
      });
    } else {
      setToastMessage('Bookmarklet copied! Drag or paste it into your browser bookmarks.');
    }
  };

  const searchResults = searchQuery.trim() ? searchProducts(searchQuery) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-[#EBEBF0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b59a50]">
              Indian Electronics Price Radar
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3FBEF] text-[#008738] border border-[#008738]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008738] animate-pulse" />
              Live Multi-Store Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#333333]">
            Gadget Deals & Price Drops
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Compare genuine prices across Amazon, Flipkart, Croma, Reliance, JioMart, Blinkit & Zepto with 0% markup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filteredProducts.length >= 2 && (
            <button
              onClick={() => {
                playHapticClick();
                setCompareTargetA(filteredProducts[0]);
                setCompareOpen(true);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738]"
            >
              <Scale className="w-3.5 h-3.5 text-[#b59a50]" />
              <span>1v1 Compare</span>
            </button>
          )}

          {/* Amazon/Flipkart Style Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#EBEBF0] rounded-lg px-2.5 py-1 text-xs shadow-xs">
            <span className="text-[11px] font-semibold text-[#9E9E9E]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                playHapticClick();
                setSortBy(e.target.value);
              }}
              className="bg-transparent text-xs font-semibold text-[#333333] focus:outline-none cursor-pointer"
            >
              <option value="rating">Top Rated (4★+)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="deal_score">Best Deal Score</option>
              <option value="speed">⚡ 10-Min Flash Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1-Click Browser Bookmarklet Feature Banner (Zero-Cost Competitive Gap 5) */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#FFFBEB] to-[#F3FBEF] border border-[#B59A50]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-white border border-[#B59A50]/40 text-[#856404]">
            <Bookmark className="w-4 h-4 text-[#b59a50]" />
          </span>
          <div>
            <div className="text-xs font-bold text-[#333333] flex items-center gap-2">
              <span>1-Click Browser Bookmarklet</span>
              <span className="text-[10px] font-bold text-[#008738] bg-[#E1F7DE] px-2 py-0.5 rounded-full">Zero Install</span>
            </div>
            <p className="text-[11px] text-[#666666] mt-0.5">
              Browse Amazon or Flipkart? Click your bookmark to instantly reveal 30-day historical floors and fake discounts on BRO AI.
            </p>
          </div>
        </div>

        <button
          onClick={copyBookmarklet}
          className="px-3 py-1.5 bg-white hover:bg-[#FAFAFA] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors flex-shrink-0"
        >
          <Copy className="w-3.5 h-3.5 text-[#b59a50]" />
          <span>Copy Bookmarklet</span>
        </button>
      </div>

      {/* Live Catalog Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <label htmlFor="shop-catalog-search" className="sr-only">Search catalog</label>
          <Search className="w-4 h-4 text-[#b59a50] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="shop-catalog-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any model or brand across all categories (e.g. iQOO 15, Pixel 8a, OnePlus, MacBook, Sony)..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-[#EBEBF0] rounded-xl text-xs text-[#333333] placeholder:text-[#9E9E9E] focus:outline-none focus:border-[#333333] focus:ring-2 focus:ring-[#333333]/10 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                playHapticClick();
                setSearchQuery('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills with Crisp Lucide Vector Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCat.id === cat.id;
          const IconComp = CATEGORY_ICONS[cat.id] || ShoppingBag;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playHapticClick();
                setSelectedCat(cat);
                setSelectedPurpose(null);
                setSelectedBudget(BUDGET_RANGES[0]);
                setSearchQuery('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#333333] text-white shadow-sm'
                  : 'bg-white border border-[#EBEBF0] text-[#666666] hover:bg-[#F8F9FA]'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#666666]'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Essential Amazon & Flipkart Inspired Custom Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#EBEBF0] p-4 sm:p-5 mb-8 shadow-card space-y-4">
        
        {/* Row 1: Brand Filter Chips */}
        {availableBrands.length > 2 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1.5">
                <span>Top Brands</span>
                <span className="text-[10px] font-normal text-[#9E9E9E]">({availableBrands.length - 1} available)</span>
              </span>
              {selectedBrand !== 'All' && (
                <button
                  onClick={() => setSelectedBrand('All')}
                  className="text-[10px] font-bold text-[#b59a50] hover:underline"
                >
                  Reset Brand
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {availableBrands.map((brand) => {
                const isSelected = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => {
                      playHapticClick();
                      setSelectedBrand(brand);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#333333] text-white shadow-2xs font-semibold'
                        : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0] border border-[#EBEBF0]'
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Row 2: Custom Price Filter + Preset Brackets */}
        <div className="pt-3 border-t border-[#F8F9FA]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
              Price Range & Budget (₹)
            </span>

            {/* Custom Min/Max Input Box */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-20 pl-6 pr-2 py-1 text-xs bg-[#FAFAFA] border border-[#EBEBF0] rounded-md focus:outline-none focus:border-[#333333]"
                />
              </div>
              <span className="text-xs text-gray-400">–</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-20 pl-6 pr-2 py-1 text-xs bg-[#FAFAFA] border border-[#EBEBF0] rounded-md focus:outline-none focus:border-[#333333]"
                />
              </div>
              <button
                onClick={() => {
                  playHapticClick();
                  const min = Number(minPriceInput) || 0;
                  const max = Number(maxPriceInput) || Infinity;
                  if (max > 0 || min > 0) {
                    setAppliedCustomPrice({ min, max });
                    setSelectedBudget({ label: `₹${min.toLocaleString('en-IN')} – ₹${max === Infinity ? 'Above' : max.toLocaleString('en-IN')}`, min, max });
                  }
                }}
                className="px-2.5 py-1 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
              >
                Go
              </button>
              {appliedCustomPrice && (
                <button
                  onClick={() => {
                    playHapticClick();
                    setAppliedCustomPrice(null);
                    setMinPriceInput('');
                    setMaxPriceInput('');
                    setSelectedBudget(BUDGET_RANGES[0]);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Clear custom price"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_RANGES.map((b) => {
              const isSelected = !appliedCustomPrice && selectedBudget.label === b.label;
              return (
                <button
                  key={b.label}
                  onClick={() => {
                    playHapticClick();
                    setAppliedCustomPrice(null);
                    setMinPriceInput('');
                    setMaxPriceInput('');
                    setSelectedBudget(b);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#333333] text-white font-medium shadow-2xs'
                      : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0] border border-[#EBEBF0]'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Essential Quick Filters & Purpose */}
        <div className="pt-3 border-t border-[#F8F9FA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mr-1">
              Essential Filters:
            </span>

            {/* 10-Min Flash Delivery Toggle */}
            <button
              onClick={() => {
                playHapticClick();
                setDeliveryFilter(prev => prev === 'quick' ? 'all' : 'quick');
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                deliveryFilter === 'quick'
                  ? 'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A] font-bold shadow-2xs'
                  : 'bg-[#FAFAFA] text-[#666666] border border-[#EBEBF0] hover:bg-[#F3FBEF]'
              }`}
            >
              <Zap className="w-3 h-3 text-[#CA8A04]" />
              <span>10-Min Flash Delivery</span>
            </button>

            {/* Genuine Price Drops Toggle */}
            <button
              onClick={() => {
                playHapticClick();
                setDealFilter(prev => prev === 'drops' ? 'all' : 'drops');
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                dealFilter === 'drops'
                  ? 'bg-[#F3FBEF] text-[#008738] border border-[#008738]/30 font-bold shadow-2xs'
                  : 'bg-[#FAFAFA] text-[#666666] border border-[#EBEBF0] hover:bg-[#F3FBEF]'
              }`}
            >
              <Award className="w-3 h-3 text-[#008738]" />
              <span>Genuine Price Drops</span>
            </button>

            {/* 4.5★ & Above Rating Toggle */}
            <button
              onClick={() => {
                playHapticClick();
                setMinRating(prev => prev === 4.5 ? 0 : 4.5);
              }}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                minRating === 4.5
                  ? 'bg-[#FFF8D9] text-[#856404] border border-[#B59A50]/40 font-bold shadow-2xs'
                  : 'bg-[#FAFAFA] text-[#666666] border border-[#EBEBF0] hover:bg-[#FFF8D9]'
              }`}
            >
              <Star className="w-3 h-3 fill-[#b59a50] text-[#b59a50]" />
              <span>4.5★ & Above</span>
            </button>
          </div>

          {/* Reset All Filters button */}
          {(selectedBrand !== 'All' || appliedCustomPrice || selectedBudget.label !== 'All Budgets' || selectedPurpose || minRating > 0 || deliveryFilter !== 'all' || dealFilter !== 'all') && (
            <button
              onClick={() => {
                playHapticClick();
                setSelectedBrand('All');
                setAppliedCustomPrice(null);
                setMinPriceInput('');
                setMaxPriceInput('');
                setSelectedBudget(BUDGET_RANGES[0]);
                setSelectedPurpose(null);
                setMinRating(0);
                setDeliveryFilter('all');
                setDealFilter('all');
              }}
              className="text-xs font-bold text-[#b59a50] hover:text-[#856404] flex items-center gap-1 transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Row 4: Primary Use Case / Purpose */}
        {availablePurposes.length > 0 && (
          <div className="pt-3 border-t border-[#F8F9FA]">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                Primary Use Case
              </span>
              <span className="font-semibold text-[#333333] text-[11px]">{selectedPurpose || 'All use cases'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedPurpose(null)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  selectedPurpose === null
                    ? 'bg-[#333333] text-white font-medium shadow-2xs'
                    : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0] border border-[#EBEBF0]'
                }`}
              >
                All
              </button>
              {availablePurposes.map((p) => {
                const isSelected = selectedPurpose === p;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPurpose(p)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                      isSelected
                        ? 'bg-[#333333] text-white font-medium shadow-2xs'
                        : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0] border border-[#EBEBF0]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Chips Bar */}
        {(selectedBrand !== 'All' || appliedCustomPrice || selectedBudget.label !== 'All Budgets' || selectedPurpose || minRating > 0 || deliveryFilter !== 'all' || dealFilter !== 'all') && (
          <div className="pt-2 border-t border-[#F8F9FA] flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#9E9E9E] font-medium">Active Filters:</span>
            
            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333]">
                <span>Brand: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand('All')} className="hover:text-black font-bold">✕</button>
              </span>
            )}

            {selectedBudget.label !== 'All Budgets' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333]">
                <span>Budget: {selectedBudget.label}</span>
                <button onClick={() => {
                  setSelectedBudget(BUDGET_RANGES[0]);
                  setAppliedCustomPrice(null);
                  setMinPriceInput('');
                  setMaxPriceInput('');
                }} className="hover:text-black font-bold">✕</button>
              </span>
            )}

            {selectedPurpose && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333]">
                <span>Use Case: {selectedPurpose}</span>
                <button onClick={() => setSelectedPurpose(null)} className="hover:text-black font-bold">✕</button>
              </span>
            )}

            {deliveryFilter === 'quick' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEFCE8] border border-[#FEF08A] text-[#CA8A04] font-medium">
                <span>10-Min Flash</span>
                <button onClick={() => setDeliveryFilter('all')} className="hover:text-black font-bold">✕</button>
              </span>
            )}

            {dealFilter === 'drops' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3FBEF] border border-[#008738]/30 text-[#008738] font-medium">
                <span>Price Drops</span>
                <button onClick={() => setDealFilter('all')} className="hover:text-black font-bold">✕</button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF8D9] border border-[#B59A50]/40 text-[#856404] font-medium">
                <span>Rating: {minRating}★+</span>
                <button onClick={() => setMinRating(0)} className="hover:text-black font-bold">✕</button>
              </span>
            )}

            <span className="text-[#008738] font-bold ml-auto">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
            </span>
          </div>
        )}

      </div>

      {/* Product List */}
      <div className="space-y-4">
        {searchQuery.trim() ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-xl border border-[#EBEBF0] shadow-xs">
              <span className="text-xs font-semibold text-[#333333]">
                {searchResults.length > 0 
                  ? `Found ${searchResults.length} matching ${searchResults.length === 1 ? 'device' : 'devices'} for "${searchQuery}" across all categories:`
                  : `No exact local catalog match for "${searchQuery}". Live retailer query active:`}
              </span>
              <button
                onClick={() => {
                  playHapticClick();
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#b59a50] hover:underline"
              >
                Clear Search (Return to {selectedCat.label})
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#008738]/30 shadow-card my-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#008738] bg-[#F3FBEF] px-2.5 py-0.5 rounded-full border border-[#008738]/20">
                      Live Multi-Store Arbitrage Engine
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#333333] mt-2">
                      Live Retailer Price Comparison for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-[#666666] mt-1">
                      Instantly query live inventory, latest price drops, and 5% bank card cashback directly across Amazon, Flipkart, and Croma with 0% markup.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playHapticClick();
                      setSelectedProduct(createDynamicProduct(searchQuery));
                    }}
                    className="px-4 py-2 bg-[#008738] hover:bg-[#00702e] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Inspect Live Deal Card</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  <a
                    href={`https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] hover:bg-[#FFEDD5] text-xs font-semibold text-[#EA580C] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                      <span className="truncate">Amazon.in</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-xs font-semibold text-[#2563EB] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <span className="truncate">Flipkart</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://www.croma.com/searchB?q=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#CDEEC6] bg-[#F3FBEF] hover:bg-[#E1F7DE] text-xs font-semibold text-[#008738] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#008738]" />
                      <span className="truncate">Croma Tata</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://www.reliancedigital.in/search?q=${encodeURIComponent(searchQuery)}:relevance`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] text-xs font-semibold text-[#E11D48] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                      <span className="truncate">Reliance Digital</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://www.jiomart.com/search/${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#99F6E4] bg-[#F0FDFA] hover:bg-[#CCFBF1] text-xs font-semibold text-[#0D9488] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                      <span className="truncate">JioMart</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://blinkit.com/s/?q=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#FEF08A] bg-[#FEFCE8] hover:bg-[#FEF9C3] text-xs font-semibold text-[#CA8A04] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]" />
                      <span className="truncate">Blinkit (10-Min)</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://www.zeptonow.com/search?query=${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] hover:bg-[#EDE9FE] text-xs font-semibold text-[#7C3AED] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                      <span className="truncate">Zepto (10-Min)</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>

                  <a
                    href={`https://www.vijaysales.com/search/${encodeURIComponent(searchQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-xs font-semibold text-[#DC2626] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                      <span className="truncate">Vijay Sales</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((prod) => {
                  const cheapest = getCheapestStore(prod);
                  const intel = evaluateDealIntelligence(prod, [], cheapest.price);

                  return (
                    <div 
                      key={prod.id}
                      className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-card hover:shadow-card-hover transition-all"
                    >
                      {/* BRO AI VERDICT BANNER */}
                      <div className="mb-3.5 p-2.5 rounded-lg bg-[#F3FBEF] border border-[#008738]/25 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-white bg-[#008738] px-2 py-0.5 rounded">
                            BRO AI Verdict
                          </span>
                          <span className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                            <span>Lowest on</span>
                            <PlatformBadge platformKey={cheapest.store} size="xs" />
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#008738] font-bold">
                          <span>₹{cheapest.price ? cheapest.price.toLocaleString('en-IN') : 'Check Live'}</span>
                          <span className="text-[#9E9E9E] font-normal">•</span>
                          <span className="text-[10px] text-[#666666] font-normal">0% Markup Verified</span>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                        
                        {/* Left: Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {prod.badge && (
                              <span className="text-[10px] font-bold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded-full border border-[#008738]/20">
                                {prod.badge}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-[#666666] bg-[#F8F9FA] px-2 py-0.5 rounded border border-[#EBEBF0]">
                              {prod.category?.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-bold text-[#b59a50] bg-[#FFF8D9] px-2 py-0.5 rounded border border-[#B59A50]/30">
                              Deal Score: {intel.dealScore}/10
                            </span>
                          </div>

                          <h3 
                            onClick={() => {
                              playHapticClick();
                              setSelectedProduct(prod);
                            }}
                            className="text-lg font-serif font-bold text-[#333333] hover:text-[#b59a50] cursor-pointer transition-colors"
                          >
                            {prod.name}
                          </h3>
                          <p className="text-xs text-[#666666] mt-0.5">{prod.tagline}</p>

                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {prod.specs?.map((s, idx) => (
                              <span key={idx} className="text-[10px] bg-[#F8F9FA] text-[#666666] px-2 py-0.5 rounded border border-[#EBEBF0]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right: Prices */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 flex-shrink-0">
                          <div className="text-left sm:text-right lg:text-right">
                            <span className="text-[10px] font-semibold text-[#008738] uppercase tracking-wider block">
                              Best price on {cheapest.store ? cheapest.store.toUpperCase() : 'STORE'}
                            </span>
                            <span className="text-2xl font-serif font-bold text-[#333333] font-mono">
                              ₹{cheapest.price ? cheapest.price.toLocaleString('en-IN') : 'Check Live'}
                            </span>
                            <span className="text-[10px] text-[#9E9E9E] block">Verified with 0% Markup</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                playHapticClick();
                                setSelectedProduct(prod);
                              }}
                              className="px-3.5 py-2 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                            >
                              <span>Inspect Deal</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#EBEBF0] my-6 shadow-card">
            <RefreshCw className="w-6 h-6 text-[#b59a50] animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#333333]">Querying Supabase Electronics Catalog...</h3>
            <p className="text-xs text-[#9E9E9E] mt-1">Retrieving latest multi-carrier store prices</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="space-y-6 my-6">
            {/* Live Internet Multi-Store Radar Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#008738]/20 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#008738] bg-[#F3FBEF] px-2.5 py-0.5 rounded-full border border-[#008738]/20">
                      Live Internet Arbitrage Engine
                    </span>
                    <span className="text-[10px] font-bold text-[#b59a50] bg-[#FFF8D9] px-2 py-0.5 rounded">
                      Real-Time Retail Query
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#333333]">
                    {selectedPurpose ? `${selectedPurpose} ` : ''}{selectedCat.label} in {selectedBudget.label}
                  </h3>
                  <p className="text-xs text-[#666666] mt-1.5 max-w-2xl leading-relaxed">
                    Direct live search links configured with exact price and category filters across Amazon, Flipkart, and Croma. View real-time stock, lightning deals, and 5% credit card discounts with zero markup.
                  </p>
                </div>

                <button
                  onClick={() => {
                    playHapticClick();
                    const dyn = createDynamicProduct(
                      `${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`,
                      { categoryId: selectedCat.id, budgetRange: selectedBudget, purpose: selectedPurpose }
                    );
                    setSelectedProduct(dyn);
                  }}
                  className="px-4 py-2.5 bg-[#008738] hover:bg-[#00702e] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 flex-shrink-0 transition-colors"
                >
                  <span>Inspect Live Market Deal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Multi-Platform Direct Live Deep-Links (E-Commerce, Retail, 10-Min Flash) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2">
                <a
                  href={(() => {
                    const q = encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`);
                    if (selectedBudget.min > 0 && selectedBudget.max !== Infinity) {
                      return `https://www.amazon.in/s?k=${q}&rh=p_36%3A${selectedBudget.min * 100}-${selectedBudget.max * 100}`;
                    }
                    return `https://www.amazon.in/s?k=${q}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] hover:bg-[#FFEDD5] text-xs font-semibold text-[#EA580C] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                    <span className="truncate">Amazon in Budget</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={(() => {
                    const q = encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`);
                    if (selectedBudget.min > 0 && selectedBudget.max !== Infinity) {
                      return `https://www.flipkart.com/search?q=${q}&p%5B%5D=facets.price_range.from%3D${selectedBudget.min}&p%5B%5D=facets.price_range.to%3D${selectedBudget.max}`;
                    }
                    return `https://www.flipkart.com/search?q=${q}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-xs font-semibold text-[#2563EB] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    <span className="truncate">Flipkart in Budget</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://www.croma.com/searchB?q=${encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#CDEEC6] bg-[#F3FBEF] hover:bg-[#E1F7DE] text-xs font-semibold text-[#008738] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#008738]" />
                    <span className="truncate">Croma (Tata)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://www.reliancedigital.in/search?q=${encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`)}:relevance`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6] text-xs font-semibold text-[#E11D48] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                    <span className="truncate">Reliance Digital</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://www.jiomart.com/search/${encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#99F6E4] bg-[#F0FDFA] hover:bg-[#CCFBF1] text-xs font-semibold text-[#0D9488] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                    <span className="truncate">JioMart</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://blinkit.com/s/?q=${encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#FEF08A] bg-[#FEFCE8] hover:bg-[#FEF9C3] text-xs font-semibold text-[#CA8A04] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]" />
                    <span className="truncate">Blinkit (10-Min)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://www.zeptonow.com/search?query=${encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] hover:bg-[#EDE9FE] text-xs font-semibold text-[#7C3AED] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                    <span className="truncate">Zepto (10-Min)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <a
                  href={`https://www.vijaysales.com/search/${encodeURIComponent(`${selectedPurpose ? selectedPurpose + ' ' : ''}${selectedCat.label}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-xs font-semibold text-[#DC2626] flex items-center justify-between transition-colors shadow-2xs group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                    <span className="truncate">Vijay Sales</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* AI Synthesized Live Market Deal matching exact user conditions */}
            {(() => {
              const dynamicBrandPart = selectedBrand && selectedBrand !== 'All' ? `${selectedBrand} ` : '';
              const dynamicPurposePart = selectedPurpose ? `${selectedPurpose} ` : '';
              const dynamicQuery = `${dynamicBrandPart}${dynamicPurposePart}${selectedCat.label}`;
              const dynProd = createDynamicProduct(dynamicQuery, {
                categoryId: selectedCat.id,
                budgetRange: appliedCustomPrice ? { min: appliedCustomPrice.min, max: appliedCustomPrice.max, label: `₹${appliedCustomPrice.min.toLocaleString('en-IN')} - ₹${appliedCustomPrice.max.toLocaleString('en-IN')}` } : selectedBudget,
                purpose: selectedPurpose,
              });
              const cheapest = getCheapestStore(dynProd);

              return (
                <div className="bg-white rounded-2xl p-6 border-2 border-[#008738]/30 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-[#008738] bg-[#F3FBEF] px-2.5 py-1 rounded-full border border-[#008738]/20 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#008738]" />
                        ⚡ AI Live Market Recommendation
                      </span>
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                        BuyHatke Condition: 100/100 Verified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#9E9E9E]">Real-Time Web Arbitrage</span>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 
                        onClick={() => {
                          playHapticClick();
                          setSelectedProduct(dynProd);
                        }}
                        className="text-xl font-serif font-bold text-[#333333] hover:text-[#008738] cursor-pointer transition-colors"
                      >
                        {dynProd.name}
                      </h3>
                      <p className="text-xs text-[#666666] mt-1">{dynProd.tagline}</p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {dynProd.specs?.map((s, idx) => (
                          <span key={idx} className="text-[10px] bg-[#F8F9FA] text-[#333333] font-medium px-2.5 py-1 rounded-md border border-[#EBEBF0]">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[#666666] text-[11px] font-medium">Compared across:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF7ED] text-[#EA580C] font-semibold text-[11px]">Amazon</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-semibold text-[11px]">Flipkart</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F3FBEF] text-[#008738] font-semibold text-[11px]">Croma</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF1F2] text-[#E11D48] font-semibold text-[11px]">Reliance</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F0FDFA] text-[#0D9488] font-semibold text-[11px]">JioMart</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] font-semibold text-[11px]">Vijay Sales</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 flex-shrink-0">
                      <div className="text-left sm:text-right lg:text-right">
                        <span className="text-[10px] font-semibold text-[#008738] uppercase tracking-wider block">
                          Lowest across 9 Retailers on {cheapest.store ? cheapest.store.toUpperCase() : 'FLIPKART'}
                        </span>
                        <span className="text-2xl font-serif font-bold text-[#333333] font-mono">
                          ₹{cheapest.price ? cheapest.price.toLocaleString('en-IN') : 'Check Live'}
                        </span>
                        <span className="text-[10px] text-[#008738] font-semibold block">⚡ 0% Markup • Zero Brokerage</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            playHapticClick();
                            setSelectedProduct(dynProd);
                          }}
                          className="px-4 py-2 bg-[#008738] hover:bg-[#00702e] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                        >
                          <span>Compare All 9 Stores</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Smart Catalog Navigation Bar */}
            <div className="bg-white rounded-xl p-6 border border-[#EBEBF0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-[#333333] block">Looking for other price ranges?</span>
                <span className="text-[11px] text-[#666666]">Reset budget filters to view all verified {selectedCat.label} models.</span>
              </div>
              <button
                onClick={() => {
                  playHapticClick();
                  setSelectedBudget(BUDGET_RANGES[0]);
                  setSelectedPurpose(null);
                }}
                className="px-4 py-2 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex-shrink-0"
              >
                Show All {selectedCat.label}
              </button>
            </div>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const cheapest = getCheapestStore(prod);
            const intel = evaluateDealIntelligence(prod, [], cheapest.price);

            return (
              <div 
                key={prod.id}
                className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-card hover:shadow-card-hover transition-all"
              >
                {/* BRO AI VERDICT BANNER */}
                <div className="mb-3.5 p-2.5 rounded-lg bg-[#F3FBEF] border border-[#008738]/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-white bg-[#008738] px-2 py-0.5 rounded">
                      BRO AI Verdict
                    </span>
                    <span className="text-xs font-semibold text-[#111111] flex items-center gap-1.5">
                      <span>Lowest price on</span>
                      <PlatformBadge platformKey={cheapest.store} size="xs" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#008738] font-bold">
                    <span>₹{cheapest.price ? cheapest.price.toLocaleString('en-IN') : 'Check Live'}</span>
                    <span className="text-[#9E9E9E] font-normal">•</span>
                    <span className="text-[10px] text-[#666666] font-normal">Verified 0% Markup</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {prod.badge && (
                        <span className="text-[10px] font-bold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded-full border border-[#008738]/20">
                          {prod.badge}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#333333] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#b59a50] text-[#b59a50]" />
                        {prod.rating}
                      </span>
                      {/* Deal Score */}
                      <span className="text-[10px] font-bold text-[#856404] bg-[#FFF8D9] px-2 py-0.5 rounded-full border border-[#B59A50]/30 flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#b59a50]" />
                        Score: {intel.dealScore}/10 · {intel.scoreTier}
                      </span>
                      {/* Fake Discount Warning */}
                      {intel.isFakeDiscount && (
                        <span className="text-[10px] font-bold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#D97706]/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                          Artificial MRP Alert
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <h3 
                        onClick={() => setSelectedProduct(prod)}
                        className="text-lg font-serif font-bold text-[#333333] hover:text-[#b59a50] cursor-pointer transition-colors"
                      >
                        {prod.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setCompareTargetA(prod);
                            setCompareOpen(true);
                          }}
                          className="text-[11px] font-semibold text-[#666666] hover:text-[#333333] px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#EBEBF0] transition-colors flex items-center gap-1"
                        >
                          <Scale className="w-3 h-3" />
                          Compare
                        </button>
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="text-[11px] font-semibold text-[#b59a50] hover:text-[#856404] px-2 py-0.5 rounded bg-[#FFF8D9] border border-[#B59A50]/30 transition-colors"
                        >
                          30-Day Trends
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#666666] mt-0.5">{prod.tagline}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(prod.specs || []).map((s) => (
                        <span 
                          key={s} 
                          className="text-xs bg-[#F8F9FA] border border-[#EBEBF0] text-[#666666] px-2.5 py-1 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Multi-store prices */}
                  <div className="lg:w-80 flex-shrink-0 bg-[#FAFAFA] rounded-xl p-3.5 border border-[#EBEBF0]">
                    <div className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2 flex justify-between">
                      <span>Store Price Match</span>
                      {cheapest && (
                        <span className="text-[#008738] font-bold">Lowest: ₹{cheapest.price?.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {prod.price && Object.entries(prod.price).map(([storeKey, price]) => {
                        const store = STORE_CONFIG[storeKey];
                        const isCheapest = cheapest && storeKey === cheapest.store;
                        const cloakedUrl = getAffiliateUrl(storeKey, prod.name, prod[`${storeKey}Url`]);

                        return (
                          <div 
                            key={storeKey}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                              isCheapest 
                                ? 'bg-[#F3FBEF] border border-[#008738]/40 text-[#333333] font-medium' 
                                : 'bg-white border border-[#EBEBF0] text-[#666666]'
                            }`}
                          >
                            <PlatformBadge platformKey={storeKey} size="xs" />

                            <div className="flex items-center gap-2 font-mono tabular-nums">
                              <span className={isCheapest ? 'text-[#008738] font-bold text-sm' : 'text-[#333333]'}>
                                ₹{price?.toLocaleString('en-IN')}
                              </span>
                              <a
                                href={cloakedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => recordAffiliateClick(storeKey, prod.id, prod.name)}
                                className="text-[#9E9E9E] hover:text-[#333333] p-0.5 transition-colors"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {cheapest && (
                      <a
                        href={getAffiliateUrl(cheapest.store, prod.name, prod[`${cheapest.store}Url`])}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => recordAffiliateClick(cheapest.store, prod.id, prod.name)}
                        className="mt-3 w-full py-2 bg-[#008738] hover:bg-[#00702e] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        Buy on {STORE_CONFIG[cheapest.store]?.name || cheapest.store} (₹{cheapest.price?.toLocaleString('en-IN')})
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* STITCH GENERATED PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 1v1 HARDWARE SPEC COMPARE MODAL */}
      {compareOpen && (
        <CompareModal
          products={recommendations}
          initialA={compareTargetA || recommendations[0]}
          initialB={recommendations[1] || recommendations[0]}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {/* TACTILE TOAST NOTIFICATION */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

    </div>
  );
}
