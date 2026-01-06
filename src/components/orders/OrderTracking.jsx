import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const OrderTracking = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.PLACED:
        return 'bg-blue-100 text-blue-800';
      case ORDER_STATUS.SHIPPED:
        return 'bg-yellow-100 text-yellow-800';
      case ORDER_STATUS.DELIVERED:
        return 'bg-green-100 text-green-800';
      case ORDER_STATUS.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Please log in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-4">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => {
          const orderItems = Object.values(order.items || {});
          
          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="space-y-3">
                  {orderItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                          {item.productName}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {orderItems.length > 2 && (
                    <p className="text-gray-600 text-sm">
                      +{orderItems.length - 2} more item{orderItems.length - 2 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-600">
                  <p>Total: <span className="font-semibold text-gray-800">{formatCurrency(order.totalAmount)}</span></p>
                  <p>Payment: Cash on Delivery</p>
                </div>
                
                <div className="mt-2 sm:mt-0">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;