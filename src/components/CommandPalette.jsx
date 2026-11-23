import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Smartphone, Car, ExternalLink, X, Compass, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/electronics';
import { POPULAR_ROUTES } from '../data/rides';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { playHapticClick } from '../utils/audioFeedback';

export default function CommandPalette({ isOpen, onClose, onSelectProduct, onSelectTab }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const paletteRef = useRef(null);

  useFocusTrap(paletteRef, isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const cleanQ = query.toLowerCase().trim();
  const allProductsList = Object.values(PRODUCTS).flat();

  const productMatches = allProductsList.filter(p => 
    p.name.toLowerCase().includes(cleanQ) || 
    (p.category && p.category.toLowerCase().includes(cleanQ)) ||
    (p.tagline && p.tagline.toLowerCase().includes(cleanQ))
  ).slice(0, 5);

  const routeMatches = Object.entries(POPULAR_ROUTES).flatMap(([city, routes]) => 
    routes.filter(r => 
      r.from.toLowerCase().includes(cleanQ) || 
      r.to.toLowerCase().includes(cleanQ) ||
      city.toLowerCase().includes(cleanQ)
    ).map(r => ({ ...r, city }))
  ).slice(0, 4);

  const allItems = [
    ...productMatches.map(p => ({ type: 'product', data: p })),
    ...routeMatches.map(r => ({ type: 'route', data: r })),
    { type: 'action', title: 'Open Ride Fare Comparison Matrix', tab: 'rides' },
    { type: 'action', title: 'Open Electronics Store Catalog', tab: 'shop' },
    { type: 'action', title: 'Ask AI Hardware Advisor', tab: 'assistant' },
  ].filter(item => {
    if (!cleanQ) return true;
    if (item.type === 'action') {
      return item.title.toLowerCase().includes(cleanQ);
    }
    return true;
  });

  const handleSelect = (item) => {
    playHapticClick();
    if (!item) return;
    if (item.type === 'product') {
      onSelectProduct(item.data);
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
            placeholder="Search gadgets, models, metro corridors, or actions..."
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
              No results found for "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              if (item.type === 'product') {
                const p = item.data;
                const minPrice = p.price ? Math.min(...Object.values(p.price)) : 0;
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
