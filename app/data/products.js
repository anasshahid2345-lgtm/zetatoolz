import jsonData from './data.json';

// Flatten the hierarchical JSON data into a single products array
// This maintains backward compatibility with the existing codebase which expects a flat list
export const products = [];

jsonData.categories.forEach(category => {
  if (category.subcategories) {
    category.subcategories.forEach(subcategory => {
      // Add products directly from subcategory
      if (subcategory.products) {
        subcategory.products.forEach(product => {
          products.push({
            ...product,
            category: category.name,
            subcategory: subcategory.name,
            subsubcategory: null // No sub-subcategory for these products
          });
        });
      }
      
      // Add products from sub-subcategories
      if (subcategory.subsubcategories) {
        subcategory.subsubcategories.forEach(subsubcategory => {
          if (subsubcategory.products) {
            subsubcategory.products.forEach(product => {
              products.push({
                ...product,
                category: category.name,
                subcategory: subcategory.name,
                subsubcategory: subsubcategory.name
              });
            });
          }
        });
      }
    });
  }
});


