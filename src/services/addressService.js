// Address service functions for CRUD operations
import { ref, set, get, push, remove, update } from 'firebase/database';
import { database } from '../config/firebase';

// Save a new address for a user
export const saveAddress = async (userId, addressData) => {
  try {
    const addressesRef = ref(database, `users/${userId}/addresses`);
    const newAddressRef = push(addressesRef);
    
    const addressWithId = {
      id: newAddressRef.key,
      ...addressData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await set(newAddressRef, addressWithId);
    return { success: true, addressId: newAddressRef.key, address: addressWithId };
  } catch (error) {
    console.error('Error saving address:', error);
    return { success: false, error: error.message };
  }
};

// Get all addresses for a user
export const getUserAddresses = async (userId) => {
  try {
    const addressesRef = ref(database, `users/${userId}/addresses`);
    const snapshot = await get(addressesRef);
    
    if (snapshot.exists()) {
      const addresses = snapshot.val();
      // Convert object to array for easier handling
      return Object.values(addresses);
    }
    return [];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }
};

// Update an existing address
export const updateAddress = async (userId, addressId, addressData) => {
  try {
    const addressRef = ref(database, `users/${userId}/addresses/${addressId}`);
    
    const updatedAddress = {
      ...addressData,
      id: addressId,
      updatedAt: Date.now()
    };

    await update(addressRef, updatedAddress);
    return { success: true, address: updatedAddress };
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, error: error.message };
  }
};

// Delete an address
export const deleteAddress = async (userId, addressId) => {
  try {
    const addressRef = ref(database, `users/${userId}/addresses/${addressId}`);
    await remove(addressRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: error.message };
  }
};

// Set an address as default
export const setDefaultAddress = async (userId, addressId) => {
  try {
    // First, remove default flag from all addresses
    const addressesRef = ref(database, `users/${userId}/addresses`);
    const snapshot = await get(addressesRef);
    
    if (snapshot.exists()) {
      const addresses = snapshot.val();
      const updates = {};
      
      // Remove default flag from all addresses
      Object.keys(addresses).forEach(id => {
        updates[`${id}/isDefault`] = false;
      });
      
      // Set the selected address as default
      updates[`${addressId}/isDefault`] = true;
      updates[`${addressId}/updatedAt`] = Date.now();
      
      await update(addressesRef, updates);
      return { success: true };
    }
    
    return { success: false, error: 'No addresses found' };
  } catch (error) {
    console.error('Error setting default address:', error);
    return { success: false, error: error.message };
  }
};

// Get default address for a user
export const getDefaultAddress = async (userId) => {
  try {
    const addresses = await getUserAddresses(userId);
    return addresses.find(address => address.isDefault) || null;
  } catch (error) {
    console.error('Error fetching default address:', error);
    return null;
  }
};