import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

export const metadata = {
  title: 'Shop All Products | Zeta Toolz',
  description: 'Browse our complete collection of precision instruments.',
};

export default function ProductsPage() {
  return (
    <div className="animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
        <p className="text-gray-600">Explore the latest precision instruments designed to enhance your professional work. Quality, performance, and style in every product.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
