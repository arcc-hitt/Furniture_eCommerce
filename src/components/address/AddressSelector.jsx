// AddressSelector component for choosing saved addresses
import { useState, useEffect } from 'react';
import { getUserAddresses } from '../../services/addressService';
import { useAuth } from '../../contexts/AuthContext';

const AddressSelector = ({ 
  selectedAddressId, 
  onAddressSelect, 
  onAddNewAddress,
  showAddNewButton = true 
}) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userAddresses = await getUserAddresses(user.uid);
        setAddresses(userAddresses);
        
        // If no address is selected but there's a default address, select it
        if (!selectedAddressId && userAddresses.length > 0) {
          const defaultAddress = userAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress);
          }
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user?.uid, selectedAddressId, onAddressSelect]);

  const handleAddressSelect = (address) => {
    onAddressSelect(address);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Select Delivery Address</h3>
      
      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No saved addresses found</p>
          {showAddNewButton && onAddNewAddress && (
            <button
              onClick={onAddNewAddress}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add New Address
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedAddressId === address.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleAddressSelect(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === address.id}
                      onChange={() => handleAddressSelect(address)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-900">{address.name}</span>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-6 text-sm text-gray-600">
                    <p>{address.phone}</p>
                    <p className="mt-1">
                      {address.address}, {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {showAddNewButton && onAddNewAddress && (
            <button
              onClick={onAddNewAddress}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Address
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;