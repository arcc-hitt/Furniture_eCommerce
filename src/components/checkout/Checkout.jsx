import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { getUserAddresses } from '../../services/addressService';
import { createOrder } from '../../services/orderService';
import AddressSelector from '../address/AddressSelector';
import OrderSummary from './OrderSummary';
import { ROUTES } from '../../utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Load user addresses on component mount
  useEffect(() => {
    const loadAddresses = async () => {
      if (user) {
        setLoading(true);
        try {
          const userAddresses = await getUserAddresses(user.uid);
          setAddresses(userAddresses);
          
          // Auto-select default address if available
          const defaultAddress = userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        } catch (error) {
          console.error('Error loading addresses:', error);
          setError('Failed to load addresses');
        } finally {
          setLoading(false);
        }
      }
    };

    loadAddresses();
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [cartItems, navigate]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setError('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        userId: user.uid,
        items: cartItems.reduce((acc, item) => {
          acc[`item_${item.id}`] = {
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          };
          return acc;
        }, {}),
        totalAmount: getCartTotal(),
        deliveryAddress: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        }
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Clear cart after successful order
        clearCart();
        
        // Navigate to order confirmation with order ID
        navigate(`/order-confirmation/${result.orderId}`, {
          state: { order: result.order }
        });
      } else {
        setError(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (cartItems.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Selection */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Delivery Address
            </h2>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading addresses...</p>
              </div>
            ) : (
              <AddressSelector
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressSelect={handleAddressSelect}
                showAddNew={true}
              />
            )}
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  value="cod"
                  checked={true}
                  readOnly
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="cod" className="ml-2 text-gray-700">
                  Cash on Delivery (COD)
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Pay when your order is delivered to your doorstep
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary
            items={cartItems}
            total={getCartTotal()}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
            disabled={!selectedAddress}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;