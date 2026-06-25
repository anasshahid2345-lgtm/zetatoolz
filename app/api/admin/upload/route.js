import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

/**
 * Enhanced Image Upload API with Hierarchical Folder Organization
 * 
 * This endpoint organizes uploaded images into a hierarchical folder structure:
 * - Categories: /images/categories/{categorySlug}/
 * - Subcategories: /images/categories/{categorySlug}/subcategories/{subcategorySlug}/
 * - Subsubcategories: /images/categories/{categorySlug}/subcategories/{subcategorySlug}/subsubcategories/{subsubcategorySlug}/
 * - Products: /images/categories/{categorySlug}/subcategories/{subcategorySlug}/subsubcategories/{subsubcategorySlug}/products/{productId}/
 */

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const uploadType = formData.get('uploadType') || 'product'; // category, subcategory, subsubcategory, product
    const categorySlug = formData.get('categorySlug') || '';
    const subcategorySlug = formData.get('subcategorySlug') || '';
    const subsubcategorySlug = formData.get('subsubcategorySlug') || '';
    const productId = formData.get('productId') || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build hierarchical folder path based on upload type
    let folderPath = 'images';
    
    switch (uploadType) {
      case 'category':
        folderPath = path.join('images', 'categories', categorySlug || 'uncategorized');
        break;
      case 'subcategory':
        folderPath = path.join('images', 'categories', categorySlug, 'subcategories', subcategorySlug || 'uncategorized');
        break;
      case 'subsubcategory':
        folderPath = path.join('images', 'categories', categorySlug, 'subcategories', subcategorySlug, 'subsubcategories', subsubcategorySlug || 'uncategorized');
        break;
      case 'product':
      default:
        folderPath = path.join('images', 'categories', categorySlug, 'subcategories', subcategorySlug, 'subsubcategories', subsubcategorySlug, 'products', productId || 'temp');
        break;
    }

    // Create upload path
    const uploadDir = path.join(process.cwd(), 'public', folderPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate filename (keeping original name with sanitization)
    const originalName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;
    const filepath = path.join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return the relative path to be stored in JSON (web-accessible path)
    const relativePath = `/${folderPath.replace(/\\/g, '/')}/${filename}`;

    console.log(`✅ Image uploaded successfully: ${relativePath}`);

    return NextResponse.json({
      success: true,
      path: relativePath,
      filename: filename,
      uploadType: uploadType
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
