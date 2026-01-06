import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ROUTES } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) {
    return null;
  }

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      addToCart(product, 1);
      // Optional: Show success message or animation
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const productDetailUrl = ROUTES.PRODUCT_DETAILS.replace(':id', product.id);
  const primaryImage = product.images?.image1 || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <Link to={productDetailUrl} className="block">
        {/* Product Image */}
        <div className="relative aspect-w-4 aspect-h-3 bg-gray-100">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          
          {/* Stock status badge */}
          {!product.inStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              Out of Stock
            </div>
          )}
          
          {/* Discount badge (if applicable) */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {/* Stock quantity indicator */}
            {product.inStock && product.quantity && product.quantity <= 5 && (
              <span className="text-xs text-orange-600 font-medium">
                Only {product.quantity} left
              </span>
            )}
          </div>

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
              {product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-300 ${
            product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isAddingToCart ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Out of Stock'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;