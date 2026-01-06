import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import SearchInput from '../components/products/SearchInput';
import SearchResults from '../components/products/SearchResults';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);

  // Get search query from URL parameters
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
    setLocalSearchQuery(query);
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchParams({ search: localSearchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  // Clear search
  const clearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    setSearchParams({});
  };

  // Handle results count change
  const handleResultsChange = (count) => {
    setResultCount(count);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {searchQuery ? `Search Results` : 'All Products'}
        </h1>
        
        {/* Enhanced search input with suggestions */}
        <div className="max-w-md mb-6">
          <SearchInput
            value={localSearchQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
            placeholder="Search products..."
            showSuggestions={true}
            autoFocus={false}
          />
        </div>

        {/* Search results summary */}
        {searchQuery && (
          <div className="mb-4">
            <p className="text-gray-600">
              {resultCount > 0 ? (
                <>Showing {resultCount} result{resultCount !== 1 ? 's' : ''} for "{searchQuery}"</>
              ) : (
                <>No results found for "{searchQuery}"</>
              )}
            </p>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm mt-1 underline"
            >
              Clear search and view all products
            </button>
          </div>
        )}

        {/* Popular searches for non-search state */}
        {!searchQuery && !localSearchQuery && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['wardrobe', 'sliding', '2-door', 'furniture', 'door', 'storage'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setLocalSearchQuery(term);
                    setSearchParams({ search: term });
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200 capitalize"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Display search results or all products */}
      {searchQuery ? (
        <SearchResults 
          query={searchQuery} 
          onResultsChange={handleResultsChange}
        />
      ) : (
        <ProductGrid />
      )}
    </div>
  );
};

export default ProductsPage;