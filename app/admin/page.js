'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '../utils/imageUpload';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState({ categories: [] });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('categories');

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', slug: '', description: '', categorySlug: '' });
  const [newSubsubcategory, setNewSubsubcategory] = useState({ name: '', slug: '', description: '', categorySlug: '', subcategorySlug: '' });
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    overview: '',
    images: [], // Multiple images support
    categorySlug: '',
    subcategorySlug: '',
    subsubcategorySlug: '',
    specifications: {},
    features: [],
    variants: [] // Product variants
  });
  
  // Image states (only for products)
  const [productImages, setProductImages] = useState([]);
  const [productImagePreviews, setProductImagePreviews] = useState([]);
  
  // Variant states
  const [hasVariants, setHasVariants] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variantImages, setVariantImages] = useState([]);
  const [variantImagePreviews, setVariantImagePreviews] = useState([]);

  // Specification and feature management
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem('adminAuth', 'authenticated');
        setIsAuthenticated(true);
        loadData();
        showNotification('Login successful!', 'success');
      } else {
        showNotification('Incorrect password', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    showNotification('Logged out successfully', 'success');
  };

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/data');
      const json = await response.json();
      console.log('Loaded data:', json);
      setData(json);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Failed to load data', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleImageUpload = async (file, uploadType = 'product', metadata = {}) => {
    if (!file) return null;

    try {
      const path = await uploadImage(file, uploadType, metadata);
      return path;
    } catch (error) {
      showNotification('Error uploading image', 'error');
      return null;
    }
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setProductImages(files);
      const previews = [];
      let loadedCount = 0;
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          loadedCount++;
          if (loadedCount === files.length) {
            setProductImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVariantImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVariantImages(files);
      const previews = [];
      let loadedCount = 0;
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          loadedCount++;
          if (loadedCount === files.length) {
            setVariantImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddVariant = async () => {
    if (!variantName || variantImages.length === 0) {
      showNotification('Please provide variant name and at least one image', 'error');
      return;
    }

    setLoading(true);
    
    // Upload all variant images
    const imagePaths = [];
    for (const imageFile of variantImages) {
      const path = await handleImageUpload(imageFile, 'product', {
        categorySlug: newProduct.categorySlug,
        subcategorySlug: newProduct.subcategorySlug,
        subsubcategorySlug: newProduct.subsubcategorySlug,
        productId: newProduct.id || 'variant'
      });
      if (path) {
        imagePaths.push(path);
      }
    }
    
    setLoading(false);

    if (imagePaths.length > 0) {
      setNewProduct({
        ...newProduct,
        variants: [
          ...newProduct.variants, 
          { 
            name: variantName, 
            image: imagePaths[0], // Keep primary image for backward compatibility
            images: imagePaths // Store all uploaded images
          }
        ]
      });
      setVariantName('');
      setVariantImages([]);
      setVariantImagePreviews([]);
      showNotification('Variant added', 'success');
    } else {
      showNotification('Failed to upload variant images', 'error');
    }
  };

  const handleRemoveVariant = (index) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.filter((_, i) => i !== index)
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) {
      showNotification('Please enter a category name', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-category',
          data: newCategory
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Category added successfully!', 'success');
        setNewCategory({ name: '', slug: '', description: '' });
        loadData();
      } else {
        showNotification(result.error || 'Failed to add category', 'error');
      }
    } catch (error) {
      showNotification('Error adding category', 'error');
    }
    
    setLoading(false);
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategory.name || !newSubcategory.categorySlug) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-subcategory',
          categorySlug: newSubcategory.categorySlug,
          data: {
            name: newSubcategory.name,
            slug: newSubcategory.slug,
            description: newSubcategory.description
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Subcategory added successfully!', 'success');
        setNewSubcategory({ name: '', slug: '', description: '', categorySlug: '' });
        loadData();
      } else {
        showNotification(result.error || 'Failed to add subcategory', 'error');
      }
    } catch (error) {
      showNotification('Error adding subcategory', 'error');
    }
    
    setLoading(false);
  };

  const handleAddSubsubcategory = async (e) => {
    e.preventDefault();
    if (!newSubsubcategory.name || !newSubsubcategory.categorySlug || !newSubsubcategory.subcategorySlug) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-subsubcategory',
          categorySlug: newSubsubcategory.categorySlug,
          subcategorySlug: newSubsubcategory.subcategorySlug,
          data: {
            name: newSubsubcategory.name,
            slug: newSubsubcategory.slug,
            description: newSubsubcategory.description
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Sub-subcategory added successfully!', 'success');
        setNewSubsubcategory({ name: '', slug: '', description: '', categorySlug: '', subcategorySlug: '' });
        loadData();
      } else {
        showNotification(result.error || 'Failed to add sub-subcategory', 'error');
      }
    } catch (error) {
      showNotification('Error adding sub-subcategory', 'error');
    }
    
    setLoading(false);
  };


  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newProduct.name || !newProduct.id || !newProduct.categorySlug || !newProduct.subcategorySlug) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    // Get selected subcategory to check if it has sub-subcategories
    const selectedSubcategory = getSubcategoriesForCategory(newProduct.categorySlug)
      .find(s => s.slug === newProduct.subcategorySlug);
    
    // If subcategory has sub-subcategories, require selection
    if (selectedSubcategory?.subsubcategories?.length > 0 && !newProduct.subsubcategorySlug) {
      showNotification('Please select a sub-subcategory', 'error');
      return;
    }

    if (productImages.length === 0) {
      showNotification('Please upload at least one product image', 'error');
      return;
    }

    setLoading(true);

    // Upload all images
    const imagePaths = [];
    for (const imageFile of productImages) {
      const path = await handleImageUpload(imageFile, 'product', {
        categorySlug: newProduct.categorySlug,
        subcategorySlug: newProduct.subcategorySlug,
        subsubcategorySlug: newProduct.subsubcategorySlug,
        productId: newProduct.id
      });
      if (path) {
        imagePaths.push(path);
      }
    }

    if (imagePaths.length === 0) {
      showNotification('Failed to upload images', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-product',
          categorySlug: newProduct.categorySlug,
          subcategorySlug: newProduct.subcategorySlug,
          subsubcategorySlug: newProduct.subsubcategorySlug || null, // Can be null for subcategory-level products
          data: {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            image: imagePaths[0], // First image as main
            images: imagePaths, // All images
            variants: hasVariants ? newProduct.variants : [], // Add variants only if enabled
            details: {
              overview: newProduct.overview || newProduct.description,
              specifications: newProduct.specifications,
              features: newProduct.features
            }
          }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Product added successfully!', 'success');
        setNewProduct({
          id: '',
          name: '',
          description: '',
          overview: '',
          images: [],
          categorySlug: '',
          subcategorySlug: '',
          subsubcategorySlug: '',
          specifications: {},
          features: [],
          variants: []
        });
        setProductImages([]);
        setProductImagePreviews([]);
        setHasVariants(false);
        loadData();
      } else {
        showNotification(result.error || 'Failed to add product', 'error');
      }
    } catch (error) {
      showNotification('Error adding product', 'error');
    }
    
    setLoading(false);
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setNewProduct({
        ...newProduct,
        specifications: {
          ...newProduct.specifications,
          [specKey]: specValue
        }
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...newProduct.specifications };
    delete newSpecs[key];
    setNewProduct({ ...newProduct, specifications: newSpecs });
  };

  const addFeature = () => {
    if (featureInput) {
      setNewProduct({
        ...newProduct,
        features: [...newProduct.features, featureInput]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setNewProduct({
      ...newProduct,
      features: newProduct.features.filter((_, i) => i !== index)
    });
  };

  const handleDeleteSubsubcategory = async (categorySlug, subcategorySlug, subsubcategorySlug) => {
    if (!confirm('Are you sure you want to delete this sub-subcategory? This will also delete all its products.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-subsubcategory',
          categorySlug,
          subcategorySlug,
          data: { slug: subsubcategorySlug }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Sub-subcategory deleted successfully!', 'success');
        loadData();
      } else {
        showNotification(result.error || 'Failed to delete sub-subcategory', 'error');
      }
    } catch (error) {
      showNotification('Error deleting sub-subcategory', 'error');
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (categorySlug) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all its subcategories and products.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-category',
          data: { slug: categorySlug }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Category deleted successfully!', 'success');
        loadData();
      } else {
        showNotification(result.error || 'Failed to delete category', 'error');
      }
    } catch (error) {
      showNotification('Error deleting category', 'error');
    }
    setLoading(false);
  };

  const handleDeleteSubcategory = async (categorySlug, subcategorySlug) => {
    if (!confirm('Are you sure you want to delete this subcategory? This will also delete all its sub-subcategories and products.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-subcategory',
          categorySlug: categorySlug,
          data: { slug: subcategorySlug }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Subcategory deleted successfully!', 'success');
        loadData();
      } else {
        showNotification(result.error || 'Failed to delete subcategory', 'error');
      }
    } catch (error) {
      showNotification('Error deleting subcategory', 'error');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (categorySlug, subcategorySlug, subsubcategorySlug, productId) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-product',
          categorySlug: categorySlug,
          subcategorySlug: subcategorySlug,
          subsubcategorySlug: subsubcategorySlug,
          data: { productId: productId }
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Product deleted successfully!', 'success');
        loadData();
      } else {
        showNotification(result.error || 'Failed to delete product', 'error');
      }
    } catch (error) {
      showNotification('Error deleting product', 'error');
    }
    setLoading(false);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getSubcategoriesForCategory = (categorySlug) => {
    const category = data.categories?.find(c => c.slug === categorySlug);
    return category?.subcategories || [];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter password to manage catalog</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg animate-fade-in ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">Manage your product catalog ({data.categories?.length || 0} categories loaded)</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'subcategories'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Subcategories
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('subsubcategories')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'subsubcategories'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sub-subcategories
          </button>
        </div>

        {/* Category Form */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    setNewCategory({
                      ...newCategory,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="e.g., Beauty Instruments"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Slug: {newCategory.slug || 'auto-generated'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description of the category"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Category'}
              </button>
            </form>

            {/* List existing categories */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Categories ({data.categories?.length || 0})</h3>
              <div className="space-y-2">
                {data.categories?.map((cat) => (
                  <div key={cat.slug} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      <p className="text-sm text-gray-500">{cat.slug}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{cat.subcategories?.length || 0} subcategories</span>
                      <button
                        onClick={() => handleDeleteCategory(cat.slug)}
                        disabled={loading}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        title="Delete category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subcategory Form */}
        {activeTab === 'subcategories' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Subcategory</h2>
            <form onSubmit={handleAddSubcategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category *</label>
                <select
                  value={newSubcategory.categorySlug}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, categorySlug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {data.categories?.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Name *</label>
                <input
                  type="text"
                  value={newSubcategory.name}
                  onChange={(e) => {
                    setNewSubcategory({
                      ...newSubcategory,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="e.g., Cuticle Nippers"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Slug: {newSubcategory.slug || 'auto-generated'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSubcategory.description}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description of the subcategory"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Subcategory'}
              </button>
            </form>

            {/* List existing subcategories */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Subcategories</h3>
              <div className="space-y-4">
                {data.categories?.map((cat) => (
                  <div key={cat.slug}>
                    <h4 className="font-semibold text-gray-700 mb-2">{cat.name}</h4>
                    <div className="space-y-2 ml-4">
                      {cat.subcategories?.map((sub) => (
                        <div key={sub.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{sub.name}</p>
                            <p className="text-sm text-gray-500">{sub.slug}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              {(sub.products?.length || 0) + (sub.subsubcategories?.reduce((acc, subsub) => acc + (subsub.products?.length || 0), 0) || 0)} products
                            </span>
                            <button
                              onClick={() => handleDeleteSubcategory(cat.slug, sub.slug)}
                              disabled={loading}
                              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                              title="Delete subcategory"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subsubcategory Form */}
        {activeTab === 'subsubcategories' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Sub-subcategory</h2>
            <form onSubmit={handleAddSubsubcategory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newSubsubcategory.categorySlug}
                      onChange={(e) => setNewSubsubcategory({ ...newSubsubcategory, categorySlug: e.target.value, subcategorySlug: '' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {data.categories?.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                    <select
                      value={newSubsubcategory.subcategorySlug}
                      onChange={(e) => setNewSubsubcategory({ ...newSubsubcategory, subcategorySlug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                      disabled={!newSubsubcategory.categorySlug}
                    >
                      <option value="">Select a subcategory</option>
                      {getSubcategoriesForCategory(newSubsubcategory.categorySlug).map((sub) => (
                        <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-subcategory Name *</label>
                <input
                  type="text"
                  value={newSubsubcategory.name}
                  onChange={(e) => {
                    setNewSubsubcategory({
                      ...newSubsubcategory,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="e.g., Standard Cuticle Nippers"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Slug: {newSubsubcategory.slug || 'auto-generated'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSubsubcategory.description}
                  onChange={(e) => setNewSubsubcategory({ ...newSubsubcategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief description"
                />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Sub-subcategory'}
              </button>
            </form>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Sub-subcategories</h3>
                <div className="space-y-4">
                    {data.categories?.map((cat) => (
                        cat.subcategories?.map((sub) => (
                            sub.subsubcategories && sub.subsubcategories.length > 0 && (
                            <div key={sub.slug}>
                                <h4 className="font-semibold text-gray-700 mb-2">{cat.name} &gt; {sub.name}</h4>
                                <div className="space-y-2 ml-4">
                                    {sub.subsubcategories.map((subsub) => (
                                        <div key={subsub.slug} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{subsub.name}</p>
                                                <p className="text-sm text-gray-500">{subsub.slug}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-600">{subsub.products?.length || 0} products</span>
                                                <button onClick={() => handleDeleteSubsubcategory(cat.slug, sub.slug, subsub.slug)} className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            )
                        ))
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* Product Form */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              {/* Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={newProduct.categorySlug}
                    onChange={(e) => {
                      setNewProduct({
                        ...newProduct,
                        categorySlug: e.target.value,
                        subcategorySlug: '',
                        subsubcategorySlug: ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {data.categories?.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                  <select
                    value={newProduct.subcategorySlug}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategorySlug: e.target.value, subsubcategorySlug: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    disabled={!newProduct.categorySlug}
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {getSubcategoriesForCategory(newProduct.categorySlug).map((sub) => (
                      <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sub-subcategory - Only show if subcategory has sub-subcategories */}
                {newProduct.subcategorySlug && 
                 getSubcategoriesForCategory(newProduct.categorySlug)
                   .find(s => s.slug === newProduct.subcategorySlug)?.subsubcategories?.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-subcategory *</label>
                    <select
                      value={newProduct.subsubcategorySlug}
                      onChange={(e) => setNewProduct({ ...newProduct, subsubcategorySlug: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      disabled={!newProduct.subcategorySlug}
                      required
                    >
                      <option value="">Select a sub-subcategory</option>
                      {getSubcategoriesForCategory(newProduct.categorySlug)
                          .find(s => s.slug === newProduct.subcategorySlug)?.subsubcategories?.map((subsub) => (
                        <option key={subsub.slug} value={subsub.slug}>{subsub.name}</option>
                      ))}
                    </select>
                  </div>
                ) : newProduct.subcategorySlug ? (
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-cyan-800">
                        <strong>Note:</strong> This subcategory has no sub-subcategories. The product will be added directly to the subcategory.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Product Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product ID *</label>
                <input
                  type="text"
                  value={newProduct.id}
                  onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="BI-CN-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Pro Cuticle Nipper - Single Spring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows="3"
                  placeholder="Brief product description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview (optional)</label>
                <textarea
                  value={newProduct.overview}
                  onChange={(e) => setNewProduct({ ...newProduct, overview: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows="2"
                  placeholder="Detailed overview (optional, defaults to description)"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Key (e.g., Material)"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Value (e.g., Stainless Steel)"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {Object.entries(newProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm"><strong>{key}:</strong> {value}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Add a feature"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {newProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants Toggle */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="hasVariants"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <label htmlFor="hasVariants" className="text-gray-900 font-medium">
                    Does this product have variants?
                  </label>
                </div>

                {hasVariants && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Variant Name</label>
                        <input
                          type="text"
                          value={variantName}
                          onChange={(e) => setVariantName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          placeholder="e.g. Silver, Gold, 20cm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Variant Images</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleVariantImagesChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Select multiple images if needed.</p>
                      </div>
                      <div className="md:col-span-2">
                        {variantImagePreviews.length > 0 && (
                          <div className="mb-4 grid grid-cols-4 gap-2">
                            {variantImagePreviews.map((preview, idx) => (
                              <img key={idx} src={preview} alt={`Variant Preview ${idx}`} className="h-24 w-full object-cover rounded-lg border border-gray-200 bg-white" />
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={handleAddVariant}
                          disabled={loading || !variantName || variantImages.length === 0}
                          className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Variant
                        </button>
                      </div>
                    </div>

                    {newProduct.variants.length > 0 && (
                      <div className="space-y-2 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Added Variants</label>
                        <div className="grid grid-cols-1 gap-2">
                          {newProduct.variants.map((variant, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                              <div className="flex items-center gap-4">
                                {variant.image && (
                                  <div className="relative">
                                    <img src={variant.image} alt={variant.name} className="w-12 h-12 object-cover rounded-md bg-gray-100" />
                                    {variant.images && variant.images.length > 1 && (
                                      <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-white">
                                        +{variant.images.length - 1}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <span className="font-medium text-gray-900">{variant.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(index)}
                                className="text-red-500 hover:text-red-700 p-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Product Images - Multiple */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images * (Multiple images supported)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleProductImagesChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">You can select multiple images. They will all appear on the product page.</p>
                {productImagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {productImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index === 0 ? 'Main' : `Image ${index + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </form>

            {/* List existing products */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Products</h3>
              <div className="space-y-4">
                {data.categories?.map((cat) => (
                  <div key={cat.slug}>
                    <h4 className="font-semibold text-gray-700 mb-2">{cat.name}</h4>
                    {cat.subcategories?.map((sub) => (
                      <div key={sub.slug} className="ml-4 mb-4">
                        <h5 className="font-medium text-gray-600 mb-2">{sub.name}</h5>
                        
                        {/* Products directly in subcategory */}
                        {sub.products && sub.products.length > 0 && (
                          <div className="space-y-2 ml-4 mb-4">
                            <h6 className="text-sm font-semibold text-cyan-600 mb-2">Products in {sub.name}</h6>
                            {sub.products.map((product) => (
                              <div key={product.id} className="flex items-center gap-4 p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors border-l-4 border-cyan-500">
                                {product.image && (
                                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-sm text-gray-500">{product.id}</p>
                                </div>
                                {product.images && (
                                  <span className="text-xs text-cyan-600 bg-white px-2 py-1 rounded">
                                    {product.images.length} images
                                  </span>
                                )}
                                <button
                                  onClick={() => handleDeleteProduct(cat.slug, sub.slug, null, product.id)}
                                  disabled={loading}
                                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                  title="Delete product"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Products in sub-subcategories */}
                        {sub.subsubcategories?.length > 0 ? (
                            <div className="space-y-2 ml-4">
                                {sub.subsubcategories.map((subsub) => (
                                    <div key={subsub.slug} className="mb-4">
                                        <h6 className="text-sm font-semibold text-gray-500 mb-2 border-b pb-1">{subsub.name}</h6>
                                        <div className="space-y-2 ml-2">
                                            {subsub.products?.length > 0 ? (
                                                subsub.products.map((product) => (
                                                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    {product.image && (
                                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-sm text-gray-500">{product.id}</p>
                                                    </div>
                                                    {product.images && (
                                                        <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                                                        {product.images.length} images
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteProduct(cat.slug, sub.slug, subsub.slug, product.id)}
                                                        disabled={loading}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                        title="Delete product"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No products in this sub-subcategory</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !sub.products || sub.products.length === 0 ? (
                            <div className="ml-4 text-sm text-gray-400 italic">No products or sub-subcategories</div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
