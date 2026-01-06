// ProductsPage component
// Will be implemented in later tasks

import Layout from '../components/layout/Layout';
import ProductGrid from '../components/products/ProductGrid';

const ProductsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        <ProductGrid />
      </div>
    </Layout>
  );
};

export default ProductsPage;