import { categoriesData } from '../../../../data/categories';
import ProductsPageClient from './ProductsPageClient';

export function generateStaticParams() {
  const params = [];
  Object.keys(categoriesData).forEach(categorySlug => {
    const category = categoriesData[categorySlug];
    if (category.subcategories) {
      Object.keys(category.subcategories).forEach(subcategorySlug => {
        const subcategory = category.subcategories[subcategorySlug];
        if (subcategory.subsubcategories) {
            Object.keys(subcategory.subsubcategories).forEach(subsubcategorySlug => {
                params.push({
                    category: categorySlug,
                    subcategory: subcategorySlug,
                    subsubcategory: subsubcategorySlug
                });
            });
        }
      });
    }
  });
  return params;
}

export default async function ProductsPage({ params }) {
  const { category, subcategory, subsubcategory } = await params;
  
  return <ProductsPageClient categorySlug={category} subcategorySlug={subcategory} subsubcategorySlug={subsubcategory} />;
}
