import { categoriesData } from '../../data/categories';
import SubcategoriesPageClient from './SubcategoriesPageClient';

export function generateStaticParams() {
  return Object.keys(categoriesData).map((slug) => ({
    category: slug,
  }));
}

export default async function SubcategoriesPage({ params }) {
  const { category } = await params;
  
  return <SubcategoriesPageClient categorySlug={category} />;
}
