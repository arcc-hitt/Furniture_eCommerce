import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    // If order data wasn't passed via state, fetch it
    if (!order && orderId) {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const orderData = await getOrderById(orderId);
          if (orderData) {
            setOrder(orderData);
          } else {
            setError('Order not found');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
          setError('Failed to load order details');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Order Not Found
          </h2>
          <p className="text-red-600 mb-4">
            {error || 'The order you are looking for could not be found.'}
          </p>
          <Link
            to={ROUTES.HOME}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderItems = Object.values(order.items || {});

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. We'll send you updates as we process it.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Order #{order.id}
            </h2>
            <p className="text-gray-600 text-sm">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h3 className="font-medium text-gray-800 mb-3">Items Ordered</h3>
          <div className="space-y-3">
            {orderItems.map((item, index) => (
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
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-gray-800">Total Amount</span>
            <span className="text-gray-800">{formatCurrency(order.totalAmount)}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Payment Method: Cash on Delivery
          </p>
        </div>

        {/* Delivery Address */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-800 mb-2">Delivery Address</h3>
          <div className="text-gray-600 text-sm">
            <p className="font-medium">{order.deliveryAddress.name}</p>
            <p>{order.deliveryAddress.phone}</p>
            <p>{order.deliveryAddress.address}</p>
            <p>
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• We'll process your order within 24 hours</li>
          <li>• You'll receive updates via email/SMS</li>
          <li>• Estimated delivery: 3-7 business days</li>
          <li>• Pay cash when your order arrives</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={ROUTES.HOME}
          className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          to={ROUTES.ORDERS}
          className="flex-1 bg-gray-100 text-gray-800 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;