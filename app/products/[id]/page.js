import { products } from '../../data/products';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  return <ProductDetailClient id={id} />;
}
