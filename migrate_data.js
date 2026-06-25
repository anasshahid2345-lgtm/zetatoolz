
const fs = require('fs');
const path = require('path');

console.log('Migration started...');

try {
    const dataPath = path.join(process.cwd(), 'app', 'data', 'data.json');
    console.log('Reading from:', dataPath);
    
    if (!fs.existsSync(dataPath)) {
        console.error('File found!');
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    data.categories.forEach(category => {
      if (category.subcategories) {
        category.subcategories.forEach(subcategory => {
          // If subcategory has products, move them to a new "Standard" sub-subcategory
          if (subcategory.products && subcategory.products.length > 0) {
            console.log(`Migrating products for ${category.name} > ${subcategory.name}`);

            if (!subcategory.subsubcategories) {
                subcategory.subsubcategories = [];
            }

            const standardSubSub = {
              slug: 'standard-' + subcategory.slug,
              name: 'Standard ' + subcategory.name,
              image: subcategory.image, 
              description: subcategory.description, 
              products: subcategory.products
            };

            subcategory.subsubcategories.push(standardSubSub);
            delete subcategory.products;
          }
        });
      }
    });

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
    console.log('Migration complete. File saved.');
} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
