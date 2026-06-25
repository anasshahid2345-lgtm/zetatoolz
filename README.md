# Zeta Tools - B2B E-Commerce Platform

A modern, file-based B2B e-commerce platform built with Next.js, featuring a complete admin dashboard and organized product catalog management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

## ✨ Key Features

- 🛍️ **B2B E-Commerce** - Price on request workflow
- 📂 **4-Tier Product Hierarchy** - Categories → Subcategories → Sub-subcategories → Products
- 🖼️ **Multi-Image Support** - Multiple images per product + variants
- 🗄️ **File-Based Database** - No MongoDB/PostgreSQL required!
- 📁 **Organized Image Storage** - Hierarchical folder structure
- 🎛️ **Admin Dashboard** - Complete CRUD operations
- 🔍 **Product Search** - Real-time filtering
- 📱 **Responsive Design** - Mobile-first approach
- 🎨 **Modern UI** - TailwindCSS with smooth animations

## 📚 Documentation

### Essential Reading

1. **[README_FILE_BASED_SYSTEM.md](./README_FILE_BASED_SYSTEM.md)** 
   - 📖 **START HERE** - Complete overview and migration summary
   - All you need to know about the new system

2. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** 
   - ⚡ Quick command reference
   - Common tasks and troubleshooting

3. **[FOLDER_STRUCTURE_GUIDE.md](./FOLDER_STRUCTURE_GUIDE.md)** 
   - 📂 Visual folder structure guide
   - Real-world examples

### Detailed Guides

4. **[FILE_BASED_DATABASE.md](./FILE_BASED_DATABASE.md)** 
   - 🗄️ Complete database system documentation
   - How everything works under the hood

5. **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** 
   - 🔄 MongoDB to file-based migration guide
   - What changed and why

## 🗄️ Database System

This project uses a **100% file-based system** - no traditional database required!

### Data Storage

**All catalog data**: `app/data/data.json`
```json
{
  "categories": [ /* Your entire product catalog */ ]
}
```

**All images**: Organized hierarchically in `public/images/categories/`
```
public/images/categories/
└── {category}/
    └── subcategories/
        └── {subcategory}/
            └── subsubcategories/
                └── {subsubcategory}/
                    └── products/
                        └── {product-id}/
                            └── images...
```

### Benefits

- ✅ **No database server** - Deploy anywhere
- ✅ **Simple backups** - Just copy files
- ✅ **Git-friendly** - Version control your data
- ✅ **Portable** - Move between hosting platforms easily
- ✅ **Cost-effective** - Zero database hosting fees

## 🎛️ Admin Dashboard

**Access**: `/admin`
**Password**: `admin123` (⚠️ change this!)

### Features

- Add/Edit/Delete Categories
- Add/Edit/Delete Subcategories
- Add/Edit/Delete Sub-subcategories
- Add/Edit/Delete Products
- Upload multiple product images
- Product variants with images
- Real-time data updates

### Admin Usage

```bash
# 1. Start development server
npm run dev

# 2. Navigate to admin
http://localhost:3000/admin

# 3. Login
Password: admin123

# 4. Start managing products!
```

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Database Management
npm run verify-db        # Verify data.json integrity
npm run backup-data      # Backup data.json with timestamp
```

## 🛠️ Project Structure

```
zetatoolz/
├── app/
│   ├── data/
│   │   ├── data.json           ← YOUR ENTIRE CATALOG
│   │   ├── categories.js       ← Helper functions
│   │   └── backups/            ← Auto backups
│   ├── api/admin/              ← Admin API routes
│   ├── admin/                  ← Admin dashboard
│   ├── components/             ← React components
│   └── utils/                  ← Utility functions
├── public/
│   └── images/categories/      ← Organized images
├── verify-database.js          ← Database verification tool
└── Documentation files         ← *.md guides
```

## 🚀 Deployment

### ⚠️ Important: Admin Panel Requires VPS

**File uploads only work on VPS/traditional hosting!** Product uploads from the admin panel need a server with a writable filesystem.

### VPS Deployment (Recommended for Admin Panel) ✅

For **full admin functionality** with product uploads from any computer:

📚 **See:** [DEPLOY_TO_VPS.md](./DEPLOY_TO_VPS.md) - Quick 5-minute guide  
📖 **Full Guide:** [VPS_DEPLOYMENT_GUIDE.md](./VPS_DEPLOYMENT_GUIDE.md) - Complete instructions

**Quick Summary:**
```bash
# On your VPS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
cd /var/www && sudo git clone YOUR-REPO
cd zetatoolz && sudo npm install && sudo npm run build
sudo npm install -g pm2
pm2 start npm --name "zetatoolz" -- start
sudo chmod -R 777 app/data public/images
```

**Admin Panel:** `http://your-server-ip:3000/admin` ✅

---

### Vercel/Netlify (Frontend Only) ⚠️

**Note:** Admin uploads won't work on serverless platforms!

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 2. Deploy on Vercel
# - Connect your GitHub repo
# - Deploy!
```

**For admin functionality on Vercel, you'll need to migrate to:**
- **Vercel Blob** for images
- **MongoDB Atlas** or **Vercel Postgres** for data


## 🔒 Security

1. **Change Admin Password**
   - Edit `app/admin/page.js` line 65
   - Replace `'admin123'` with your secure password

2. **File Permissions** (on server)
   ```bash
   chmod -R 755 app/data
   chmod -R 755 public/images
   ```

3. **Environment Variables**
   - Add `.env.local` for sensitive data
   - Already gitignored

## 🧪 Testing

```bash
# 1. Verify data integrity
npm run verify-db

# 2. Start dev server
npm run dev

# 3. Test admin dashboard
# - Add a test category
# - Add a test product with images
# - Verify on frontend

# 4. Build for production
npm run build

# 5. Test production build
npm start
```

## 📊 Database Verification

Run the verification tool to check your data:

```bash
npm run verify-db
```

**Output:**
- ✅ Data structure validation
- 📊 Statistics (categories, products, images)
- 🔍 Missing image detection
- 🗑️ Orphaned file detection

## 💾 Backup Strategy

### Automatic (Recommended)

```bash
# Backup data.json with timestamp
npm run backup-data
```

Saves to: `app/data/backups/data-YYYY-MM-DD.json`

### Git Version Control (Best)

```bash
git add app/data/data.json public/images/
git commit -m "Update catalog $(date)"
git push
```

## 🐛 Troubleshooting

### Images not showing

```bash
npm run verify-db
```
Check for missing images in the report.

### Admin not saving

1. Check browser console
2. Verify `app/data/data.json` is writable
3. Test API endpoint: `http://localhost:3000/api/admin/data`

### Build errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📈 Performance

**Current Capacity:**
- ✅ 1,000-5,000 products efficiently
- ✅ Sub-second page loads
- ✅ Lazy-loaded images
- ✅ Optimized JSON parsing

**Scalability:**
- For 10,000+ products: Consider category-based JSON splitting
- Use CDN for image delivery
- Enable gzip compression

## 🛣️ Roadmap

- [ ] User authentication for admin
- [ ] Bulk product import/export
- [ ] Advanced search filters
- [ ] Product analytics dashboard
- [ ] Multi-language support
- [ ] Image optimization pipeline

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For questions or issues:

1. Check the documentation files (*.md)
2. Run `npm run verify-db` for data issues
3. Review browser console for errors
4. Check the admin dashboard logs

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **React**: https://react.dev

---

## 🎉 Key Highlights

### What Makes This Special?

1. **No Database Server** - Everything is file-based
2. **Organized Images** - Hierarchical folder structure
3. **Easy Deployment** - Push and deploy
4. **Simple Backups** - Copy files or Git commit
5. **Cost-Effective** - Free hosting on Vercel/Netlify
6. **Transparent** - All data in readable JSON
7. **Git-Friendly** - Version control your entire catalog

### Perfect For:

- ✅ B2B Product Catalogs
- ✅ Small to Medium E-commerce
- ✅ Prototype to Production
- ✅ Cost-Conscious Projects
- ✅ Git-Based Workflows

---

**Built with ❤️ using Next.js and File-Based Architecture**

**Happy Building! 🚀**
