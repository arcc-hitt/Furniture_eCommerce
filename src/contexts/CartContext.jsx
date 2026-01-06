import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.image1 || '',
          quantity
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const filteredItems = state.items.filter(item => item.id !== action.payload.productId);
      return { ...state, items: filteredItems };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      return { ...state, items: updatedItems };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
    
    case CART_ACTIONS.LOAD_CART:
      return { ...state, items: action.payload.items || [] };
    
    default:
      return state;
  }
};

// Initial cart state
const initialState = {
  items: []
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    });
  };

  const removeFromCart = (productId) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { productId } 
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { productId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;