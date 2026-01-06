import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchSuggestions, getPopularSearchTerms } from '../../services/productService';
import { ROUTES } from '../../utils/constants';

const SearchInput = ({ 
  value = '', 
  onChange, 
  onSubmit, 
  placeholder = 'Search products...', 
  className = '',
  showSuggestions = true,
  autoFocus = false 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [popularTerms, setPopularTerms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load popular search terms on mount
  useEffect(() => {
    const loadPopularTerms = async () => {
      try {
        const terms = await getPopularSearchTerms();
        setPopularTerms(terms);
      } catch (error) {
        console.error('Error loading popular terms:', error);
      }
    };

    if (showSuggestions) {
      loadPopularTerms();
    }
  }, [showSuggestions]);

  // Get suggestions when value changes
  useEffect(() => {
    const getSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await getSearchSuggestions(value);
        setSuggestions(results);
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    if (showSuggestions) {
      const timeoutId = setTimeout(getSuggestions, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [value, showSuggestions]);

  // Handle input focus
  const handleFocus = () => {
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    // Delay hiding dropdown to allow clicking on suggestions
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const items = value.length >= 2 ? suggestions : popularTerms;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSuggestionClick(items[selectedIndex]);
        } else if (onSubmit) {
          onSubmit(e);
        } else {
          handleDefaultSubmit(e);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (onChange) {
      onChange({ target: { value: suggestion } });
    }
    
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    // Navigate to search results
    navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(suggestion)}`);
  };

  // Handle default form submission
  const handleDefaultSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(value.trim())}`);
      setShowDropdown(false);
    }
  };

  // Auto focus if requested
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const displayItems = value.length >= 2 ? suggestions : popularTerms;
  const showItems = showDropdown && showSuggestions && (displayItems.length > 0 || loading);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={onSubmit || handleDefaultSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          
          {/* Search icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={() => {
                if (onChange) {
                  onChange({ target: { value: '' } });
                }
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showItems && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {loading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading suggestions...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Section header */}
              <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                {value.length >= 2 ? 'Suggestions' : 'Popular Searches'}
              </div>
              
              {/* Suggestions list */}
              {displayItems.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 ${
                    index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="capitalize">{item}</span>
                  </div>
                </button>
              ))}
              
              {displayItems.length === 0 && !loading && (
                <div className="px-4 py-3 text-center text-gray-500">
                  No suggestions found
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;