import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, X, Compass } from 'lucide-react';
import { searchAddress } from '../services/routing';

export default function AddressAutocomplete({
  label,
  value,
  onChange,
  onSelectCoordinate,
  city = 'Bangalore',
  placeholder = 'Enter landmark or street...',
  id
}) {
  const inputId = id || (label ? `autocomplete-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'address-input');
  const [query, setQuery] = useState(value?.name || value || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setQuery(value?.name || value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    onChange(text);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (text.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const matches = await searchAddress(text, city);
        setResults(matches);
        setIsOpen(matches.length > 0);
        setHighlightIndex(-1);
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  const handleSelect = (item) => {
    setQuery(item.shortName || item.name);
    onChange(item.shortName || item.name);
    if (onSelectCoordinate) {
      onSelectCoordinate({
        name: item.shortName || item.name,
        fullName: item.name,
        lat: item.lat,
        lon: item.lon
      });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#666666] mb-1.5 flex items-center justify-between cursor-pointer">
          <span>{label}</span>
          <span className="text-[10px] text-[#9E9E9E] font-normal">OSM Geocoding</span>
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3 text-[#9E9E9E] pointer-events-none">
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#b59a50]" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-[#666666]" />
          )}
        </div>

        <input
          id={inputId}
          name={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-label={label || 'Address input'}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-white border border-[#EBEBF0] rounded-lg pl-9 pr-8 py-2.5 text-xs text-[#333333] placeholder-[#9E9E9E] focus:outline-none focus:border-[#333333] focus:ring-1 focus:ring-[#333333] transition-colors shadow-sm"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 text-[#9E9E9E] hover:text-[#333333] p-0.5 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#EBEBF0] rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y divide-[#F5F5F7] animate-in fade-in duration-100">
          {results.map((item, idx) => (
            <button
              key={`${item.lat}-${item.lon}-${idx}`}
              type="button"
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightIndex(idx)}
              className={`w-full text-left px-3 py-2.5 text-xs flex items-start gap-2.5 transition-colors ${
                highlightIndex === idx ? 'bg-[#F8F9FA]' : 'hover:bg-[#F8F9FA]'
              }`}
            >
              <div className="mt-0.5 text-[#b59a50] flex-shrink-0">
                {item.isLandmark ? (
                  <Compass className="w-3.5 h-3.5 text-[#b59a50]" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#666666]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[#333333] truncate flex items-center gap-1.5">
                  <span>{item.shortName || item.name}</span>
                  {item.isLandmark && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FFF8D9] text-[#B59A50] font-semibold">
                      Landmark
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#9E9E9E] truncate mt-0.5">
                  {item.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
