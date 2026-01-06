import { useParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { PRODUCT_CATEGORIES } from '../utils/constants';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // Validate category
  const validCategories = Object.values(PRODUCT_CATEGORIES);
  if (!validCategories.includes(category)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Category</h3>
            <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get category display name
  const getCategoryDisplayName = (categorySlug) => {
    switch (categorySlug) {
      case PRODUCT_CATEGORIES.ONE_DOOR_WARDROBE:
        return '1-Door Wardrobes';
      case PRODUCT_CATEGORIES.TWO_DOOR_WARDROBE:
        return '2-Door Wardrobes';
      case PRODUCT_CATEGORIES.SLIDING_WARDROBE:
        return 'Sliding Wardrobes';
      default:
        return categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  // Get category description
  const getCategoryDescription = (categorySlug) => {
    switch (categorySlug) {
      case PRODUCT_CATEGORIES.ONE_DOOR_WARDROBE:
        return 'Compact and stylish single door wardrobes perfect for smaller spaces and minimalist designs.';
      case PRODUCT_CATEGORIES.TWO_DOOR_WARDROBE:
        return 'Spacious double door wardrobes offering ample storage space for all your clothing and accessories.';
      case PRODUCT_CATEGORIES.SLIDING_WARDROBE:
        return 'Modern sliding door wardrobes that save space while providing easy access to your belongings.';
      default:
        return `Browse our collection of ${getCategoryDisplayName(categorySlug).toLowerCase()}.`;
    }
  };

  const categoryDisplayName = getCategoryDisplayName(category);
  const categoryDescription = getCategoryDescription(category);

  return (
    <div className="container mx-auto px-4 py-8">
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
          <li className="text-gray-900 font-medium">{categoryDisplayName}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {categoryDisplayName}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {categoryDescription}
        </p>
      </div>

      {/* Category Banner/Image (optional) */}
      <div className="mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Discover Our {categoryDisplayName}
            </h2>
            <p className="text-gray-700">
              Quality furniture designed to enhance your living space
            </p>
          </div>
          <div className="hidden md:block">
            <svg className="w-24 h-24 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter/Sort Options (placeholder for future enhancement) */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Future: Add filter options here */}
        </div>
        <div className="flex items-center space-x-2">
          {/* Future: Add sort options here */}
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid category={category} />

      {/* Category Information Section */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About {categoryDisplayName}
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {getCategoryDescription(category)} Our {categoryDisplayName.toLowerCase()} are crafted with attention to detail and built to last, ensuring you get the best value for your investment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you're furnishing a new home or upgrading your existing space, our {categoryDisplayName.toLowerCase()} offer the perfect combination of style, functionality, and durability. Browse our collection to find the perfect piece for your home.
          </p>
        </div>

        {/* Features/Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Materials</h3>
            <p className="text-sm text-gray-600">Made from premium materials for long-lasting durability</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Quick and secure delivery to your doorstep</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Assembly</h3>
            <p className="text-sm text-gray-600">Simple assembly with clear instructions included</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;