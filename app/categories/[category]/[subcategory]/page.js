import { categoriesData } from '../../../data/categories';
import SubSubcategoriesPageClient from './SubSubcategoriesPageClient';

export function generateStaticParams() {
  const params = [];
  Object.keys(categoriesData).forEach(categorySlug => {
    const category = categoriesData[categorySlug];
    if (category.subcategories) {
      Object.keys(category.subcategories).forEach(subcategorySlug => {
        params.push({
          category: categorySlug,
          subcategory: subcategorySlug,
        });
      });
    }
  });
  return params;
}

export default async function SubCategoryPage({ params }) {
  const { category, subcategory } = await params;
  
  return <SubSubcategoriesPageClient categorySlug={category} subcategorySlug={subcategory} />;
}
