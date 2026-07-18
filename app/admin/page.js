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
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [heroSearchQueries, setHeroSearchQueries] = useState({});

  const toggleExpand = (type, key) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${type}-${key}`]: !prev[`${type}-${key}`]
    }));
  };

  const handleHeroSearchChange = (catSlug, value) => {
    setHeroSearchQueries(prev => ({ ...prev, [catSlug]: value }));
  };

  const getProductsForCategory = (catSlug) => {
    const list = [];
    const cat = data.categories?.find(c => c.slug === catSlug);
    if (!cat) return [];
    
    cat.subcategories?.forEach(sub => {
      if (sub.products) {
        sub.products.forEach(p => {
          list.push({ ...p, path: `${cat.name} > ${sub.name}` });
        });
      }
      if (sub.subsubcategories) {
        sub.subsubcategories.forEach(subsub => {
          if (subsub.products) {
            subsub.products.forEach(p => {
              list.push({ ...p, path: `${cat.name} > ${sub.name} > ${subsub.name}` });
            });
          }
        });
      }
    });
    return list;
  };

  const getFilteredHeroProducts = (catSlug) => {
    const list = getProductsForCategory(catSlug);
    const query = heroSearchQueries[catSlug]?.toLowerCase().trim() || '';
    if (!query) return list;
    return list.filter(p => 
      p.name?.toLowerCase().includes(query) || 
      p.id?.toLowerCase().includes(query) ||
      p.path?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  };

  const handleToggleHeroProduct = async (catSlug, productId) => {
    setLoading(true);
    const currentHeroIds = data.heroProducts?.[catSlug] || [];
    
    if (!currentHeroIds.includes(productId) && currentHeroIds.length >= 3) {
      showNotification('You can only feature up to 3 products per category in the hero section.', 'error');
      setLoading(false);
      return;
    }

    const newHeroIds = currentHeroIds.includes(productId)
      ? currentHeroIds.filter(id => id !== productId)
      : [...currentHeroIds, productId];

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-hero-products',
          categorySlug: catSlug,
          data: { productIds: newHeroIds }
        })
      });
      const result = await response.json();
      if (result.success) {
        showNotification('Hero products updated successfully!', 'success');
        loadData();
      } else {
        showNotification(result.error || 'Failed to update hero products', 'error');
      }
    } catch (error) {
      showNotification('Error updating hero products', 'error');
    }
    setLoading(false);
  };

  const getFilteredProducts = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const results = [];
    
    data.categories?.forEach(cat => {
      cat.subcategories?.forEach(sub => {
        // Direct subcategory products
        sub.products?.forEach(product => {
          if (
            product.name?.toLowerCase().includes(query) ||
            product.id?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
          ) {
            results.push({
              ...product,
              catSlug: cat.slug,
              subSlug: sub.slug,
              subsubSlug: null,
              path: `${cat.name} > ${sub.name}`
            });
          }
        });
        
        // Nested sub-subcategory products
        sub.subsubcategories?.forEach(subsub => {
          subsub.products?.forEach(product => {
            if (
              product.name?.toLowerCase().includes(query) ||
              product.id?.toLowerCase().includes(query) ||
              product.description?.toLowerCase().includes(query)
            ) {
              results.push({
                ...product,
                catSlug: cat.slug,
                subSlug: sub.slug,
                subsubSlug: subsub.slug,
                path: `${cat.name} > ${sub.name} > ${subsub.name}`
              });
            }
          });
        });
      });
    });
    
    return results;
  };
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
      const response = await fetch('/api/admin/data', { cache: 'no-store' });
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

    setLoading(true);

    let imagePaths = [];
    
    if (productImages.length > 0) {
      // Upload all new images
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
    } else {
      if (editingProduct) {
        imagePaths = newProduct.images || [];
      } else {
        showNotification('Please upload at least one product image', 'error');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editingProduct ? 'update-product' : 'add-product',
          categorySlug: newProduct.categorySlug,
          subcategorySlug: newProduct.subcategorySlug,
          subsubcategorySlug: newProduct.subsubcategorySlug || null,
          data: {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description,
            image: imagePaths[0] || '/placeholder.jpg',
            images: imagePaths,
            variants: hasVariants ? newProduct.variants : [],
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
        showNotification(editingProduct ? 'Product updated successfully!' : 'Product added successfully!', 'success');
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
        setEditingProduct(null);
        loadData();
      } else {
        showNotification(result.error || 'Failed to process product', 'error');
      }
    } catch (error) {
      showNotification('Error processing product', 'error');
    }
    
    setLoading(false);
  };

  const handleFormatTextarea = (field, formatType) => {
    const textarea = document.getElementById(`product-${field}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    switch (formatType) {
      case 'bold':
        replacement = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'italic text'}</em>`;
        break;
      case 'bullet':
        if (selectedText) {
          replacement = selectedText
            .split('\n')
            .map(line => line.trim().startsWith('•') ? line : `• ${line}`)
            .join('\n');
        } else {
          replacement = '• ';
        }
        break;
      case 'newline':
        replacement = '<br>\n';
        break;
      case 'clear':
        // Strip HTML tags
        replacement = selectedText.replace(/<[^>]*>/g, '');
        break;
      default:
        return;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    
    setNewProduct(prev => ({
      ...prev,
      [field]: newValue
    }));

    // Focus and select the modified text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + replacement.length);
    }, 0);
  };

  const startEditing = (catSlug, subSlug, subsubSlug, product) => {
    setEditingProduct(product);
    setNewProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      overview: product.details?.overview || product.description,
      images: product.images || [product.image],
      categorySlug: catSlug,
      subcategorySlug: subSlug,
      subsubcategorySlug: subsubSlug || '',
      specifications: product.details?.specifications || {},
      features: product.details?.features || [],
      variants: product.variants || []
    });
    setProductImagePreviews(product.images || [product.image]);
    setHasVariants(product.variants && product.variants.length > 0);
    
    // Smooth scroll to the product form title
    document.getElementById('product-form-title')?.scrollIntoView({ behavior: 'smooth' });
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
    if (!confirm('WARNING: This will permanently delete this sub-subcategory and all its products. Confirm a second time to proceed.')) {
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
    if (!confirm('WARNING: This will permanently delete this category, all its subcategories, and all its products. Confirm a second time to proceed.')) {
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
    if (!confirm('WARNING: This will permanently delete this subcategory, all its sub-subcategories, and all its products. Confirm a second time to proceed.')) {
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
    if (!confirm('WARNING: This will permanently delete this product. Confirm a second time to proceed.')) {
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
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'hero'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Hero Section
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
            <h2 id="product-form-title" className="text-xl font-bold text-gray-900 mb-6">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
            </h2>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    disabled={!!editingProduct}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                    disabled={!!editingProduct}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                      disabled={!!editingProduct}
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-gray-50 disabled:opacity-75 disabled:cursor-not-allowed"
                  placeholder="BI-CN-001"
                  disabled={!!editingProduct}
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
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('description', 'bold')}
                      className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('description', 'italic')}
                      className="px-2.5 py-1 text-xs italic text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('description', 'bullet')}
                      className="px-2 py-1 text-xs text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer flex items-center gap-0.5"
                      title="Bullet Point"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('description', 'newline')}
                      className="px-2 py-1 text-xs text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                      title="New Line"
                    >
                      ↵ Line
                    </button>
                    <span className="w-px bg-gray-300 mx-1"></span>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('description', 'clear')}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                      title="Clear Formatting"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  id="product-description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-sans text-sm"
                  rows="4"
                  placeholder="Brief product description (HTML tags allowed)"
                  required
                />
                {newProduct.description && (
                  <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Live Preview:</span>
                    <span className="text-sm text-gray-700 block whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: newProduct.description }} />
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Overview (optional)</label>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('overview', 'bold')}
                      className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('overview', 'italic')}
                      className="px-2.5 py-1 text-xs italic text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('overview', 'bullet')}
                      className="px-2 py-1 text-xs text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer flex items-center gap-0.5"
                      title="Bullet Point"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('overview', 'newline')}
                      className="px-2 py-1 text-xs text-gray-700 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                      title="New Line"
                    >
                      ↵ Line
                    </button>
                    <span className="w-px bg-gray-300 mx-1"></span>
                    <button
                      type="button"
                      onClick={() => handleFormatTextarea('overview', 'clear')}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-all cursor-pointer"
                      title="Clear Formatting"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  id="product-overview"
                  value={newProduct.overview}
                  onChange={(e) => setNewProduct({ ...newProduct, overview: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-sans text-sm"
                  rows="3"
                  placeholder="Detailed overview (optional, defaults to description, HTML tags allowed)"
                />
                {newProduct.overview && (
                  <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Live Preview:</span>
                    <span className="text-sm text-gray-700 block whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: newProduct.overview }} />
                  </div>
                )}
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

              <div className="flex gap-4">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
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
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-all shadow cursor-pointer text-center"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading 
                    ? (editingProduct ? 'Saving...' : 'Adding Product...') 
                    : (editingProduct ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>

            {/* List existing products */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Products</h3>
              
              {/* Search Bar */}
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, ID, or description..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-xs text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {searchQuery.trim() ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">
                    Search Results ({getFilteredProducts().length} found)
                  </h4>
                  {getFilteredProducts().length > 0 ? (
                    <div className="space-y-3">
                      {getFilteredProducts().map((product, idx) => (
                        <div key={`${product.id}-${idx}`} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-cyan-300 transition-colors">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.id}</p>
                            <p className="text-[10px] text-cyan-600 mt-1 font-medium bg-cyan-50 inline-block px-2 py-0.5 rounded">
                              {product.path}
                            </p>
                          </div>
                          {product.images && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded hidden sm:inline-block">
                              {product.images.length} images
                            </span>
                          )}
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => startEditing(product.catSlug, product.subSlug, product.subsubSlug, product)}
                              disabled={loading}
                              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                              title="Edit product"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.catSlug, product.subSlug, product.subsubSlug, product.id)}
                              disabled={loading}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                              title="Delete product"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-sm text-gray-500 italic">No products matched &quot;{searchQuery}&quot;</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {data.categories?.map((cat) => (
                    <div key={cat.slug} className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm bg-white">
                      {/* Category Toggle Header */}
                      <button
                        type="button"
                        onClick={() => toggleExpand('category', cat.slug)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200 text-left font-bold text-gray-800 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          {cat.name}
                          <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full ml-1">
                            {cat.subcategories?.length || 0} subcategories
                          </span>
                        </span>
                        <svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${expandedItems[`category-${cat.slug}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Category Content */}
                      {expandedItems[`category-${cat.slug}`] && (
                        <div className="p-4 space-y-4 bg-white divide-y divide-gray-100">
                          {cat.subcategories && cat.subcategories.length > 0 ? (
                            cat.subcategories.map((sub) => {
                              const subKey = `${cat.slug}-${sub.slug}`;
                              return (
                                <div key={sub.slug} className="pt-4 first:pt-0">
                                  {/* Subcategory Toggle Header */}
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand('subcategory', subKey)}
                                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors text-left font-semibold text-gray-700 cursor-pointer"
                                  >
                                    <span className="flex items-center gap-2 text-sm sm:text-base">
                                      <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                      </svg>
                                      {sub.name}
                                      <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded ml-1">
                                        {sub.subsubcategories?.length > 0
                                          ? `${sub.subsubcategories.length} sub-subcategories`
                                          : `${sub.products?.length || 0} products`}
                                      </span>
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedItems[`subcategory-${subKey}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>

                                  {/* Subcategory Content */}
                                  {expandedItems[`subcategory-${subKey}`] && (
                                    <div className="mt-3 pl-4 space-y-4">
                                      {/* Products directly in subcategory */}
                                      {sub.products && sub.products.length > 0 && (
                                        <div className="space-y-2">
                                          <h6 className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">Direct Products</h6>
                                          {sub.products.map((product, idx) => (
                                            <div key={`${product.id}-${idx}`} className="flex items-center gap-4 p-3 bg-cyan-50/50 rounded-lg hover:bg-cyan-50 transition-colors border-l-4 border-cyan-400">
                                              {product.image && (
                                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                              )}
                                              <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.id}</p>
                                              </div>
                                              {product.images && (
                                                <span className="text-[10px] text-cyan-700 bg-white px-2 py-0.5 rounded border border-cyan-100">
                                                  {product.images.length} images
                                                </span>
                                              )}
                                              <div className="flex gap-1.5">
                                                <button
                                                  type="button"
                                                  onClick={() => startEditing(cat.slug, sub.slug, null, product)}
                                                  disabled={loading}
                                                  className="px-2.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded transition cursor-pointer"
                                                  title="Edit product"
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteProduct(cat.slug, sub.slug, null, product.id)}
                                                  disabled={loading}
                                                  className="px-2.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded transition cursor-pointer"
                                                  title="Delete product"
                                                >
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Products in sub-subcategories */}
                                      {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
                                        <div className="space-y-3">
                                          {sub.subsubcategories.map((subsub) => {
                                            const subsubKey = `${cat.slug}-${sub.slug}-${subsub.slug}`;
                                            return (
                                              <div key={subsub.slug} className="border border-gray-100 rounded-lg p-2.5 bg-gray-50/50">
                                                {/* Sub-subcategory Header */}
                                                <button
                                                  type="button"
                                                  onClick={() => toggleExpand('subsubcategory', subsubKey)}
                                                  className="w-full flex items-center justify-between py-1 px-2 text-sm font-semibold text-gray-600 cursor-pointer"
                                                >
                                                  <span className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {subsub.name}
                                                    <span className="text-[10px] font-normal text-gray-400 bg-gray-200/60 px-1.5 py-0.5 rounded ml-1">
                                                      {subsub.products?.length || 0} products
                                                    </span>
                                                  </span>
                                                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${expandedItems[`subsubcategory-${subsubKey}`] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                  </svg>
                                                </button>

                                                {/* Sub-subcategory Content */}
                                                {expandedItems[`subsubcategory-${subsubKey}`] && (
                                                  <div className="mt-2 space-y-2 pl-2">
                                                    {subsub.products && subsub.products.length > 0 ? (
                                                      subsub.products.map((product, idx) => (
                                                        <div key={`${product.id}-${idx}`} className="flex items-center gap-4 p-2.5 bg-white border border-gray-200 rounded-md shadow-xs hover:border-cyan-300 transition-colors">
                                                          {product.image && (
                                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                                          )}
                                                          <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-xs text-gray-800 truncate">{product.name}</p>
                                                            <p className="text-[10px] text-gray-400">{product.id}</p>
                                                          </div>
                                                          {product.images && (
                                                            <span className="text-[9px] text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded hidden sm:inline-block">
                                                              {product.images.length} images
                                                            </span>
                                                          )}
                                                          <div className="flex gap-1.5">
                                                            <button
                                                              type="button"
                                                              onClick={() => startEditing(cat.slug, sub.slug, subsub.slug, product)}
                                                              disabled={loading}
                                                              className="px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-[11px] font-semibold rounded transition cursor-pointer"
                                                              title="Edit product"
                                                            >
                                                              Edit
                                                            </button>
                                                            <button
                                                              type="button"
                                                              onClick={() => handleDeleteProduct(cat.slug, sub.slug, subsub.slug, product.id)}
                                                              disabled={loading}
                                                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold rounded transition cursor-pointer"
                                                              title="Delete product"
                                                            >
                                                              Delete
                                                            </button>
                                                          </div>
                                                        </div>
                                                      ))
                                                    ) : (
                                                      <p className="text-xs text-gray-400 italic pl-6 py-1">No products in this sub-subcategory</p>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      ) : !sub.products || sub.products.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic">No products or sub-subcategories available</p>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-sm text-gray-400 italic py-2">No subcategories in this category</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Configure Hero Section Featured Products</h2>
              <p className="text-sm text-gray-500">Feature up to 3 custom products per main category in the homepage hero carousel. If none are selected, the first 3 products in that category will be featured automatically.</p>
            </div>

            <div className="space-y-8">
              {data.categories?.map((cat) => {
                const selectedHeroIds = data.heroProducts?.[cat.slug] || [];
                const catProducts = getProductsForCategory(cat.slug);
                const query = heroSearchQueries[cat.slug] || '';
                const filteredProducts = getFilteredHeroProducts(cat.slug);

                return (
                  <div key={cat.slug} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-6">
                    {/* Category Title */}
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {cat.name}
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                          {catProducts.length} total products
                        </span>
                      </h3>
                    </div>

                    {/* Active Selected Products in this Category */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Featured Products in {cat.name} ({selectedHeroIds.length} selected)
                      </h4>
                      {selectedHeroIds.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {selectedHeroIds.map((id, index) => {
                            const product = catProducts.find(p => p.id === id);
                            if (!product) return null;
                            return (
                              <div key={`${id}-${index}`} className="flex items-center gap-3 p-3 bg-cyan-50/50 rounded-xl border border-cyan-150 shadow-xs animate-fade-in">
                                {product.image && (
                                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg bg-white border" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 text-xs truncate">{product.name}</p>
                                  <p className="text-[10px] text-gray-500 truncate">{product.id}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleHeroProduct(cat.slug, product.id)}
                                  disabled={loading}
                                  className="p-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded cursor-pointer transition"
                                  title="Remove from featured list"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-xs flex items-center gap-2">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>No custom featured products selected. The hero section will automatically display the first 3 products of this category.</span>
                        </div>
                      )}
                    </div>

                    {/* Manage / Search / Add products */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Search and Feature Products
                      </h4>
                      
                      {/* Category-Specific Search Bar */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => handleHeroSearchChange(cat.slug, e.target.value)}
                          placeholder={`Search products in ${cat.name}...`}
                          className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-xs text-xs"
                        />
                        {query && (
                          <button
                            type="button"
                            onClick={() => handleHeroSearchChange(cat.slug, '')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Products List for selection */}
                      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1.5 border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product, idx) => {
                            const isFeatured = selectedHeroIds.includes(product.id);
                            return (
                              <div key={`${product.id}-${idx}`} className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-lg shadow-xs border border-gray-150 hover:border-cyan-200 transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {product.image && (
                                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md bg-gray-50 border" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-xs truncate">{product.name}</p>
                                    <p className="text-[9px] text-gray-500 truncate">{product.id} • {product.path}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleHeroProduct(cat.slug, product.id)}
                                  disabled={loading}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                    isFeatured
                                      ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                                      : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                                  }`}
                                >
                                  {isFeatured ? '★ Featured' : 'Feature Product'}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center py-4 text-xs text-gray-400 italic">No products found in this category.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
