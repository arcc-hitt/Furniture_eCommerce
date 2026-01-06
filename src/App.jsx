
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import AddressPage from './pages/AddressPage';

// Import components
import ProductDetails from './components/products/ProductDetails';

// Import constants
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
              <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetails />} />
              <Route path={ROUTES.CATEGORY} element={<CategoryPage />} />
              <Route path={ROUTES.CART} element={<CartPage />} />
              <Route path={ROUTES.ADDRESSES} element={<AddressPage />} />
              {/* Additional routes will be added in later tasks */}
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
