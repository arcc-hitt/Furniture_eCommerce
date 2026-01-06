import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { getProductById } from '../../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const fetchedProduct = await getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;
    
    setIsAddingToCart(true);
    try {
      addToCart(product, quantity);
      // Optional: Show success message
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-300 rounded-lg"></div>
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Details skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Product</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Prepare images array
  const images = [];
  if (product.images) {
    Object.values(product.images).forEach(imageUrl => {
      if (imageUrl && imageUrl.trim()) {
        images.push(imageUrl);
      }
    });
  }
  
  // Fallback image if no images available
  if (images.length === 0) {
    images.push('https://via.placeholder.com/600x600?text=No+Image');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-blue-600">
                Home
              </button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/products')} className="hover:text-blue-600">
                Products
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
            </div>
            
            {/* Thumbnail images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {!product.inStock && (
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Information */}
            {product.inStock && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 font-medium">In Stock</span>
                </div>
                {product.quantity && product.quantity <= 10 && (
                  <p className="text-green-700 text-sm mt-1">
                    Only {product.quantity} left in stock
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector and Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.quantity || 1}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 text-center border-0 focus:ring-0"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (product.quantity || 1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium text-lg transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </div>
                  ) : (
                    `Add to Cart - ₹${(product.price * quantity).toLocaleString('en-IN')}`
                  )}
                </button>
              </div>
            )}

            {/* Product Specifications (if available) */}
            {product.specifications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </dt>
                        <dd className="text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;