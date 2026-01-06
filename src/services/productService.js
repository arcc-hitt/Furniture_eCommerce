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
 * Search products by name, description, or category with enhanced matching
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

    // Enhanced search with scoring for relevance
    const searchResults = allProducts.map(product => {
      let score = 0;
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      const category = product.category.toLowerCase();

      // Exact matches get highest score
      if (name === searchTerm) score += 100;
      if (description === searchTerm) score += 80;
      if (category === searchTerm) score += 60;

      // Starts with matches get high score
      if (name.startsWith(searchTerm)) score += 50;
      if (description.startsWith(searchTerm)) score += 40;
      if (category.startsWith(searchTerm)) score += 30;

      // Contains matches get medium score
      if (name.includes(searchTerm)) score += 25;
      if (description.includes(searchTerm)) score += 20;
      if (category.includes(searchTerm)) score += 15;

      // Word boundary matches for better relevance
      const wordBoundaryRegex = new RegExp(`\\b${searchTerm}\\b`, 'i');
      if (wordBoundaryRegex.test(name)) score += 35;
      if (wordBoundaryRegex.test(description)) score += 25;
      if (wordBoundaryRegex.test(category)) score += 20;

      // Partial word matches (for typos and partial searches)
      const searchWords = searchTerm.split(' ').filter(word => word.length > 2);
      searchWords.forEach(word => {
        if (name.includes(word)) score += 10;
        if (description.includes(word)) score += 8;
        if (category.includes(word)) score += 5;
      });

      return { ...product, searchScore: score };
    })
    .filter(product => product.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .map(({ searchScore, ...product }) => product); // Remove score from final result

    return searchResults;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

/**
 * Get search suggestions based on partial query
 * @param {string} query - Partial search query
 * @returns {Promise<Array>} Array of search suggestions
 */
export const getSearchSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }

    const allProducts = await getAllProducts();
    const searchTerm = query.toLowerCase().trim();
    const suggestions = new Set();

    allProducts.forEach(product => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const description = product.description.toLowerCase();

      // Add product names that start with or contain the search term
      if (name.includes(searchTerm)) {
        suggestions.add(product.name);
      }

      // Add categories that match
      if (category.includes(searchTerm)) {
        suggestions.add(product.category.replace(/-/g, ' '));
      }

      // Add relevant words from descriptions
      const descWords = description.split(' ').filter(word => 
        word.length > 3 && word.includes(searchTerm)
      );
      descWords.forEach(word => suggestions.add(word));
    });

    return Array.from(suggestions).slice(0, 8); // Limit to 8 suggestions
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return [];
  }
};

/**
 * Get popular search terms based on product data
 * @returns {Promise<Array>} Array of popular search terms
 */
export const getPopularSearchTerms = async () => {
  try {
    const allProducts = await getAllProducts();
    const termFrequency = {};

    // Extract common terms from product names and categories
    allProducts.forEach(product => {
      const words = [
        ...product.name.toLowerCase().split(' '),
        ...product.category.toLowerCase().replace(/-/g, ' ').split(' ')
      ];

      words.forEach(word => {
        if (word.length > 3) { // Only consider words longer than 3 characters
          termFrequency[word] = (termFrequency[word] || 0) + 1;
        }
      });
    });

    // Sort by frequency and return top terms
    return Object.entries(termFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([term]) => term);
  } catch (error) {
    console.error('Error getting popular search terms:', error);
    return ['wardrobe', 'furniture', 'door', 'sliding'];
  }
};