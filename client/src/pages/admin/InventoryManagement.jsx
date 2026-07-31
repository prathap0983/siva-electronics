import React, { useEffect, useState } from 'react';
import { 
  Package, ArrowUpDown, AlertTriangle, AlertOctagon, TrendingUp, 
  TrendingDown, Plus, Minus, X, Clock, Settings, Loader2
} from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import Skeleton from '../../components/Skeleton.jsx';

export const InventoryManagement = () => {
  const { addToast } = useToast();

  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stock Adjustment States
  const [activeItem, setActiveItem] = useState(null);
  const [quantityChange, setQuantityChange] = useState('');
  const [notes, setNotes] = useState('');
  const [adjustType, setAdjustType] = useState('increase'); // increase / decrease / set
  const [submitting, setSubmitting] = useState(false);

  // History logs viewer state
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistoryItem, setShowHistoryItem] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory');
      setInventory(response.data.items || []);
      setSummary(response.data.summary);
    } catch (err) {
      console.error(err);
      addToast('Failed to load inventory dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAdjustmentModal = (item, type = 'increase') => {
    setActiveItem(item);
    setAdjustType(type);
    setQuantityChange('');
    setNotes('');
  };

  const handleAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!quantityChange || isNaN(quantityChange)) {
      addToast('Please enter a valid numeric quantity', 'warning');
      return;
    }

    const value = parseInt(quantityChange);
    if (value <= 0) {
      addToast('Quantity change must be greater than zero', 'warning');
      return;
    }

    setSubmitting(true);
    const finalChange = adjustType === 'decrease' ? -value : value;

    try {
      await api.post(`/inventory/${activeItem.id}/adjust`, {
        quantity_change: finalChange,
        type: adjustType,
        notes: notes || `${adjustType.toUpperCase()} stock by ${value}`
      });

      addToast('Stock level updated successfully', 'success');
      setActiveItem(null);
      fetchInventory();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.error || 'Failed to update stock level', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openHistoryLogbook = async (item) => {
    setShowHistoryItem(item);
    setHistoryLogs([]);
    try {
      setLoadingHistory(true);
      const response = await api.get(`/inventory/${item.id}/history`);
      setHistoryLogs(response.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load stock history logs', 'error');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-enter-up">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400 font-medium">Store Operations</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Stock Controls</h2>
        </div>
      </div>

      {/* Stats Summary Panel */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="premium-card p-5 bg-white dark:bg-card-dark flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Items Cataloged</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{summary.totalItems}</p>
            </div>
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-350">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="premium-card p-5 bg-white dark:bg-card-dark flex items-center justify-between border-l-4 border-l-orange-500">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</span>
              <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{summary.lowStockCount}</p>
            </div>
            <div className="p-3.5 bg-orange-100 dark:bg-orange-950/20 rounded-2xl text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="premium-card p-5 bg-white dark:bg-card-dark flex items-center justify-between border-l-4 border-l-red-500">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock Alarms</span>
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{summary.outOfStockCount}</p>
            </div>
            <div className="p-3.5 bg-red-100 dark:bg-red-950/20 rounded-2xl text-red-600 dark:text-red-400">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Main Inventory Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="table-row" /><Skeleton variant="table-row" /><Skeleton variant="table-row" />
        </div>
      ) : inventory.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Item Type</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4 text-center">Current Stock</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Adjust Stock</th>
                  <th className="px-6 py-4 text-center">Logbook</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-855">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    {/* Type label */}
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.item_type === 'product' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' 
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
                      }`}>
                        {item.item_type}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-semibold text-slate-850 dark:text-slate-100">
                      {item.name}
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4 text-slate-500">
                      {item.brand}
                    </td>

                    {/* Current Stock */}
                    <td className="px-6 py-4 text-center font-extrabold text-sm text-slate-900 dark:text-white">
                      {item.stock_qty}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Out of Stock' 
                          ? 'bg-red-55/10 text-red-600 dark:bg-red-950/25' 
                          : (item.status === 'Low Stock' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/25' : 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300')
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Adjustment Actions triggers */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openAdjustmentModal(item, 'increase')}
                          className="p-1 bg-green-50 dark:bg-green-950/20 text-green-650 hover:bg-green-100 dark:hover:bg-green-900/40 rounded transition-colors"
                          title="Add Stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openAdjustmentModal(item, 'decrease')}
                          className="p-1 bg-red-50 dark:bg-red-950/20 text-red-550 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                          title="Reduce Stock"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Logs trigger */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => openHistoryLogbook(item)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
                        title="View history logs"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-slate-205 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-lg">Inventory Empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Catalog products and spare parts first to initialize stock records.
          </p>
        </div>
      )}

      {/* Stock Adjustment Popup Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setActiveItem(null)} />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl z-10 text-left relative">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                  Stock Adjustment
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-2">
                  {activeItem.name}
                </h3>
                <p className="text-xs text-slate-400">Current Stock: <span className="font-bold">{activeItem.stock_qty} qty</span></p>
              </div>

              <form onSubmit={handleAdjustmentSubmit} className="space-y-4">
                
                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase">
                    Quantity to {adjustType === 'increase' ? 'Add' : 'Deduct'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 10"
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Audit Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-450 uppercase">Adjustment Reason / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Received shipment, discards..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-sm font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-5 py-2 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 ${
                      adjustType === 'increase' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        {adjustType === 'increase' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{adjustType === 'increase' ? 'Increase Stock' : 'Decrease Stock'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* History Logbook Side Panel */}
      {showHistoryItem && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowHistoryItem(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full overflow-y-auto p-8 shadow-2xl z-10 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">History Logbook</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {showHistoryItem.name}
                  </h3>
                </div>
                <button onClick={() => setShowHistoryItem(null)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {loadingHistory ? (
                <div className="space-y-4">
                  <Skeleton variant="text" /><Skeleton variant="text" /><Skeleton variant="text" />
                </div>
              ) : historyLogs.length > 0 ? (
                <div className="space-y-4">
                  {historyLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl flex items-start gap-3 justify-between text-xs">
                      <div className="space-y-1">
                        <span className={`inline-block font-extrabold uppercase text-[8px] px-2 py-0.5 rounded-full ${
                          log.type === 'increase' || log.type === 'initial'
                            ? 'bg-green-105 text-green-700 dark:bg-green-950/20' 
                            : 'bg-red-105 text-red-750 dark:bg-red-950/20'
                        }`}>
                          {log.type}
                        </span>
                        <p className="text-slate-650 dark:text-slate-350 leading-relaxed italic">
                          "{log.notes || 'No description provided'}"
                        </p>
                        <span className="text-[9px] text-slate-400 block pt-1">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <span className={`font-extrabold text-sm ${
                        log.quantity_change >= 0 ? 'text-green-600' : 'text-red-550'
                      }`}>
                        {log.quantity_change >= 0 ? `+${log.quantity_change}` : log.quantity_change}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Clock className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <h4 className="font-bold text-sm">No transaction history</h4>
                  <p className="text-xs text-slate-400">Stock updates will show here.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHistoryItem(null)}
              className="w-full mt-8 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-bold text-center"
            >
              Close Logbook
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryManagement;
