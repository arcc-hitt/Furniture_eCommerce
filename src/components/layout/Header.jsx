import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import SearchInput from '../products/SearchInput';
import { ROUTES } from '../../utils/constants';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const cartItemCount = getCartCount();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold text-blue-600 hidden sm:block">
              Furniture Store
            </span>
            <span className="text-xl font-bold text-blue-600 sm:hidden">
              FS
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search furniture..."
              className="w-full"
              showSuggestions={true}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to={ROUTES.HOME} 
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to={ROUTES.PRODUCTS} 
              className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
            >
              Products
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={ROUTES.CART} 
                  className="relative text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to={ROUTES.ORDERS} 
                  className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                >
                  Orders
                </Link>
                <Link 
                  to={ROUTES.ADDRESSES} 
                  className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                >
                  Addresses
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm">
                    Welcome, {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to={ROUTES.LOGIN} 
                  className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to={ROUTES.REGISTER} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search furniture..."
            className="w-full"
            showSuggestions={true}
          />
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to={ROUTES.HOME} 
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to={ROUTES.PRODUCTS} 
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={ROUTES.CART} 
                    className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cart
                    {cartItemCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to={ROUTES.ORDERS} 
                    className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    to={ROUTES.ADDRESSES} 
                    className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Addresses
                  </Link>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-700 text-sm mb-3">
                      Welcome, {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2 border-t border-gray-200">
                  <Link 
                    to={ROUTES.LOGIN} 
                    className="text-gray-700 hover:text-blue-600 transition duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to={ROUTES.REGISTER} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;