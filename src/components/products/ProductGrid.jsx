import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getAllProducts, getProductsByCategory } from '../../services/productService';

const ProductGrid = ({ category = null, searchQuery = '', limit = null }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedProducts = [];
        
        if (category) {
          fetchedProducts = await getProductsByCategory(category);
        } else {
          fetchedProducts = await getAllProducts();
        }

        // Filter by search query if provided
        if (searchQuery && searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          fetchedProducts = fetchedProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
          );
        }

        // Apply limit if specified
        if (limit && limit > 0) {
          fetchedProducts = fetchedProducts.slice(0, limit);
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Loading skeleton */}
        {Array.from({ length: 8 }).map((_, index) => (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Products</h3>
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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No products match your search for "${searchQuery}"`
              : category 
                ? `No products available in this category`
                : 'No products are currently available'
            }
          </p>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search terms or browse all products
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {searchQuery ? (
            <>Showing {products.length} result{products.length !== 1 ? 's' : ''} for "{searchQuery}"</>
          ) : category ? (
            <>Showing {products.length} product{products.length !== 1 ? 's' : ''} in this category</>
          ) : (
            <>Showing {products.length} product{products.length !== 1 ? 's' : ''}</>
          )}
        </p>
        
        {/* Optional: Sort dropdown could be added here */}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load more button (if limit is applied and there might be more products) */}
      {limit && products.length === limit && (
        <div className="text-center pt-8">
          <button
            onClick={() => {
              // This could be enhanced to load more products
              window.location.href = '/products';
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors duration-300"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;