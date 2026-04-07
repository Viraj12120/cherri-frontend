import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Search, AlertCircle, Clock, TrendingDown, Plus, Download, Eye, Edit, Trash2, Upload, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import BulkImportModal from '../../components/modals/BulkImportModal';
import api from '../../lib/axios';
import { getErrorMessage, formatCurrency } from '../../lib/utils';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import Skeleton, { TableRowSkeleton } from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';
import StockDetailDrawer from '../../dashboard/components/StockDetailDrawer';
import ReorderModal from '../../dashboard/modals/ReorderModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

/**
 * Compute a display status for each inventory batch row.
 * Handles: Expired + No stock, Expired, No stock, Low stock, OK
 */
const computeBatchStatus = (row) => {
  const qty = row.quantity ?? 0;
  const now = new Date();
  const expiry = row.expiry_date ? new Date(row.expiry_date) : null;
  const isExpired = expiry && expiry < now;
  const isOutOfStock = qty === 0;
  const threshold = row.medicine?.low_stock_threshold ?? 10;
  const isLow = qty > 0 && qty <= threshold;

  if (isExpired && isOutOfStock) return { key: 'EXPIRED_NO_STOCK', label: 'Expired + No stock' };
  if (isExpired) return { key: 'EXPIRED', label: 'Expired' };
  if (isOutOfStock) return { key: 'OUT_OF_STOCK', label: 'No stock' };
  if (isLow) return { key: 'LOW', label: 'Low stock' };
  return { key: 'OK', label: 'OK' };
};

const InventoryPage = () => {
  const { t, i18n } = useTranslation();
  const addToast = useUiStore((s) => s.addToast);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Detail / Action States
  const [selectedStock, setSelectedStock] = useState(null);
  const [reorderItem, setReorderItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    zeroStock: 0,
    expiredOrExpiring: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/inventory?skip=0&limit=100');

      // Adapt to paginated or flat array response
      const rows = Array.isArray(data) ? data : (data.items || data.data || []);
      setItems(rows);

      // Compute stats from real data
      let active = 0;
      let zeroStock = 0;
      let expiredOrExpiring = 0;
      const now = new Date();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      rows.forEach(r => {
        const qty = r.quantity ?? 0;
        const expiry = r.expiry_date ? new Date(r.expiry_date) : null;

        if (qty === 0) {
          zeroStock++;
        } else {
          active++;
        }

        if (expiry) {
          if (expiry < now) {
            expiredOrExpiring++;
          } else if (expiry - now < thirtyDays) {
            expiredOrExpiring++;
          }
        }
      });

      setStats({
        total: rows.length,
        active,
        zeroStock,
        expiredOrExpiring
      });

    } catch (err) {
      addToast({
        type: 'error',
        message: getErrorMessage(err, t('common.error_load_data') || 'Failed to load inventory data.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      // Backend doesn't have DELETE endpoint. Q2 decision: PUT quantity to 0
      await api.put(`/inventory/${itemToDelete.id}`, { quantity: 0 });
      addToast({ type: 'success', message: 'Item stock set to zero successfully.' });
      setItemToDelete(null);
      fetchInventory();
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to delete/zero out stock.' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter logic
  const filtered = items.filter(i => {
    const status = computeBatchStatus(i);
    const medicineName = i.medicine?.name || '';
    const batchNum = i.batch_number || '';
    const sku = i.medicine?.sku || '';

    // Filter matching
    let matchFilter = false;
    switch (filter) {
      case 'All':
        matchFilter = true;
        break;
      case 'ACTIVE':
        matchFilter = status.key === 'OK' || status.key === 'LOW';
        break;
      case 'ZERO_STOCK':
        matchFilter = status.key === 'OUT_OF_STOCK' || status.key === 'EXPIRED_NO_STOCK';
        break;
      case 'EXPIRED':
        matchFilter = status.key === 'EXPIRED' || status.key === 'EXPIRED_NO_STOCK';
        break;
      case 'LOW':
        matchFilter = status.key === 'LOW';
        break;
      case 'OK':
        matchFilter = status.key === 'OK';
        break;
      default:
        matchFilter = true;
    }

    const matchSearch =
      medicineName.toLowerCase().includes(search.toLowerCase()) ||
      batchNum.toLowerCase().includes(search.toLowerCase()) ||
      sku.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  /** Format currency for display dynamically based on language */
  const renderCurrency = (val) => {
    return formatCurrency(val, i18n.language);
  };

  /** Format date for display */
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  /** Get status badge variant */
  const getStatusBadge = (status) => {
    switch (status.key) {
      case 'EXPIRED_NO_STOCK':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-danger/10 text-danger border-danger/20"><XCircle size={10} />{status.label}</span>;
      case 'EXPIRED':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-orange-500/10 text-orange-400 border-orange-500/20"><AlertTriangle size={10} />{status.label}</span>;
      case 'OUT_OF_STOCK':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-danger/10 text-danger border-danger/20"><AlertCircle size={10} />{status.label}</span>;
      case 'LOW':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-warn/10 text-warn border-warn/20"><TrendingDown size={10} />{status.label}</span>;
      case 'OK':
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{status.label}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 relative">
      {/* Drawers / Modals */}
      {selectedStock && (
        <StockDetailDrawer
          item={selectedStock}
          onClose={() => setSelectedStock(null)}
          onReorder={(item) => setReorderItem(item)}
        />
      )}
      {reorderItem && (
        <ReorderModal
          item={reorderItem}
          onClose={() => setReorderItem(null)}
          onSuccess={() => { setReorderItem(null); fetchInventory(); }}
        />
      )}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Zero out Stock?"
        description={`Are you sure you want to set the stock of ${itemToDelete?.medicine?.name || 'this item'} to 0? This cannot be undone.`}
        confirmText="Zero out Stock"
        isDestructive={true}
        isLoading={isDeleting}
      />
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={async () => {
          await fetchInventory();
          await fetchMe();
          setIsImportModalOpen(false);
        }}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{t('dashboard.inventory.title')}</h1>
          <p className="text-white/40 text-sm">{t('dashboard.inventory.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Upload size={14} /> {t('dashboard.inventory.import')}
          </button>

          <button onClick={() => setIsImportModalOpen(true)} className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={14} /> {t('dashboard.inventory.add_item')}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches', val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.total, icon: Package, color: 'text-acid' },
          { label: 'Active Stock', val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.active, icon: Package, color: 'text-emerald-500' },
          { label: 'Zero Stock', val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.zeroStock, icon: AlertCircle, color: 'text-danger' },
          { label: 'Expired / Expiring', val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.expiredOrExpiring, icon: Clock, color: 'text-orange-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#161618] border border-white/5 p-4 rounded-xl flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{s.label}</p>
              <div className="text-xl font-bold text-white mt-1">{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#161618] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap relative z-10">
            {[
              { id: 'All', label: 'All' },
              { id: 'ACTIVE', label: 'Active Stock' },
              { id: 'ZERO_STOCK', label: 'Zero Stock' },
              { id: 'EXPIRED', label: 'Expired' },
              { id: 'LOW', label: 'Low Stock' },
              { id: 'OK', label: 'OK' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${filter === f.id
                  ? f.id === 'ZERO_STOCK' ? 'bg-danger/20 text-danger border border-danger/30'
                    : f.id === 'EXPIRED' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : f.id === 'LOW' ? 'bg-warn/20 text-warn border border-warn/30'
                        : f.id === 'OK' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                          : f.id === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                            : 'bg-acid/20 text-acid border border-acid/30'
                  : 'bg-white/5 text-white/40 hover:text-white border border-transparent'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder={t('dashboard.inventory.search_placeholder') || 'Search by medicine, batch, SKU...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-acid/30 transition-all text-white placeholder-white/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5 bg-[#1a1a1c]">
              <tr>
                <th className="px-6 py-4 font-medium">Medicine</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Batch Number</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Qty</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Expiry</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Cost</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right">Selling</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">Status</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 text-right min-w-[100px]">{t('dashboard.inventory.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-6">
                      <TableRowSkeleton columns={6} />
                    </td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((row, i) => {
                  const qty = row.quantity ?? 0;
                  const medicineName = row.medicine?.name || 'Unknown';
                  const batchNumber = row.batch_number || '-';
                  const costPrice = row.cost_price;
                  const sellingPrice = row.selling_price;
                  const expiryDate = row.expiry_date;
                  const status = computeBatchStatus(row);

                  // Highlight zero-stock rows with subtle bg
                  const rowBg = qty === 0
                    ? 'bg-danger/[0.03]'
                    : status.key === 'EXPIRED'
                      ? 'bg-orange-500/[0.03]'
                      : '';

                  return (
                    <tr key={row.id || i} className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${rowBg}`} onClick={() => setSelectedStock(row)}>
                      <td className="px-6 py-3">
                        <div>
                          <span className="font-bold text-white/90">{medicineName}</span>
                          {row.medicine?.sku && (
                            <span className="block text-[10px] text-white/30 font-mono mt-0.5">{row.medicine.sku}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 font-mono text-white/50 text-[11px] border-l border-white/5">{batchNumber}</td>
                      <td className={`px-6 py-3 font-bold border-l border-white/5 text-right ${qty === 0 ? 'text-danger' : 'text-white/80'}`}>{qty}</td>
                      <td className={`px-6 py-3 border-l border-white/5 ${status.key === 'EXPIRED' || status.key === 'EXPIRED_NO_STOCK' ? 'text-orange-400' : 'text-white/50'}`}>
                        {formatDate(expiryDate)}
                      </td>
                      <td className="px-6 py-3 text-white/50 border-l border-white/5 text-right">{renderCurrency(costPrice)}</td>
                      <td className="px-6 py-3 text-white/60 border-l border-white/5 text-right">{renderCurrency(sellingPrice)}</td>
                      <td className="px-6 py-3 border-l border-white/5">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedStock(row); }} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"><Eye size={13} /></button>
                          <button onClick={(e) => { e.stopPropagation(); addToast({ type: 'info', message: 'Direct edit coming in next version. Reimport via CSV to update currently.' }); }} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-acid transition-colors"><Edit size={13} /></button>
                          <button onClick={(e) => { e.stopPropagation(); setItemToDelete(row); }} className="p-1.5 rounded-lg hover:bg-danger/10 text-white/40 hover:text-danger transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-white/30">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Package size={32} className="opacity-20" />
                      <p>{t('dashboard.inventory.table.no_items') || 'No inventory items found.'}</p>
                      {filter !== 'All' || search ? (
                        <button onClick={() => { setFilter('All'); setSearch(''); }} className="text-acid hover:underline mt-2">{t('dashboard.inventory.table.clear_filters') || 'Clear filters'}</button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
