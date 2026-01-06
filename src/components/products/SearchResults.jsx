import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { searchProducts } from '../../services/productService';

const SearchResults = ({ query, onResultsChange }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      if (!query || !query.trim()) {
        setResults([]);
        onResultsChange?.(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchResults = await searchProducts(query.trim());
        setResults(searchResults);
        onResultsChange?.(searchResults.length);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search products. Please try again.');
        setResults([]);
        onResultsChange?.(0);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onResultsChange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Searching...</span>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-3"></div>
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!query || !query.trim()) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Search</h3>
          <p className="text-gray-600">
            Enter a search term to find products by name, description, or category
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            No products match your search for "{query}"
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Try:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Checking your spelling</li>
              <li>Using different keywords</li>
              <li>Searching for product categories like "wardrobe" or "furniture"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
        
        {/* Optional: Sort dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Search results grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Search tips */}
      {results.length > 0 && results.length < 5 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Search Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Try broader terms like "wardrobe" instead of specific models</li>
            <li>• Browse our categories to discover more products</li>
            <li>• Check out our full product catalog</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResults;