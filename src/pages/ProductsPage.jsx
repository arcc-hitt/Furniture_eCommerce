// ProductsPage component
// Will be implemented in later tasks

import ProductGrid from '../components/products/ProductGrid';

const ProductsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <ProductGrid />
    </div>
  );
};

export default ProductsPage;