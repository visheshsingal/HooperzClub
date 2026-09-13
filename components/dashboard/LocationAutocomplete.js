'use client';

import { useEffect, useState, useRef } from 'react';

export default function LocationAutocomplete({ label, value, onChange, placeholder, name, required = false }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'HooperzClub/1.0',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map((item) => ({
          display_name: item.display_name,
        }));
        setSuggestions(formatted);
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);

    onChange({ target: { name, value: val } });

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 400);
  };

  const handleSelectSuggestion = (suggestion) => {
    const selectedVal = suggestion.display_name;
    setQuery(selectedVal);
    setSuggestions([]);
    setIsOpen(false);
    onChange({ target: { name, value: selectedVal } });
  };

  return (
    <div ref={containerRef} className="relative block w-full space-y-2 text-sm text-zinc-700">
      {label && <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</span>}
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-0"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          name={name}
          required={required}
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="h-4 w-4 animate-spin text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {isOpen && (suggestions.length > 0 || (query.trim().length >= 3 && !loading)) && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-2xl">
          {suggestions.length > 0 ? (
            suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full px-4 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-black border-b border-zinc-100 last:border-b-0"
              >
                {item.display_name}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-zinc-500">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
}
