import { useState, useEffect } from 'react';
import { 
  Star, ArrowUpRight,
  Award, AlertTriangle, Scale, Bookmark, Copy, RefreshCw,
  Search, X
} from 'lucide-react';
import { 
  CATEGORIES, BUDGET_RANGES, PURPOSES, PRODUCTS, STORE_CONFIG,
  getRecommendations, getCheapestStore,
  searchProducts, createDynamicProduct
} from '../data/electronics';
import { fetchProducts } from '../services/supabase';
import { evaluateDealIntelligence } from '../services/dealIntelligence';
import { getAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import ProductDetailModal from './ProductDetailModal';
import CompareModal from './CompareModal';
import Toast from './Toast';
import { playHapticClick, playSuccessChime } from '../utils/audioFeedback';



export default function ElectronicsShop({ initialSearchQuery, onClearInitialSearch }) {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[0]); // All Budgets
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareTargetA, setCompareTargetA] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');

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
          let list = res.products || [];
          if (sortBy === 'price') {
            list = [...list].sort((a, b) => getCheapestStore(a).price - getCheapestStore(b).price);
          } else {
            list = [...list].sort((a, b) => b.rating - a.rating);
          }
          setRecommendations(list);
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
  }, [selectedCat, selectedBudget, selectedPurpose, sortBy]);

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
            Compare genuine prices across Amazon, Flipkart, and Croma with algorithmic Fake Discount detection and 30-day price history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {recommendations.length >= 2 && (
            <button
              onClick={() => {
                playHapticClick();
                setCompareTargetA(recommendations[0]);
                setCompareOpen(true);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738]"
            >
              <Scale className="w-3.5 h-3.5 text-[#b59a50]" />
              <span>1v1 Compare</span>
            </button>
          )}

          <div className="flex items-center bg-white border border-[#EBEBF0] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1 rounded-md transition-colors ${
                sortBy === 'rating' ? 'bg-[#333333] text-white font-medium' : 'text-[#666666]'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-3 py-1 rounded-md transition-colors ${
                sortBy === 'price' ? 'bg-[#333333] text-white font-medium' : 'text-[#666666]'
              }`}
            >
              Lowest Price
            </button>
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

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCat.id === cat.id;
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
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters: Budget & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* Budget */}
        <div className="bg-white rounded-xl p-4 border border-[#EBEBF0] shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#666666]">Budget Range</span>
            <span className="font-semibold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded border border-[#008738]/20">
              {selectedBudget.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_RANGES.map((b) => {
              const isSelected = selectedBudget.label === b.label;
              return (
                <button
                  key={b.label}
                  onClick={() => setSelectedBudget(b)}
                  className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#333333] text-white font-medium shadow-sm'
                      : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-white rounded-xl p-4 border border-[#EBEBF0] shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#666666]">Primary Use Case</span>
            <span className="font-semibold text-[#333333]">{selectedPurpose || 'All use cases'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedPurpose(null)}
              className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                selectedPurpose === null
                  ? 'bg-[#333333] text-white font-medium shadow-sm'
                  : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
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
                  className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#333333] text-white font-medium shadow-sm'
                      : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

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
        ) : recommendations.length === 0 ? (
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
          recommendations.map((prod) => {
            const cheapest = getCheapestStore(prod);
            const intel = evaluateDealIntelligence(prod, [], cheapest.price);

            return (
              <div 
                key={prod.id}
                className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-card hover:shadow-card-hover transition-all"
              >
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
                            <span className="font-medium">{store?.name || storeKey}</span>

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
