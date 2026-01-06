import { database } from '../config/firebase';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';

/**
 * Get all products from Firebase Realtime Database
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async () => {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      // Convert object to array with id included
      return Object.keys(productsData).map(id => ({
        id,
        ...productsData[id]
      })).filter(product => product.inStock); // Only return in-stock products
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Promise<Array>} Array of products in the category
 */
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = ref(database, 'products');
    const categoryQuery = query(productsRef, orderByChild('category'), equalTo(category));
    const snapshot = await get(categoryQuery);
    
    if (snapshot.exists()) {
      const productsData = snapshot.val();
      return Object.keys(productsData).map(id => ({
        id,
        ...productsData[id]
      })).filter(product => product.inStock); // Only return in-stock products
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
};

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export const getProductById = async (productId) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);
    
    if (snapshot.exists()) {
      return {
        id: productId,
        ...snapshot.val()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product');
  }
};

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching products
 */
export const searchProducts = async (query) => {
  try {
    const allProducts = await getAllProducts();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      return allProducts;
    }
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};