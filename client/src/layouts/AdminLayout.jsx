import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { 
  LayoutDashboard, Tv, Wrench, Image, Package, Tag, Settings, LogOut, 
  Menu, X, Sun, Moon, ArrowLeft, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import projectLogo from '../assets/logo.jpg';

const AdminLayout = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { settings } = useSettings();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authenticated redirect guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        {/* Fullscreen loading state */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
          Authenticating administrator...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Tv },
    { path: '/admin/spare-parts', label: 'Spare Parts', icon: Wrench },
    { path: '/admin/gallery', label: 'Gallery', icon: Image },
    { path: '/admin/inventory', label: 'Inventory / Stock', icon: Package },
    { path: '/admin/brands', label: 'Brands & Categories', icon: Tag },
    { path: '/admin/settings', label: 'Store Settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const getPageTitle = () => {
    const activeLink = sidebarLinks.find(link => location.pathname === link.path);
    return activeLink ? activeLink.label : 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 h-screen sticky top-0">
        {/* Sidebar Header */}
        <div className="h-20 px-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
          <img 
            src={settings?.logo_url || projectLogo} 
            alt="Logo" 
            className="h-9 w-9 object-cover rounded-full border border-slate-200 dark:border-slate-800 shadow-sm" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-950 dark:text-white">
              {settings?.business_name || 'Siva Electronics'}
            </span>
            <span className="text-xs text-primary dark:text-primary-light font-medium">Administrator</span>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-2">
          {/* Back to Site */}
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>Go to Live Website</span>
          </NavLink>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navbar / Top Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-slate-900 z-50 p-6 flex flex-col justify-between lg:hidden shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <img 
                      src={settings?.logo_url || projectLogo} 
                      alt="Logo" 
                      className="h-8 w-8 object-cover rounded-full border border-slate-200 dark:border-slate-800" 
                    />
                    <span className="font-bold text-sm text-slate-950 dark:text-white">Admin Menu</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            isActive
                              ? 'bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light'
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{link.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <NavLink
                  to="/"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  <Store className="w-4 h-4" />
                  <span>Live Website</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin User Chip */}
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 py-1.5 pl-3 pr-4 rounded-full">
              <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Content Container */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto animate-enter-up">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
