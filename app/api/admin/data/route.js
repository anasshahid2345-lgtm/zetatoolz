import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'app', 'data', 'data.json');

// Helper function to read data
function readData() {
  try {
    const fileContents = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { categories: [] };
  }
}

// Helper function to write data
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 4), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
}

// Helper function to delete product images from file system
function deleteProductImages(product) {
  try {
    // Delete all product images
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(imagePath => {
        if (imagePath && imagePath.startsWith('/images/')) {
          const fullPath = path.join(process.cwd(), 'public', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted image: ${fullPath}`);
          }
        }
      });
    }
    
    // Delete variant images if they exist
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach(variant => {
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach(imagePath => {
            if (imagePath && imagePath.startsWith('/images/')) {
              const fullPath = path.join(process.cwd(), 'public', imagePath);
              if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log(`Deleted variant image: ${fullPath}`);
              }
            }
          });
        }
      });
    }

    // Try to delete the product folder if it's empty
    if (product.images && product.images.length > 0) {
      const firstImagePath = product.images[0];
      if (firstImagePath && firstImagePath.startsWith('/images/')) {
        const productFolderPath = path.join(process.cwd(), 'public', path.dirname(firstImagePath));
        try {
          // Check if folder exists and is empty
          if (fs.existsSync(productFolderPath)) {
            const files = fs.readdirSync(productFolderPath);
            if (files.length === 0) {
              fs.rmdirSync(productFolderPath);
              console.log(`Deleted empty product folder: ${productFolderPath}`);
            }
          }
        } catch (err) {
          console.log(`Could not delete product folder: ${err.message}`);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product images:', error);
    return false;
  }
}

// GET - Retrieve all data
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read data' },
      { status: 500 }
    );
  }
}

// POST - Add or update data
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, categorySlug, subcategorySlug, subsubcategorySlug, data: newData } = body;

    const currentData = readData();

    switch (action) {
      case 'add-category': {
        const { slug, name, description } = newData;
        
        // Check if category already exists
        if (currentData.categories.find(c => c.slug === slug)) {
          return NextResponse.json(
            { error: 'Category already exists' },
            { status: 400 }
          );
        }

        currentData.categories.push({
          slug,
          name,
          description,
          subcategories: []
        });
        break;
      }

      case 'add-subcategory': {
        const { slug, name, description } = newData;
        const category = currentData.categories.find(c => c.slug === categorySlug);
        
        if (!category) {
          return NextResponse.json(
            { error: 'Category not found' },
            { status: 404 }
          );
        }

        // Check if subcategory already exists
        if (category.subcategories.find(s => s.slug === slug)) {
          return NextResponse.json(
            { error: 'Subcategory already exists' },
            { status: 400 }
          );
        }

        category.subcategories.push({
          slug,
          name,
          description,
          subsubcategories: []
        });
        break;
      }

      case 'add-subsubcategory': {
        const { slug, name, description } = newData;
        const category = currentData.categories.find(c => c.slug === categorySlug);
        
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
        if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        if (!subcategory.subsubcategories) subcategory.subsubcategories = [];

        if (subcategory.subsubcategories.find(s => s.slug === slug)) {
          return NextResponse.json({ error: 'Sub-subcategory already exists' }, { status: 400 });
        }

        subcategory.subsubcategories.push({
          slug,
          name,
          description,
          products: []
        });
        break;
      }

      case 'add-product': {
        const category = currentData.categories.find(c => c.slug === categorySlug);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
        if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        const product = {
          id: newData.id,
          name: newData.name,
          description: newData.description,
          image: newData.image,
          images: newData.images || [newData.image],
          variants: newData.variants || [],
          details: {
            overview: newData.overview || newData.description,
            specifications: newData.specifications || {},
            features: newData.features || []
          }
        };

        // If subsubcategorySlug is provided, add to sub-subcategory
        if (subsubcategorySlug) {
          const subsubcategory = subcategory.subsubcategories?.find(s => s.slug === subsubcategorySlug);
          if (!subsubcategory) return NextResponse.json({ error: 'Sub-subcategory not found' }, { status: 404 });

          if (subsubcategory.products.find(p => p.id === product.id)) {
            return NextResponse.json({ error: 'Product ID already exists' }, { status: 400 });
          }

          subsubcategory.products.push(product);
        } else {
          // Add directly to subcategory
          if (!subcategory.products) subcategory.products = [];
          
          if (subcategory.products.find(p => p.id === product.id)) {
            return NextResponse.json({ error: 'Product ID already exists in this subcategory' }, { status: 400 });
          }

          subcategory.products.push(product);
        }
        break;
      }

      case 'update-product': {
        const category = currentData.categories.find(c => c.slug === categorySlug);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
        if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        const subsubcategory = subcategory.subsubcategories?.find(s => s.slug === subsubcategorySlug);
        if (!subsubcategory) return NextResponse.json({ error: 'Sub-subcategory not found' }, { status: 404 });

        const productIndex = subsubcategory.products.findIndex(p => p.id === newData.id);
        if (productIndex === -1) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        subsubcategory.products[productIndex] = {
          id: newData.id,
          name: newData.name,
          description: newData.description,
          image: newData.image,
          details: {
            overview: newData.overview || newData.description,
            specifications: newData.specifications || {},
            features: newData.features || []
          }
        };
        break;
      }

      case 'delete-product': {
        const { productId } = newData;
        const category = currentData.categories.find(c => c.slug === categorySlug);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
        if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        // Find and delete the product images
        let productToDelete = null;
        
        if (subsubcategorySlug) {
          const subsubcategory = subcategory.subsubcategories?.find(s => s.slug === subsubcategorySlug);
          if (!subsubcategory) return NextResponse.json({ error: 'Sub-subcategory not found' }, { status: 404 });

          // Find the product before deleting
          productToDelete = subsubcategory.products.find(p => p.id === productId);
          
          if (productToDelete) {
            // Delete product images from file system
            deleteProductImages(productToDelete);
          }
          
          // Remove product from data
          subsubcategory.products = subsubcategory.products.filter(p => p.id !== productId);
        } else {
          // Delete from subcategory
          if (subcategory.products) {
            // Find the product before deleting
            productToDelete = subcategory.products.find(p => p.id === productId);
            
            if (productToDelete) {
              // Delete product images from file system
              deleteProductImages(productToDelete);
            }
            
            // Remove product from data
            subcategory.products = subcategory.products.filter(p => p.id !== productId);
          }
        }
        break;
      }

      case 'delete-category': {
        const { slug } = newData;
        const categoryIndex = currentData.categories.findIndex(c => c.slug === slug);
        
        if (categoryIndex === -1) {
          return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        currentData.categories.splice(categoryIndex, 1);
        break;
      }

      case 'delete-subcategory': {
        const category = currentData.categories.find(c => c.slug === categorySlug);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const { slug } = newData;
        const subcategoryIndex = category.subcategories.findIndex(s => s.slug === slug);
        
        if (subcategoryIndex === -1) {
          return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
        }

        category.subcategories.splice(subcategoryIndex, 1);
        break;
      }

      case 'delete-subsubcategory': {
        const category = currentData.categories.find(c => c.slug === categorySlug);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        const subcategory = category.subcategories.find(s => s.slug === subcategorySlug);
        if (!subcategory) return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });

        const { slug } = newData;
        const subSubIndex = subcategory.subsubcategories?.findIndex(s => s.slug === slug);

        if (subSubIndex === undefined || subSubIndex === -1) {
             return NextResponse.json({ error: 'Sub-subcategory not found' }, { status: 404 });
        }

        subcategory.subsubcategories.splice(subSubIndex, 1);
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const success = writeData(currentData);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Data updated successfully',
        data: currentData
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to write data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
