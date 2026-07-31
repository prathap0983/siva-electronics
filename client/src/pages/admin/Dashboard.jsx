import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tv, Wrench, Image, Package, AlertTriangle, AlertOctagon, 
  ArrowUpRight, Clock, UserCheck, ShieldAlert
} from 'lucide-react';
import api from '../../api/api.js';
import Skeleton from '../../components/Skeleton.jsx';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Helper to fetch safely and fall back on error
        const safeFetch = async (url, fallbackValue) => {
          try {
            const res = await api.get(url);
            return res.data;
          } catch (e) {
            console.warn(`Safe fetch warning for ${url}:`, e.message);
            return fallbackValue;
          }
        };

        // 1. Fetch data safely
        const invRes = await safeFetch('/inventory', { summary: {}, items: [] });
        const summary = invRes.summary || {};
        const items = invRes.items || [];

        const productsData = await safeFetch('/products', []);
        const partsData = await safeFetch('/spare-parts', []);
        const galleryData = await safeFetch('/gallery', []);

        // 2. Compute total products count (handles both raw array and paginated format)
        const totalProductsCount = Array.isArray(productsData) 
          ? productsData.length 
          : (productsData.total || 0);

        // 3. Assemble stats object
        setStats({
          totalProducts: totalProductsCount,
          totalParts: Array.isArray(partsData) ? partsData.length : 0,
          totalGallery: Array.isArray(galleryData) ? galleryData.length : 0,
          lowStock: summary.lowStockCount || 0,
          outOfStock: summary.outOfStockCount || 0,
          inStock: summary.availableStockCount || 0
        });

        // 4. Assemble recent logs from inventory histories
        let compiledLogs = [];
        for (const item of items.slice(0, 5)) {
          try {
            const historyData = await safeFetch(`/inventory/${item.id}/history`, []);
            const logs = historyData.slice(0, 2).map(log => ({
              ...log,
              itemName: item.name,
              itemType: item.item_type
            }));
            compiledLogs.push(...logs);
          } catch (e) {
            // Ignore
          }
        }
        
        compiledLogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentLogs(compiledLogs.slice(0, 5));

      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton variant="card" /><Skeleton variant="card" /><Skeleton variant="card" /><Skeleton variant="card" />
        </div>
        <div className="h-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', val: stats?.totalProducts || 0, icon: Tv, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', path: '/admin/products' },
    { label: 'Total Spare Parts', val: stats?.totalParts || 0, icon: Wrench, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', path: '/admin/spare-parts' },
    { label: 'Gallery Images', val: stats?.totalGallery || 0, icon: Image, color: 'bg-green-500/10 text-green-600 dark:text-green-400', path: '/admin/gallery' },
    { label: 'In Stock Items', val: stats?.inStock || 0, icon: Package, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', path: '/admin/inventory' }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Alert Banner for low stock */}
      {(stats?.lowStock > 0 || stats?.outOfStock > 0) && (
        <div className="bg-orange-550/15 border border-orange-550/20 text-orange-800 dark:text-orange-400 px-6 py-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce text-orange-655" />
          <div className="text-sm">
            <span className="font-bold">Inventory Warning: </span>
            You have <span className="font-extrabold">{stats.outOfStock} out-of-stock</span> and <span className="font-extrabold">{stats.lowStock} low-stock</span> catalog items requiring attention.
            <Link to="/admin/inventory" className="font-bold underline ml-2 hover:text-orange-700">Manage Stock</Link>
          </div>
        </div>
      )}

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link 
              key={idx} 
              to={card.path} 
              className="premium-card p-6 bg-white dark:bg-card-dark flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{card.val}</p>
              </div>
              <div className={`p-4 rounded-2xl ${card.color} group-hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Stock Alerts vs Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Stock Alert List */}
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Critical Stock Warnings</h3>
              <p className="text-xs text-slate-400">Inventory items reaching critical levels.</p>
            </div>
            <Link to="/admin/inventory" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
              <span>View Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.outOfStock === 0 && stats?.lowStock === 0 ? (
              <div className="text-center py-10">
                <Package className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">All Stock Levels Healthy</h4>
                <p className="text-xs text-slate-400">No low stock or out of stock items detected.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.outOfStock > 0 && (
                  <div className="p-4 bg-red-500/5 dark:bg-red-950/10 border border-red-500/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-650 dark:text-red-400 rounded-lg">
                        <AlertOctagon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-red-650 dark:text-red-400">Out of Stock</h4>
                        <p className="text-xs text-slate-400">Items have reached zero quantity</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-red-650 dark:text-red-400">{stats.outOfStock} items</span>
                  </div>
                )}

                {stats?.lowStock > 0 && (
                  <div className="p-4 bg-orange-550/5 dark:bg-orange-950/10 border border-orange-550/10 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-655 dark:text-orange-400 rounded-lg">
                        <AlertTriangle className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-orange-655 dark:text-orange-400">Low Stock Warning</h4>
                        <p className="text-xs text-slate-400">Items nearing custom thresholds</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-orange-655 dark:text-orange-400">{stats.lowStock} items</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Recent Inventory History Logs */}
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-xs text-slate-400">Stock updates logged by system administrators.</p>
            </div>
            <Link to="/admin/inventory" className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5">
              <span>View Logs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex gap-4 items-start text-sm">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mt-0.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-grow space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {log.itemName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {log.notes || `Stock adjusted`}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <span className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                      log.quantity_change >= 0 
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/20' 
                        : 'bg-red-50 text-red-700 dark:bg-red-950/20'
                    }`}>
                      {log.quantity_change >= 0 ? `+${log.quantity_change}` : log.quantity_change}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-pulse" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-white font-medium">No Recent Activity</h4>
                <p className="text-xs text-slate-400">Add inventory or adjust stock to see logging updates here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
