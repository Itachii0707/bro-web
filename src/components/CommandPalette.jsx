import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Smartphone, Car, ExternalLink, X, Compass, Sparkles, Bot, Globe } from 'lucide-react';
import { PRODUCTS, searchProducts, createDynamicProduct } from '../data/electronics';
import { POPULAR_ROUTES } from '../data/rides';
import { playHapticClick } from '../utils/audioFeedback';

export default function CommandPalette({ isOpen, onClose, onSelectProduct, onSelectTab, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const paletteRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery(initialQuery || '');
      setSelectedIndex(0);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose?.();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const cleanQ = query.toLowerCase().trim();

  // Smart fuzzy token matching
  const productMatches = cleanQ 
    ? searchProducts(cleanQ).slice(0, 5)
    : Object.values(PRODUCTS).flat().slice(0, 5);

  const routeMatches = Object.entries(POPULAR_ROUTES).flatMap(([city, routes]) => 
    routes.filter(r => 
      !cleanQ ||
      r.from.toLowerCase().includes(cleanQ) || 
      r.to.toLowerCase().includes(cleanQ) ||
      city.toLowerCase().includes(cleanQ)
    ).map(r => ({ ...r, city }))
  ).slice(0, cleanQ ? 3 : 2);

  const dynamicItem = cleanQ ? {
    type: 'dynamic_search',
    title: `Live Multi-Store Search for "${query.trim()}"`,
    subtitle: 'Check real-time stock & prices across Amazon, Flipkart, Croma',
    product: createDynamicProduct(query)
  } : null;

  const searchShopAction = cleanQ ? {
    type: 'search_shop',
    title: `Search "${query.trim()}" in Electronics Radar`,
    subtitle: productMatches.length > 0 
      ? `View all ${productMatches.length} matching models across Amazon, Flipkart & Croma`
      : `Search all categories and stores for "${query.trim()}"`,
    query: query.trim()
  } : null;

  const askAiItem = cleanQ ? {
    type: 'ask_ai',
    title: `Ask AI Advisor about "${query.trim()}"`,
    subtitle: 'Get specs comparison, buyer verdict, and launch pricing',
    tab: 'assistant',
    prompt: query.trim()
  } : null;

  const defaultActions = [
    { type: 'action', title: 'Compare Cabs & Autos Across City', tab: 'rides' },
    { type: 'action', title: 'Browse Gadgets & Price Drops', tab: 'shop' },
    { type: 'action', title: 'Ask AI Shopping & Ride Copilot', tab: 'assistant' },
  ].filter(item => {
    if (!cleanQ) return true;
    return item.title.toLowerCase().includes(cleanQ);
  });

  const allItems = [
    ...(searchShopAction ? [searchShopAction] : []),
    ...productMatches.map(p => ({ type: 'product', data: p })),
    ...(dynamicItem ? [dynamicItem] : []),
    ...(askAiItem ? [askAiItem] : []),
    ...routeMatches.map(r => ({ type: 'route', data: r })),
    ...defaultActions,
  ];

  const handleSelect = (item) => {
    playHapticClick();
    if (!item) return;
    if (item.type === 'search_shop') {
      onSelectTab('shop', item.query);
      onClose();
    } else if (item.type === 'product') {
      onSelectProduct(item.data);
      onClose();
    } else if (item.type === 'dynamic_search') {
      onSelectProduct(item.product);
      onClose();
    } else if (item.type === 'ask_ai') {
      onSelectTab('assistant', item.prompt);
      onClose();
    } else if (item.type === 'route') {
      onSelectTab('rides');
      onClose();
    } else if (item.type === 'action') {
      onSelectTab(item.tab);
      onClose();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      playHapticClick();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playHapticClick();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(allItems[selectedIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-100">
      <div 
        ref={paletteRef}
        className="bg-white rounded-2xl border border-[#EBEBF0] shadow-2xl max-w-xl w-full overflow-hidden text-[#333333]"
        role="dialog"
        aria-modal="true"
        aria-label="Universal Command Search"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#EBEBF0] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#b59a50]" />
          <input
            ref={inputRef}
            id="global-command-palette-input"
            name="globalCommandSearch"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search any gadget (e.g. iQOO 15, Pixel, OnePlus), routes, or actions..."
            className="w-full text-sm text-[#333333] placeholder-[#9E9E9E] focus:outline-none"
          />
          <button 
            onClick={() => {
              playHapticClick();
              onClose();
            }}
            aria-label="Close command palette"
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#008738]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#F5F5F7] p-2">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#9E9E9E]">
              Type a model name, brand (e.g. iQOO, Apple, Samsung), or city route.
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              if (item.type === 'search_shop') {
                return (
                  <button
                    key={`search-shop-${idx}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#333333] text-white shadow-xs' : 'hover:bg-[#F8F9FA] text-[#333333]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`p-1.5 rounded-lg flex-shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#FFF8D9] text-[#b59a50]'
                      }`}>
                        <Search className="w-3.5 h-3.5" />
                      </span>
                      <div className="truncate">
                        <span className="font-bold block truncate">{item.title}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#666666]'}`}>
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0 ${
                      isSelected ? 'bg-white text-[#333333]' : 'bg-[#F3FBEF] text-[#008738] border border-[#008738]/30'
                    }`}>
                      <span>Radar View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                );
              }

              if (item.type === 'product') {
                const p = item.data;
                const minPrice = p.price ? Math.min(...Object.values(p.price).filter(v => v > 0)) : 0;
                return (
                  <button
                    key={`prod-${p.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#F8F9FA] text-[#333333]' : 'hover:bg-[#F8F9FA] text-[#666666]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-[#FFF8D9] text-[#856404] flex-shrink-0">
                        <Smartphone className="w-3.5 h-3.5 text-[#b59a50]" />
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-[#333333] block truncate">{p.name}</span>
                        <span className="text-[10px] text-[#9E9E9E]">{p.category?.toUpperCase()} · {p.tagline}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="font-mono font-bold text-[#008738]">₹{minPrice.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-[#9E9E9E] block">Price Floor</span>
                    </div>
                  </button>
                );
              }

              if (item.type === 'dynamic_search') {
                return (
                  <button
                    key={`dyn-${idx}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#F3FBEF] text-[#008738]' : 'hover:bg-[#F3FBEF]/60 text-[#008738]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-[#E1F7DE] text-[#008738] flex-shrink-0">
                        <Globe className="w-3.5 h-3.5" />
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-[#008738] block truncate">{item.title}</span>
                        <span className="text-[10px] text-[#008738]/80">{item.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#008738] bg-white px-2 py-0.5 rounded border border-[#008738]/30 flex-shrink-0">
                      Live Arbitrage →
                    </span>
                  </button>
                );
              }

              if (item.type === 'ask_ai') {
                return (
                  <button
                    key={`ai-${idx}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#FFFBEB] text-[#92400E]' : 'hover:bg-[#FFFBEB]/60 text-[#92400E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-[#FEF3C7] text-[#D97706] flex-shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-[#92400E] block truncate">{item.title}</span>
                        <span className="text-[10px] text-[#B45309]">{item.subtitle}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0" />
                  </button>
                );
              }

              if (item.type === 'route') {
                const r = item.data;
                return (
                  <button
                    key={`route-${r.city}-${r.from}-${r.to}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-[#F8F9FA] text-[#333333]' : 'hover:bg-[#F8F9FA] text-[#666666]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-[#F3FBEF] text-[#008738] flex-shrink-0">
                        <Car className="w-3.5 h-3.5" />
                      </span>
                      <div className="truncate">
                        <span className="font-semibold text-[#333333] block truncate">{r.from} → {r.to}</span>
                        <span className="text-[10px] text-[#9E9E9E]">{r.city} Corridor · {r.distance} km</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#b59a50] uppercase tracking-wider">
                      Compare Cabs
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={`action-${idx}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-[#F8F9FA] text-[#333333]' : 'hover:bg-[#F8F9FA] text-[#666666]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-lg bg-[#F8F9FA] text-[#666666]">
                      <Sparkles className="w-3.5 h-3.5 text-[#b59a50]" />
                    </span>
                    <span className="font-medium text-[#333333]">{item.title}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-[#9E9E9E]" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-2.5 bg-[#FAFAFA] border-t border-[#EBEBF0] flex items-center justify-between text-[10px] text-[#9E9E9E]">
          <div className="flex items-center gap-2">
            <span>Navigation: <kbd className="px-1 py-0.5 bg-white border border-[#EBEBF0] rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-[#EBEBF0] rounded">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 bg-white border border-[#EBEBF0] rounded">Enter</kbd></span>
          </div>
          <span>Shortcut: <kbd className="px-1.5 py-0.5 bg-white border border-[#EBEBF0] rounded font-mono">⌘K</kbd></span>
        </div>
      </div>
    </div>
  );
}
