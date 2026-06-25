/**
 * Image Upload Utility
 * 
 * This utility provides a simplified interface for uploading images with hierarchical folder organization.
 */

/**
 * Upload an image file to the server with hierarchical folder organization
 * 
 * @param {File} file - The image file to upload
 * @param {string} uploadType - Type of upload: 'category', 'subcategory', 'subsubcategory', or 'product'
 * @param {Object} metadata - Metadata for organizing the file
 * @param {string} metadata.categorySlug - Category slug (required for all types except category)
 * @param {string} metadata.subcategorySlug - Subcategory slug (required for subsubcategory and product)
 * @param {string} metadata.subsubcategorySlug - Sub-subcategory slug (required for product)
 * @param {string} metadata.productId - Product ID (required for product)
 * @returns {Promise<string|null>} - The uploaded image path or null if failed
 */
export async function uploadImage(file, uploadType = 'product', metadata = {}) {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadType', uploadType);
  
  // Add hierarchical metadata based on upload type
  if (metadata.categorySlug) formData.append('categorySlug', metadata.categorySlug);
  if (metadata.subcategorySlug) formData.append('subcategorySlug', metadata.subcategorySlug);
  if (metadata.subsubcategorySlug) formData.append('subsubcategorySlug', metadata.subsubcategorySlug);
  if (metadata.productId) formData.append('productId', metadata.productId);

  try {
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.path;
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Upload multiple images
 * 
 * @param {File[]} files - Array of image files to upload
 * @param {string} uploadType - Type of upload
 * @param {Object} metadata - Metadata for organizing the files
 * @returns {Promise<string[]>} - Array of uploaded image paths
 */
export async function uploadMultipleImages(files, uploadType, metadata) {
  const uploadPromises = files.map(file => uploadImage(file, uploadType, metadata));
  return Promise.all(uploadPromises);
}
