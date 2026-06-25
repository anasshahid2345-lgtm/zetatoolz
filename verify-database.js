/**
 * Data Management Utility Script
 * 
 * This script provides utilities for managing the file-based database:
 * - Verify data.json integrity
 * - Check image references
 * - Clean up orphaned images
 * - Generate statistics
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'app', 'data', 'data.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Load data
function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error loading data.json:', error.message);
    process.exit(1);
  }
}

// Verify data structure
function verifyDataStructure(data) {
  console.log('\n📊 Verifying Data Structure...\n');
  
  if (!data.categories || !Array.isArray(data.categories)) {
    console.error('❌ Invalid data structure: categories array missing');
    return false;
  }
  
  let totalCategories = 0;
  let totalSubcategories = 0;
  let totalSubsubcategories = 0;
  let totalProducts = 0;
  let totalImages = 0;
  
  data.categories.forEach(category => {
    totalCategories++;
    
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        totalSubcategories++;
        
        if (subcategory.subsubcategories) {
          subcategory.subsubcategories.forEach(subsubcategory => {
            totalSubsubcategories++;
            
            if (subsubcategory.products) {
              subsubcategory.products.forEach(product => {
                totalProducts++;
                
                // Count images
                if (product.image) totalImages++;
                if (product.images && Array.isArray(product.images)) {
                  totalImages += product.images.length;
                }
                if (product.variants && Array.isArray(product.variants)) {
                  product.variants.forEach(variant => {
                    if (variant.image) totalImages++;
                    if (variant.images && Array.isArray(variant.images)) {
                      totalImages += variant.images.length;
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  
  console.log('✅ Data structure is valid\n');
  console.log(`📦 Categories: ${totalCategories}`);
  console.log(`📂 Subcategories: ${totalSubcategories}`);
  console.log(`📁 Sub-subcategories: ${totalSubsubcategories}`);
  console.log(`🛍️  Products: ${totalProducts}`);
  console.log(`🖼️  Image references: ${totalImages}\n`);
  
  return true;
}

// Collect all image paths from data
function collectImagePaths(data) {
  const imagePaths = new Set();
  
  data.categories.forEach(category => {
    if (category.image) imagePaths.add(category.image);
    
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        if (subcategory.image) imagePaths.add(subcategory.image);
        
        if (subcategory.subsubcategories) {
          subcategory.subsubcategories.forEach(subsubcategory => {
            if (subsubcategory.image) imagePaths.add(subsubcategory.image);
            
            if (subsubcategory.products) {
              subsubcategory.products.forEach(product => {
                if (product.image) imagePaths.add(product.image);
                if (product.images && Array.isArray(product.images)) {
                  product.images.forEach(img => imagePaths.add(img));
                }
                if (product.variants && Array.isArray(product.variants)) {
                  product.variants.forEach(variant => {
                    if (variant.image) imagePaths.add(variant.image);
                    if (variant.images && Array.isArray(variant.images)) {
                      variant.images.forEach(img => imagePaths.add(img));
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  
  return Array.from(imagePaths);
}

// Check if images exist
function checkImages(imagePaths) {
  console.log('\n🖼️  Checking Image Files...\n');
  
  let existing = 0;
  let missing = 0;
  const missingImages = [];
  
  imagePaths.forEach(imagePath => {
    // Remove leading slash and convert to file path
    const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(__dirname, 'public', relativePath);
    
    if (fs.existsSync(fullPath)) {
      existing++;
    } else {
      missing++;
      missingImages.push(imagePath);
    }
  });
  
  console.log(`✅ Existing images: ${existing}`);
  console.log(`❌ Missing images: ${missing}\n`);
  
  if (missingImages.length > 0 && missingImages.length < 20) {
    console.log('Missing image files:');
    missingImages.forEach(img => console.log(`  - ${img}`));
    console.log('');
  }
  
  return { existing, missing, missingImages };
}

// Get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
      // Get path relative to public directory
      const relativePath = '/' + path.relative(path.join(__dirname, 'public'), filePath).replace(/\\/g, '/');
      fileList.push(relativePath);
    }
  });
  
  return fileList;
}

// Find orphaned images
function findOrphanedImages(data) {
  console.log('\n🔍 Finding Orphaned Images...\n');
  
  const referencedImages = new Set(collectImagePaths(data));
  const allImageFiles = getAllImageFiles(IMAGES_DIR);
  
  const orphanedImages = allImageFiles.filter(img => !referencedImages.has(img));
  
  console.log(`📁 Total image files: ${allImageFiles.length}`);
  console.log(`🔗 Referenced in data: ${referencedImages.size}`);
  console.log(`🗑️  Orphaned images: ${orphanedImages.length}\n`);
  
  if (orphanedImages.length > 0 && orphanedImages.length < 50) {
    console.log('Orphaned images (not referenced in data.json):');
    orphanedImages.forEach(img => console.log(`  - ${img}`));
    console.log('');
  }
  
  return orphanedImages;
}

// Generate data statistics
function generateStats(data) {
  console.log('\n📊 Detailed Statistics...\n');
  
  data.categories.forEach(category => {
    let categoryProducts = 0;
    let categoryImages = 0;
    
    if (category.subcategories) {
      category.subcategories.forEach(subcategory => {
        if (subcategory.subsubcategories) {
          subcategory.subsubcategories.forEach(subsubcategory => {
            if (subsubcategory.products) {
              categoryProducts += subsubcategory.products.length;
              
              subsubcategory.products.forEach(product => {
                if (product.images) categoryImages += product.images.length;
              });
            }
          });
        }
      });
    }
    
    console.log(`📦 ${category.name}`);
    console.log(`   └─ Products: ${categoryProducts}`);
    console.log(`   └─ Images: ${categoryImages}\n`);
  });
}

// Main function
function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('📁 File-Based Database Management Utility');
  console.log('═══════════════════════════════════════════════\n');
  
  // Load and verify data
  const data = loadData();
  const isValid = verifyDataStructure(data);
  
  if (!isValid) {
    console.error('❌ Data validation failed. Please fix data.json structure.');
    process.exit(1);
  }
  
  // Check images
  const imagePaths = collectImagePaths(data);
  const imageCheck = checkImages(imagePaths);
  
  // Find orphaned images
  if (fs.existsSync(IMAGES_DIR)) {
    findOrphanedImages(data);
  } else {
    console.log('⚠️  Images directory not found:', IMAGES_DIR);
  }
  
  // Generate statistics
  generateStats(data);
  
  console.log('═══════════════════════════════════════════════');
  console.log('✅ Verification Complete');
  console.log('═══════════════════════════════════════════════\n');
  
  // Summary
  if (imageCheck.missing > 0) {
    console.log('⚠️  Warning: Some images referenced in data.json are missing.');
    console.log('   This might cause broken images on the website.\n');
  }
  
  console.log('💡 Tips:');
  console.log('   - Backup data regularly: cp app/data/data.json backups/');
  console.log('   - Optimize images before uploading');
  console.log('   - Use Admin Dashboard at /admin for managing products\n');
}

// Run main function
if (require.main === module) {
  main();
}

module.exports = {
  loadData,
  verifyDataStructure,
  collectImagePaths,
  checkImages,
  findOrphanedImages,
  generateStats
};
