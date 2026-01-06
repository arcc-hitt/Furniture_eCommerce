import { formatCurrency } from '../../utils/helpers';

const OrderSummary = ({ items, total, onPlaceOrder, isPlacingOrder, disabled }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      
      {/* Order Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <img
              src={item.image || '/placeholder-image.jpg'}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
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

      {/* Order Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Delivery</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 pt-2">
          <span className="text-gray-800">Total</span>
          <span className="text-gray-800">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={disabled || isPlacingOrder}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          disabled || isPlacingOrder
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isPlacingOrder ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Placing Order...
          </div>
        ) : (
          'Place Order'
        )}
      </button>

      {disabled && (
        <p className="text-sm text-red-600 mt-2 text-center">
          Please select a delivery address to continue
        </p>
      )}

      {/* Payment Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💰 Cash on Delivery Available
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Pay when your order arrives at your doorstep
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;