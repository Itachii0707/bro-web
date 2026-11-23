import { useState, useEffect } from 'react';
import { 
  Search, ArrowRight, ExternalLink, Star, 
  MapPin, Check, SlidersHorizontal, ArrowUpRight, ShieldCheck, Sparkles, Bell
} from 'lucide-react';
import './index.css';
import ElectronicsShop from './components/ElectronicsShop';
import RidesPage from './components/RidesPage';
import AiAssistant from './components/AiAssistant';
import ProductDetailModal from './components/ProductDetailModal';
import RideDispatchModal from './components/RideDispatchModal';
import CommandPalette from './components/CommandPalette';
import WatchlistDrawer from './components/WatchlistDrawer';
import BroLogo from './components/BroLogo';
import { playHapticClick } from './utils/audioFeedback';

const featuredDevice = {
  name: 'Samsung Galaxy S24 Ultra 5G',
  subtitle: '256GB Storage, Titanium Gray',
  rating: 4.8,
  reviewCount: '1,420 ratings',
  specs: [
    '6.8-inch Dynamic AMOLED 2X, 120Hz',
    'Snapdragon 8 Gen 3 Mobile Platform',
    '200 MP primary camera with OIS',
    '5,000 mAh battery, 45W wired charging'
  ],
  stores: [
    {
      name: 'Croma',
      price: 124999,
      delivery: 'Delivery by tomorrow',
      isLowest: true,
      url: 'https://www.croma.com/searchB?q=samsung+s24+ultra'
    },
    {
      name: 'Flipkart',
      price: 127499,
      delivery: 'Free 2-day delivery',
      isLowest: false,
      url: 'https://www.flipkart.com/search?q=samsung+s24+ultra'
    },
    {
      name: 'Amazon',
      price: 129999,
      delivery: 'Prime next-day delivery',
      isLowest: false,
      url: 'https://www.amazon.in/s?k=samsung+s24+ultra'
    }
  ]
};

const featuredRide = {
  city: 'Bengaluru',
  origin: 'Koramangala 4th Block',
  destination: 'Kempegowda International Airport (BLR)',
  distanceKm: 38.4,
  estDuration: '52 mins via OSRM road network',
  options: [
    {
      carrier: 'Rapido',
      type: 'Auto',
      fare: 410,
      eta: '3 mins away',
      isBest: true,
      savings: 'Save ₹240 vs cab',
      url: 'https://www.rapido.bike'
    },
    {
      carrier: 'Ola',
      type: 'Prime Sedan',
      fare: 620,
      eta: '6 mins away',
      isBest: false,
      savings: null,
      url: 'https://book.olacabs.com'
    },
    {
      carrier: 'Uber',
      type: 'Go Sedan',
      fare: 650,
      eta: '5 mins away',
      isBest: false,
      savings: null,
      url: 'https://m.uber.com/go/product'
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['overview', 'shop', 'rides', 'assistant'].includes(hash) ? hash : 'overview';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'shop', 'rides', 'assistant'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab, payload = null) => {
    playHapticClick();
    setActiveTab(tab);
    window.location.hash = tab;
    if (tab === 'shop' && typeof payload === 'string') {
      setShopSearchQuery(payload);
    }
    if (tab === 'assistant' && typeof payload === 'string') {
      setAssistantPrompt(payload);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    return window.location.hash === '#product-modal' ? featuredDevice : null;
  });
  const [activeDispatch, setActiveDispatch] = useState(() => {
    return window.location.hash === '#dispatch-modal' ? featuredRide.options[0] : null;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#333333] flex flex-col font-sans">
      
      {/* Accessible Skip to Content Link (WCAG 2.1 AAA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2.5 focus:bg-[#008738] focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-bold focus:outline-none focus:ring-4 focus:ring-[#008738]/30 transition-all text-xs"
      >
        Skip to main content
      </a>

      {/* Top Editorial Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EBEBF0] shadow-clean">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand mark */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleTabChange('overview')}
              className="flex items-center gap-2.5 focus:outline-none"
              aria-label="BRO AI Home"
            >
              <BroLogo size={36} showWordmark={true} />
            </button>

            {/* Navigation links */}
            <nav className="hidden sm:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'shop',     label: 'Electronics Radar' },
                { id: 'rides',    label: 'Cab & Auto Radar' },
                { id: 'assistant', label: 'AI Copilot' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#333333] text-white shadow-sm'
                        : 'text-[#666666] hover:text-[#333333] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right status & tools */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#666666]">
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                playHapticClick();
                setPaletteOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#F3FBEF] border border-[#EBEBF0] text-[#333333] transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#008738]"
              title="Search (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#b59a50]" />
              <span className="hidden md:inline font-medium">Quick Find</span>
              <kbd className="hidden sm:inline-block font-mono text-[9px] bg-white border border-[#EBEBF0] px-1 rounded text-gray-500">⌘K</kbd>
            </button>

            {/* Watchlist Drawer Trigger */}
            <button
              onClick={() => {
                playHapticClick();
                setWatchlistOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAFAFA] hover:bg-[#FFF8D9] border border-[#EBEBF0] text-[#333333] transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#008738]"
              title="My Price Watchlist"
            >
              <Bell className="w-3.5 h-3.5 text-[#b59a50]" />
              <span className="hidden sm:inline font-medium">Watchlist</span>
            </button>

            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3FBEF] border border-[#008738]/20 text-[#008738] font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008738]" />
              Live Tariffs Verified
            </span>
          </div>

        </div>
      </header>

      {/* Main View */}
      <main id="main-content" className="flex-1">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            
            {/* Clear Editorial Headline & Search */}
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#b59a50] block mb-2">
                Smart Consumer Radar for India
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#333333] mb-3 leading-tight">
                Never overpay for gadgets or daily rides.
              </h1>
              <p className="text-sm text-[#666666] leading-relaxed">
                Real-time price checks across Amazon, Flipkart & Croma, plus instant door-to-door cab and auto fare comparisons across Uber, Ola, Rapido & Namma Yatri — direct links, zero markup.
              </p>

              {/* Quiet Search Bar */}
              <div className="mt-6 flex items-center gap-2">
                <div className="relative flex-1">
                  <label htmlFor="overview-global-search" className="sr-only">Search gadgets or routes</label>
                  <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="overview-global-search"
                    name="searchQuery"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any gadget, model (e.g. iPhone 16, iQOO 15), or route... (Press Enter or ⌘K)"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EBEBF0] rounded-lg text-xs text-[#333333] placeholder:text-[#9E9E9E] focus:outline-none focus:border-[#333333] focus:ring-1 focus:ring-[#333333] transition-colors shadow-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (searchQuery.trim()) {
                          handleTabChange('shop', searchQuery.trim());
                        } else {
                          setPaletteOpen(true);
                        }
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (searchQuery.trim()) {
                      handleTabChange('shop', searchQuery.trim());
                    } else {
                      setPaletteOpen(true);
                    }
                  }}
                  className="px-4 py-2.5 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{searchQuery.trim() ? 'Search' : 'Quick Find'}</span>
                  {!searchQuery.trim() && <kbd className="font-mono text-[9px] bg-white/20 px-1 rounded">⌘K</kbd>}
                </button>
              </div>

              {/* Sample Quick Searches */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-[#666666]">
                <span className="text-[#9E9E9E]">Trending:</span>
                {[
                  { label: 'Galaxy S24 Ultra', tab: 'shop', query: 'Galaxy S24 Ultra' },
                  { label: 'Airport commute', tab: 'rides' },
                  { label: '65W GaN charger', tab: 'shop', query: '65W GaN' },
                  { label: 'ANC earbuds under ₹3,000', tab: 'shop', query: 'ANC earbuds' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleTabChange(item.tab, item.query)}
                    className="text-[#333333] hover:text-[#b59a50] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Comparison Cards (Lenskart Inspired Clean Editorial Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* CARD 1: Electronics Price Comparison */}
              <div className="bg-white rounded-xl border border-[#EBEBF0] p-6 shadow-card">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#F8F9FA] mb-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                    Electronics Comparison
                  </span>
                  <span className="text-xs font-bold text-[#008738] bg-[#F3FBEF] px-2.5 py-0.5 rounded-full border border-[#008738]/20">
                    Save ₹5,000 on Croma
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 
                        onClick={() => setSelectedProduct(featuredDevice)}
                        className="text-lg font-serif font-bold text-[#333333] hover:text-[#b59a50] cursor-pointer transition-colors"
                      >
                        {featuredDevice.name}
                      </h2>
                      <p className="text-xs text-[#666666] mt-0.5">{featuredDevice.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(featuredDevice)}
                      className="px-2.5 py-1 bg-[#F8F9FA] hover:bg-[#EBEBF0] border border-[#EBEBF0] rounded-lg text-[11px] font-semibold text-[#333333] transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-[#b59a50]" />
                      <span>30-Day Trends</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#666666]">
                    <span className="flex items-center gap-1 font-semibold text-[#333333]">
                      <Star className="w-3.5 h-3.5 fill-[#b59a50] text-[#b59a50]" />
                      {featuredDevice.rating}
                    </span>
                    <span>•</span>
                    <span className="text-[#9E9E9E]">{featuredDevice.reviewCount}</span>
                  </div>
                </div>

                {/* Price Table */}
                <div className="space-y-2 mb-6">
                  {featuredDevice.stores.map((store) => (
                    <div
                      key={store.name}
                      className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                        store.isLowest
                          ? 'border-[#008738]/40 bg-[#F3FBEF]'
                          : 'border-[#EBEBF0] bg-[#FFFFFF] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#333333]">{store.name}</span>
                          {store.isLowest && (
                            <span className="text-[10px] font-bold text-[#008738] bg-[#E1F7DE] px-2 py-0.5 rounded">
                              Lowest Price
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#9E9E9E] block mt-0.5">{store.delivery}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-serif font-bold text-[#333333] tabular-nums font-mono">
                          ₹{store.price.toLocaleString('en-IN')}
                        </span>
                        <a
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#333333] hover:text-[#b59a50] flex items-center gap-1 font-medium px-2.5 py-1 rounded bg-[#F8F9FA] hover:bg-[#EBEBF0] transition-colors"
                        >
                          Visit <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hardware Specs List */}
                <div className="border-t border-[#F8F9FA] pt-4 mb-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#666666] block mb-2.5">
                    Verified Specifications
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#666666]">
                    {featuredDevice.specs.map((spec) => (
                      <li key={spec} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#008738] flex-shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleTabChange('shop')}
                  className="w-full py-2.5 bg-[#F8F9FA] hover:bg-[#EBEBF0] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Explore All 18 Gadget Categories
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

              {/* CARD 2: Ride Fare Comparison */}
              <div className="bg-white rounded-xl border border-[#EBEBF0] p-6 shadow-card">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#F8F9FA] mb-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#666666]">
                    Live Cab & Auto Radar
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveDispatch(featuredRide.options[0])}
                      className="px-2.5 py-0.5 rounded-full bg-[#FFF8D9] border border-[#B59A50]/40 text-[#856404] text-[10px] font-bold tracking-wide flex items-center gap-1 hover:bg-[#ffefa8] transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-[#b59a50]" />
                      <span>Live Driver Dossier</span>
                    </button>
                    <span className="text-xs font-semibold text-[#333333] bg-[#F8F9FA] px-2.5 py-0.5 rounded-full border border-[#EBEBF0]">
                      {featuredRide.distanceKm} km route
                    </span>
                  </div>
                </div>

                {/* Route Overview */}
                <div className="bg-[#F8F9FA] border border-[#EBEBF0] rounded-lg p-3.5 mb-5 text-xs">
                  <div className="flex items-center gap-2 text-[#333333] font-semibold text-sm mb-1">
                    <MapPin className="w-4 h-4 text-[#008738]" />
                    <span>{featuredRide.origin}</span>
                    <span className="text-[#9E9E9E]">→</span>
                    <span>{featuredRide.destination}</span>
                  </div>
                  <span className="text-[#666666] block ml-6">{featuredRide.estDuration}</span>
                </div>

                {/* Carrier Options List */}
                <div className="space-y-2 mb-6">
                  {featuredRide.options.map((opt) => (
                    <div
                      key={opt.carrier}
                      className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                        opt.isBest
                          ? 'border-[#008738]/40 bg-[#F3FBEF]'
                          : 'border-[#EBEBF0] bg-white hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#333333]">{opt.carrier}</span>
                          <span className="text-xs text-[#9E9E9E]">• {opt.type}</span>
                          {opt.isBest && (
                            <span className="text-[10px] font-bold text-[#008738] bg-[#E1F7DE] px-2 py-0.5 rounded">
                              Best Value
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#9E9E9E] block mt-0.5">{opt.eta}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-base font-serif font-bold text-[#333333] tabular-nums font-mono block">
                            ₹{opt.fare}
                          </span>
                          {opt.savings && (
                            <span className="text-[10px] font-medium text-[#008738]">
                              {opt.savings}
                            </span>
                          )}
                        </div>

                        <a
                          href={opt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                            opt.isBest
                              ? 'bg-[#008738] hover:bg-[#00702e] text-white'
                              : 'bg-[#333333] hover:bg-[#111111] text-white'
                          }`}
                        >
                          Book
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#F8F9FA] pt-4 mb-5 text-xs text-[#9E9E9E] leading-relaxed">
                  Real-time road distances & surge estimates for {featuredRide.city}. Direct app links with 0% markup.
                </div>

                <button
                  onClick={() => handleTabChange('rides')}
                  className="w-full py-2.5 bg-[#F8FAFC] hover:bg-[#EBEBF0] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Compare All City Cabs & Autos
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ELECTRONICS */}
        {activeTab === 'shop' && (
          <ElectronicsShop
            initialSearchQuery={shopSearchQuery}
            onClearInitialSearch={() => setShopSearchQuery('')}
          />
        )}

        {/* TAB 3: RIDES */}
        {activeTab === 'rides' && <RidesPage />}

        {/* TAB 4: ASSISTANT */}
        {activeTab === 'assistant' && (
          <AiAssistant
            onSelectCategory={() => handleTabChange('shop')}
            onNavigateRides={() => handleTabChange('rides')}
            initialPrompt={assistantPrompt}
            onClearInitialPrompt={() => setAssistantPrompt('')}
          />
        )}

      </main>

      {/* Clean, Non-watermarked Footer */}
      <footer className="border-t border-[#EBEBF0] bg-white py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <div className="flex items-center gap-2.5">
            <BroLogo size={22} />
            <span className="font-serif font-bold text-[#333333]">Bro AI</span>
            <span>—</span>
            <span>Smart Consumer Radar for Electronics & City Transit</span>
          </div>

          <div className="flex items-center gap-3 text-[#9E9E9E]">
            <span>Direct Retailer & Cab App Deeplinks</span>
            <span>•</span>
            <span>0% Commission</span>
          </div>
        </div>
      </footer>

      {/* STITCH GENERATED MODALS */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {activeDispatch && (
        <RideDispatchModal
          routeInfo={{
            from: featuredRide.origin,
            to: featuredRide.destination,
            distanceKm: featuredRide.distanceKm,
            durationMinutes: 45
          }}
          carrier={activeDispatch}
          onClose={() => setActiveDispatch(null)}
        />
      )}

      {/* UNIVERSAL COMMAND PALETTE (Cmd+K) */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        initialQuery={searchQuery}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setPaletteOpen(false);
        }}
        onSelectTab={(t, payload) => {
          handleTabChange(t, payload);
          setPaletteOpen(false);
        }}
      />

      {/* ACTIVE PRICE WATCHLIST DRAWER */}
      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setWatchlistOpen(false);
        }}
      />

    </div>
  );
}
