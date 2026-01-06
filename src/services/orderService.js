// Order service functions for creating and managing orders
import { ref, set, get, push, query, orderByChild, equalTo, update } from 'firebase/database';
import { database } from '../config/firebase';
import { ORDER_STATUS, PAYMENT_METHODS } from '../utils/constants';

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    
    const order = {
      id: newOrderRef.key,
      userId: orderData.userId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: ORDER_STATUS.PLACED,
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: PAYMENT_METHODS.COD,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await set(newOrderRef, order);
    return { success: true, orderId: newOrderRef.key, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }
};

// Get all orders for a specific user
export const getUserOrders = async (userId) => {
  try {
    const ordersRef = ref(database, 'orders');
    const userOrdersQuery = query(ordersRef, orderByChild('userId'), equalTo(userId));
    const snapshot = await get(userOrdersQuery);
    
    if (snapshot.exists()) {
      const orders = snapshot.val();
      // Convert object to array and sort by creation date (newest first)
      return Object.values(orders).sort((a, b) => b.createdAt - a.createdAt);
    }
    return [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const snapshot = await get(orderRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

// Update order status (mainly for admin use, but included for completeness)
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = ref(database, `orders/${orderId}`);
    const updates = {
      status: newStatus,
      updatedAt: Date.now()
    };

    await update(orderRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
};