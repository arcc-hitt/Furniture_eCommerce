// Simple test component to verify address functionality
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  saveAddress, 
  getUserAddresses, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../../services/addressService';

const AddressTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, { test, result, details, timestamp: Date.now() }]);
  };

  const runTests = async () => {
    if (!user?.uid) {
      addTestResult('Authentication Check', 'FAIL', 'User not authenticated');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Save Address
      addTestResult('Save Address', 'RUNNING', 'Creating test address...');
      const testAddress = {
        name: 'Test User',
        phone: '1234567890',
        address: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        isDefault: true
      };

      const saveResult = await saveAddress(user.uid, testAddress);
      if (saveResult.success) {
        addTestResult('Save Address', 'PASS', `Address saved with ID: ${saveResult.addressId}`);
        
        // Test 2: Get User Addresses
        addTestResult('Get Addresses', 'RUNNING', 'Fetching user addresses...');
        const addresses = await getUserAddresses(user.uid);
        if (addresses.length > 0) {
          addTestResult('Get Addresses', 'PASS', `Found ${addresses.length} address(es)`);
          
          const savedAddress = addresses.find(addr => addr.id === saveResult.addressId);
          if (savedAddress) {
            // Test 3: Update Address
            addTestResult('Update Address', 'RUNNING', 'Updating address...');
            const updatedData = { ...savedAddress, city: 'Updated City' };
            const updateResult = await updateAddress(user.uid, savedAddress.id, updatedData);
            
            if (updateResult.success) {
              addTestResult('Update Address', 'PASS', 'Address updated successfully');
              
              // Test 4: Set Default Address
              addTestResult('Set Default', 'RUNNING', 'Setting as default...');
              const defaultResult = await setDefaultAddress(user.uid, savedAddress.id);
              
              if (defaultResult.success) {
                addTestResult('Set Default', 'PASS', 'Default address set successfully');
              } else {
                addTestResult('Set Default', 'FAIL', defaultResult.error);
              }
              
              // Test 5: Delete Address
              addTestResult('Delete Address', 'RUNNING', 'Deleting test address...');
              const deleteResult = await deleteAddress(user.uid, savedAddress.id);
              
              if (deleteResult.success) {
                addTestResult('Delete Address', 'PASS', 'Address deleted successfully');
              } else {
                addTestResult('Delete Address', 'FAIL', deleteResult.error);
              }
            } else {
              addTestResult('Update Address', 'FAIL', updateResult.error);
            }
          } else {
            addTestResult('Address Verification', 'FAIL', 'Saved address not found in list');
          }
        } else {
          addTestResult('Get Addresses', 'FAIL', 'No addresses found after saving');
        }
      } else {
        addTestResult('Save Address', 'FAIL', saveResult.error);
      }
    } catch (error) {
      addTestResult('Test Execution', 'ERROR', error.message);
    } finally {
      setIsRunning(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please log in to run address service tests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Address Service Tests</h2>
        
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  result.result === 'PASS'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : result.result === 'FAIL'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : result.result === 'ERROR'
                    ? 'bg-red-100 border-red-300 text-red-900'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{result.test}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      result.result === 'PASS'
                        ? 'bg-green-200 text-green-800'
                        : result.result === 'FAIL'
                        ? 'bg-red-200 text-red-800'
                        : result.result === 'ERROR'
                        ? 'bg-red-300 text-red-900'
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {result.result}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {result.details && (
                  <p className="text-sm mt-1 opacity-80">{result.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressTest;