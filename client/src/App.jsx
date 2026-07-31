import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Cart from './pages/Cart.jsx';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Products from './pages/Products.jsx';
import SpareParts from './pages/SpareParts.jsx';
import Gallery from './pages/Gallery.jsx';
import Brands from './pages/Brands.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import EditProduct from './pages/EditProduct.jsx';

// Admin Pages
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import SparePartsManagement from './pages/admin/SparePartsManagement.jsx';
import GalleryManagement from './pages/admin/GalleryManagement.jsx';
import InventoryManagement from './pages/admin/InventoryManagement.jsx';
import BrandManagement from './pages/admin/BrandManagement.jsx';
import SettingsManagement from './pages/admin/SettingsManagement.jsx';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <SettingsProvider>
            <AuthProvider>
              <CartProvider>
                <Routes>
                  {/* ... contents inside Routes ... */}
                
                {/* 1. Public Facing Customer Site */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:id" element={<ProductDetails />} />
                  <Route path="spare-parts" element={<SpareParts />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="404" element={<NotFound />} />
                </Route>

                {/* 2. Hidden Admin Authentication Login */}
                <Route path="/admin" element={<Login />} />

                {/* 3. Secure Admin Panel Management Dashboard */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit/:id" element={<EditProduct />} />
                  <Route path="spare-parts" element={<SparePartsManagement />} />
                  <Route path="gallery" element={<GalleryManagement />} />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="brands" element={<BrandManagement />} />
                  <Route path="settings" element={<SettingsManagement />} />
                </Route>

                {/* 4. Catch All Redirect for 404 Pages */}
                <Route path="*" element={<Navigate to="/404" replace />} />

                </Routes>
              </CartProvider>
            </AuthProvider>
          </SettingsProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
