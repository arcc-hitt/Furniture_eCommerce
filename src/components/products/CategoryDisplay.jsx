import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES, ROUTES } from '../../utils/constants';

const CategoryDisplay = () => {
  // Category data with display information
  const categories = [
    {
      id: PRODUCT_CATEGORIES.ONE_DOOR_WARDROBE,
      name: '1-Door Wardrobes',
      description: 'Compact and stylish single door wardrobes',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      route: ROUTES.CATEGORY.replace(':category', PRODUCT_CATEGORIES.ONE_DOOR_WARDROBE)
    },
    {
      id: PRODUCT_CATEGORIES.TWO_DOOR_WARDROBE,
      name: '2-Door Wardrobes',
      description: 'Spacious double door wardrobes for more storage',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      route: ROUTES.CATEGORY.replace(':category', PRODUCT_CATEGORIES.TWO_DOOR_WARDROBE)
    },
    {
      id: PRODUCT_CATEGORIES.SLIDING_WARDROBE,
      name: 'Sliding Wardrobes',
      description: 'Modern sliding door wardrobes to save space',
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      route: ROUTES.CATEGORY.replace(':category', PRODUCT_CATEGORIES.SLIDING_WARDROBE)
    }
  ];

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of furniture categories designed to meet all your home needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.route}
              className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-12 relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  <span className="text-sm font-medium">Shop Now</span>
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryDisplay;