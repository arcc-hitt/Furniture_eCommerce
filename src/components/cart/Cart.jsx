import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from './CartItem';
import { ROUTES } from '../../utils/constants';

const Cart = () => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();

  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="max-w-md mx-auto">
          {/* Empty cart icon */}
          <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          
          <div className="space-y-4">
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Continue Shopping
            </Link>
            <div>
              <Link
                to={ROUTES.HOME}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cart Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="text-sm text-gray-600">
          {cartCount} {cartCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Items in your cart</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                >
                  Clear all items
                </button>
              </div>
              
              <div className="space-y-0">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-6">
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-gray-900">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-lg transition-colors duration-300 mt-6"
                  onClick={() => {
                    // TODO: Navigate to checkout page when implemented
                    alert('Checkout functionality will be implemented in later tasks');
                  }}
                >
                  Proceed to Checkout
                </button>

                {/* Payment Methods */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">We accept</p>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                      Cash on Delivery
                    </span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-800">Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;