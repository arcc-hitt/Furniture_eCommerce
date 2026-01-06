// CartPage component
// Will be implemented in later tasks

import Layout from '../components/layout/Layout';
import Cart from '../components/cart/Cart';

const CartPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Cart />
      </div>
    </Layout>
  );
};

export default CartPage;