// AddressManager component for complete address management interface
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getUserAddresses, 
  saveAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../../services/addressService';
import AddressForm from './AddressForm';

const AddressManager = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, [user?.uid]);

  const fetchAddresses = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userAddresses = await getUserAddresses(user.uid);
      setAddresses(userAddresses);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleFormSubmit = async (formData) => {
    if (!user?.uid) return;

    try {
      setFormLoading(true);
      setError('');

      let result;
      if (editingAddress) {
        // Update existing address
        result = await updateAddress(user.uid, editingAddress.id, formData);
        if (result.success) {
          setSuccessMessage('Address updated successfully');
        }
      } else {
        // Create new address
        result = await saveAddress(user.uid, formData);
        if (result.success) {
          setSuccessMessage('Address added successfully');
        }
      }

      if (result.success) {
        await fetchAddresses();
        setShowForm(false);
        setEditingAddress(null);
      } else {
        setError(result.error || 'Failed to save address');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!user?.uid) return;
    
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const result = await deleteAddress(user.uid, addressId);
      if (result.success) {
        setSuccessMessage('Address deleted successfully');
        await fetchAddresses();
      } else {
        setError(result.error || 'Failed to delete address');
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    }
  };

  const handleSetDefault = async (addressId) => {
    if (!user?.uid) return;

    try {
      const result = await setDefaultAddress(user.uid, addressId);
      if (result.success) {
        setSuccessMessage('Default address updated');
        await fetchAddresses();
      } else {
        setError(result.error || 'Failed to set default address');
      }
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Failed to set default address');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Addresses</h2>
        {!showForm && (
          <button
            onClick={handleAddAddress}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add New Address
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {showForm ? (
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isLoading={formLoading}
          submitButtonText={editingAddress ? 'Update Address' : 'Add Address'}
        />
      ) : (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-500 mb-4">Add your first address to get started</p>
              <button
                onClick={handleAddAddress}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Address
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{address.name}</h3>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-gray-600">
                      {address.address}, {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Set Default
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressManager;