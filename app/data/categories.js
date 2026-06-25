import jsonData from './data.json';

// Helper function to get first product image from a category/subcategory/subsubcategory
function getFirstProductImage(products) {
  if (!products || products.length === 0) return '/placeholder.jpg';
  const firstProduct = products[0];
  return firstProduct.image || firstProduct.images?.[0] || '/placeholder.jpg';
}

// Helper function to get first product image from subsubcategories
function getFirstImageFromSubsubcategories(subsubcategories) {
  if (!subsubcategories || subsubcategories.length === 0) return '/placeholder.jpg';
  for (const subsub of subsubcategories) {
    const image = getFirstProductImage(subsub.products);
    if (image !== '/placeholder.jpg') return image;
  }
  return '/placeholder.jpg';
}

// Helper function to get first product image from subcategories
function getFirstImageFromSubcategories(subcategories) {
  if (!subcategories || subcategories.length === 0) return '/placeholder.jpg';
  for (const sub of subcategories) {
    // Check for products directly in subcategory first
    if (sub.products && sub.products.length > 0) {
      const image = getFirstProductImage(sub.products);
      if (image !== '/placeholder.jpg') return image;
    }
    // Then check sub-subcategories
    const image = getFirstImageFromSubsubcategories(sub.subsubcategories);
    if (image !== '/placeholder.jpg') return image;
  }
  return '/placeholder.jpg';
}

// Transform JSON data into the structure expected by the app
// This maintains backward compatibility with the existing codebase
export const categoriesData = {};

jsonData.categories.forEach(cat => {
  const subcats = {};
  if (cat.subcategories) {
    cat.subcategories.forEach(sub => {
      const subSubcats = {};
      if (sub.subsubcategories) {
          sub.subsubcategories.forEach(subsub => {
              subSubcats[subsub.slug] = {
                  name: subsub.name,
                  image: getFirstProductImage(subsub.products), // Get from products
                  description: subsub.description
              };
          });
      }

      // Get image from subcategory products or sub-subcategories
      let subImage = '/placeholder.jpg';
      if (sub.products && sub.products.length > 0) {
        subImage = getFirstProductImage(sub.products);
      } else {
        subImage = getFirstImageFromSubsubcategories(sub.subsubcategories);
      }

      subcats[sub.slug] = {
        name: sub.name,
        image: subImage,
        description: sub.description,
        subsubcategories: subSubcats
      };
    });
  }

  categoriesData[cat.slug] = {
    name: cat.name,
    image: getFirstImageFromSubcategories(cat.subcategories), // Get from products
    description: cat.description,
    subcategories: subcats
  };
});

// Helper function to get all main categories
export function getMainCategories() {
  return jsonData.categories.map(cat => ({
    slug: cat.slug,
    name: cat.name,
    image: getFirstImageFromSubcategories(cat.subcategories), // Get from products
    description: cat.description,
    // Don't include subcategories in main list view usually
  }));
}

// Helper function to get subcategories for a main category
export function getSubcategories(categorySlug) {
  const category = jsonData.categories.find(c => c.slug === categorySlug);
  if (!category) return null;
  
  return {
    category: {
      slug: category.slug,
      name: category.name,
      description: category.description
    },
    subcategories: category.subcategories.map(sub => {
      // Check for products in subcategory first, then sub-subcategories
      let image = '/placeholder.jpg';
      if (sub.products && sub.products.length > 0) {
        image = getFirstProductImage(sub.products);
      } else {
        image = getFirstImageFromSubsubcategories(sub.subsubcategories);
      }
      
      return {
        slug: sub.slug,
        name: sub.name,
        image: image,
        description: sub.description
      };
    })
  };
}

// Helper function to get category info
export function getCategoryInfo(categorySlug, subcategorySlug = null, subsubcategorySlug = null) {
  const category = jsonData.categories.find(c => c.slug === categorySlug);
  if (!category) return null;
  
  if (subcategorySlug) {
    const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
    if (!subcategory) return null;
    
    if (subsubcategorySlug) {
      const subsubcategory = subcategory.subsubcategories?.find(s => s.slug === subsubcategorySlug);
      if (!subsubcategory) return null;

      return {
        category: {
          slug: category.slug,
          name: category.name
        },
        subcategory: {
          slug: subcategory.slug,
          name: subcategory.name
        },
        subsubcategory: {
          slug: subsubcategory.slug,
          name: subsubcategory.name,
          description: subsubcategory.description,
          image: getFirstProductImage(subsubcategory.products), // Get from products
          products: subsubcategory.products || []
        }
      };
    }

    return {
      category: {
        slug: category.slug,
        name: category.name
      },
      subcategory: {
        slug: subcategory.slug,
        name: subcategory.name,
        description: subcategory.description,
        image: getFirstImageFromSubsubcategories(subcategory.subsubcategories), // Get from products
        subsubcategories: subcategory.subsubcategories || [],
        products: subcategory.products || [] // Include products from subcategory
      }
    };
  }
  
  return {
    slug: category.slug,
    name: category.name,
    description: category.description,
    image: getFirstImageFromSubcategories(category.subcategories) // Get from products
  };
}
