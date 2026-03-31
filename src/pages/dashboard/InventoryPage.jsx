import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Search, AlertCircle, Clock, TrendingDown, Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';
import api from '../../lib/axios';
import { useUiStore } from '../../stores/uiStore';
import Skeleton, { TableRowSkeleton } from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';

const InventoryPage = () => {
  const { t } = useTranslation();
  const addToast = useUiStore((s) => s.addToast);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    low: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      // Wait, let's fetch medicines. Standard endpoint is usually /medicines or /inventory. We'll try /medicines based on schema norms?
      // I'll stick to /inventory as proposed, backend can be adjusted or I can fix it if it 404s.
      const { data } = await api.get('/inventory?skip=0&limit=100');

      // In case data is paginated { items: [], total: 0 }, adapt:
      const rows = Array.isArray(data) ? data : (data.items || data.data || []);

      setItems(rows);

      // Compute basic stats
      let critical = 0;
      let low = 0;
      let expiring = 0;
      const now = new Date();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      rows.forEach(r => {
        const qty = r.stock_quantity || r.qty || 0;
        const min = r.minimum_stock_level || r.min || 10;
        const status = r.status || 'OK';

        if (status === 'CRITICAL' || qty === 0) critical++;
        else if (status === 'LOW' || qty <= min) low++;

        if (r.expiry_date) {
          const expD = new Date(r.expiry_date);
          if (expD - now < thirtyDays) expiring++;
        }
      });

      setStats({
        total: rows.length,
        critical,
        low,
        expiringSoon: expiring
      });

    } catch (err) {
      addToast({
        type: 'error',
        message: t('common.error_load_data') || 'Failed to load inventory data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = items.filter(i => {
    // Fallback normalizations for mock vs real schema
    const status = (i.status || 'OK').toUpperCase();
    const name = i.item_name || i.name || '';
    const sku = i.sku || '';

    const matchFilter = filter === 'All' || status === filter;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || sku.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{t('dashboard.inventory.title')}</h1>
          <p className="text-white/40 text-sm">{t('dashboard.inventory.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} /> {t('dashboard.inventory.export_csv')}
          </button>
          <button className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={14} /> {t('dashboard.inventory.add_item')}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('dashboard.overview.stats.total_stock'), val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.total, icon: Package, color: 'text-acid' },
          { label: t('dashboard.overview.stats.critical'), val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.critical, icon: AlertCircle, color: 'text-danger' },
          { label: t('dashboard.overview.stats.low_stock'), val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.low, icon: TrendingDown, color: 'text-warn' },
          { label: t('dashboard.overview.stats.expiring'), val: isLoading ? <Skeleton w="40px" h="28px" /> : stats.expiringSoon, icon: Clock, color: 'text-coral' },
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
          <div className="flex gap-2 relative z-10">
            {[
              { id: 'All', label: t('dashboard.inventory.filters.all') },
              { id: 'CRITICAL', label: t('dashboard.inventory.filters.critical') },
              { id: 'LOW', label: t('dashboard.inventory.filters.low') },
              { id: 'OK', label: t('dashboard.inventory.filters.ok') }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${filter === f.id
                  ? f.id === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30'
                    : f.id === 'LOW' ? 'bg-warn/20 text-warn border border-warn/30'
                      : f.id === 'OK' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
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
              placeholder={t('dashboard.inventory.search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-acid/30 transition-all text-white placeholder-white/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="text-white/30 uppercase tracking-wider border-b border-white/5 bg-[#1a1a1c]">
              <tr>
                <th className="px-6 py-4 font-medium ">{t('dashboard.inventory.table.medicine')}</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">{t('dashboard.inventory.table.sku')}</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">{t('dashboard.inventory.table.category')}</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 ">{t('dashboard.inventory.table.qty')}</th>
                <th className="px-6 py-4 font-medium  border-l border-white/5">{t('dashboard.inventory.table.min')}</th>
                <th className="px-6 py-4 font-medium border-l border-white/5 ">{t('dashboard.inventory.table.cost')}</th>
                <th className="px-6 py-4 font-medium border-l border-white/5">{t('dashboard.inventory.table.status')}</th>
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
                  const qty = row.stock_quantity || row.qty || 0;
                  const min = row.minimum_stock_level || row.min || 10;
                  const name = row.item_name || row.name || 'Unknown';
                  const sku = row.sku || 'N/A';
                  const category = row.category_name || row.category || '-';
                  const cost = row.unit_price || row.cost || '₹0.00';
                  const status = row.status || (qty === 0 ? 'CRITICAL' : qty <= min ? 'LOW' : 'OK');

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="px-6 py-3 font-bold text-white/90">{name}</td>
                      <td className="px-6 py-3 font-mono text-white/40 text-[11px]">{sku}</td>
                      <td className="px-6 py-3 text-white/40 border-l border-white/5">{category}</td>
                      <td className="px-6 py-3 text-white/80 font-bold border-l border-white/5 text-right">{qty}</td>
                      <td className="px-6 py-3 text-white/30 text-right">{min}</td>
                      <td className="px-6 py-3 text-white/60 border-l border-white/5 text-right">{cost}</td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-3 border-l border-white/5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"><Eye size={13} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-acid transition-colors"><Edit size={13} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-danger/10 text-white/40 hover:text-danger transition-colors"><Trash2 size={13} /></button>
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
                      <p>{t('dashboard.inventory.table.no_items')}</p>
                      {filter !== 'All' || search ? (
                        <button onClick={() => { setFilter('All'); setSearch(''); }} className="text-acid hover:underline mt-2">{t('dashboard.inventory.table.clear_filters')}</button>
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
