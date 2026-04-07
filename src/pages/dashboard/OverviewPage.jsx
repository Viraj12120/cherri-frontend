import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Package, AlertCircle, Clock, User, TrendingDown, TrendingUp, Check, X, Edit, ArrowRight, Cpu, Download, Plus, Search, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import { getErrorMessage } from '../../lib/utils';
import { useUiStore } from '../../stores/uiStore';
import Skeleton from '../../components/ui/Skeleton';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuthStore } from '../../stores/authStore';

// Extracted Components
import StockDetailDrawer from '../../dashboard/components/StockDetailDrawer';
import CriticalModal from '../../dashboard/modals/CriticalModal';
import ExportModal from '../../dashboard/modals/ExportModal';
import ManualOrderModal from '../../dashboard/modals/ManualOrderModal';
import ReorderModal from '../../dashboard/modals/ReorderModal';
import EditSuggestionModal from '../../dashboard/modals/EditSuggestionModal';
import NLQueryTerminal from '../../dashboard/NLQueryTerminal';

const OverviewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addToast = useUiStore((s) => s.addToast);
  const user = useAuthStore((s) => s.user);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    low: 0,
    expiringSoon: 0
  });

  // Modal States
  const [showCritical, setShowCritical] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showManualOrder, setShowManualOrder] = useState(false);
  const [reorderItem, setReorderItem] = useState(null);
  const [showEditSuggestion, setShowEditSuggestion] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // AI Suggestion state
  const [suggestion, setSuggestion] = useState({ status: 'loading' }); // loading | pending | approved | rejected | none
  const [suggestionData, setSuggestionData] = useState(null); // { item, suggestedQty, daysOfStock, riskLevel, predictedDate, suppliers }
  const [approving, setApproving] = useState(false);

  // Low-stock items for critical modal
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchData();
    fetchAISuggestion();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/inventory?skip=0&limit=50');
      const rows = Array.isArray(data) ? data : (data.items || data.data || []);
      setItems(rows);

      // Compute stats from real API fields
      let critical = 0;
      let low = 0;
      let expiring = 0;
      const now = new Date();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;

      rows.forEach(r => {
        const qty = r.quantity ?? 0;
        const threshold = r.medicine?.low_stock_threshold ?? 10;
        const expiry = r.expiry_date ? new Date(r.expiry_date) : null;
        const isExpired = expiry && expiry < now;

        if (qty === 0 || isExpired) critical++;
        else if (qty <= threshold) low++;

        if (expiry && !isExpired && (expiry - now < thirtyDays)) expiring++;
      });

      setStats({
        total: rows.length,
        critical,
        low,
        expiringSoon: expiring
      });

    } catch (err) {
      addToast({ type: 'error', message: t('common.error_load_data') || 'Failed to load overview data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAISuggestion = async () => {
    try {
      setSuggestion({ status: 'loading' });

      // 1. Fetch low-stock items
      const { data: lowStockData } = await api.get('/inventory/low-stock');
      const lowItems = Array.isArray(lowStockData) ? lowStockData : (lowStockData.items || lowStockData.data || []);
      setLowStockItems(lowItems);

      if (lowItems.length === 0) {
        setSuggestion({ status: 'none' });
        return;
      }

      // 2. Pick the most critical item (lowest quantity relative to threshold)
      const topItem = lowItems.reduce((worst, item) => {
        const ratio = (item.quantity ?? 0) / (item.medicine?.low_stock_threshold || 1);
        const worstRatio = (worst.quantity ?? 0) / (worst.medicine?.low_stock_threshold || 1);
        return ratio < worstRatio ? item : worst;
      }, lowItems[0]);

      const medicineId = topItem.medicine_id || topItem.medicine?.id;

      // 3. Fetch AI suggestion & stockout prediction in parallel
      const [suggestionRes, stockoutRes, suppliersRes] = await Promise.allSettled([
        medicineId ? api.get(`/inventory/${medicineId}/suggested-order`) : Promise.reject('no id'),
        medicineId ? api.get(`/inventory/${medicineId}/predict-stockout`) : Promise.reject('no id'),
        api.get('/suppliers/?limit=100'),
      ]);

      const suggestedQty = suggestionRes.status === 'fulfilled'
        ? (suggestionRes.value.data.suggested_order_quantity ?? 0)
        : Math.max(0, (topItem.medicine?.low_stock_threshold ?? 100) - (topItem.quantity ?? 0));

      const stockoutInfo = stockoutRes.status === 'fulfilled' ? stockoutRes.value.data : {};
      const suppliers = suppliersRes.status === 'fulfilled'
        ? (Array.isArray(suppliersRes.value.data) ? suppliersRes.value.data : [])
        : [];

      setSuggestionData({
        item: topItem,
        suggestedQty,
        daysOfStock: stockoutInfo.days_until_stockout ?? null,
        riskLevel: stockoutInfo.risk_level ?? 'unknown',
        predictedDate: stockoutInfo.predicted_date ?? null,
        suppliers,
        medicineName: topItem.medicine?.name || 'Unknown',
        medicineId,
      });
      setSuggestion({ status: 'pending' });

    } catch (err) {
      console.error('AI suggestion fetch failed:', err);
      setSuggestion({ status: 'none' });
    }
  };

  const approveSuggestion = async (qty, supplierIdOrName) => {
    if (!suggestionData) return;
    setApproving(true);
    try {
      // Find supplier ID
      let supplierId = supplierIdOrName;
      if (supplierIdOrName && !supplierIdOrName.match?.(/^[0-9a-f-]{36}$/i)) {
        const match = suggestionData.suppliers.find(s => s.name === supplierIdOrName);
        supplierId = match?.id;
      }

      const finalSupplierId = supplierId || suggestionData.item.supplier_id || suggestionData.suppliers[0]?.id;

      if (!finalSupplierId) {
        addToast({
          type: 'error',
          message: 'No supplier found for this medicine. Please link a supplier to the medicine or create one first.'
        });
        setApproving(false);
        return;
      }

      const orderQty = qty || suggestionData.suggestedQty;
      const pricePerUnit = parseFloat(suggestionData.item.cost_price) || 0;

      const payload = {
        supplier_id: finalSupplierId,
        total_amount: orderQty * pricePerUnit,
        notes: `AI-suggested reorder for ${suggestionData.medicineName}`,
        items: [{
          medicine_id: suggestionData.medicineId,
          quantity: orderQty,
          price_per_unit: pricePerUnit,
        }]
      };

      await api.post('/orders/', payload);

      setSuggestion({ status: 'approved' });
      addToast({ type: 'success', message: `✓ ${t('dashboard.overview.suggestion.approved_title') || 'Order placed'} — ${orderQty.toLocaleString()} units` });
    } catch (err) {
      addToast({ type: 'error', message: getErrorMessage(err, 'Failed to create order.') });
    } finally {
      setApproving(false);
    }
  };

  const rejectSuggestion = () => {
    setSuggestion({ status: 'rejected' });
    addToast({ type: 'info', message: t('dashboard.overview.suggestion.suggestion_dismissed') || 'Suggestion dismissed' });
  };

  // Compute confidence based on risk level
  const getConfidence = () => {
    if (!suggestionData) return 50;
    switch (suggestionData.riskLevel) {
      case 'critical': return 95;
      case 'high': return 87;
      case 'medium': return 72;
      case 'low': return 55;
      default: return 80;
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 relative">
      {/* Modals */}
      {showCritical && <CriticalModal items={lowStockItems} onClose={() => setShowCritical(false)} onReorder={(item) => { setShowCritical(false); setReorderItem(item); }} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showManualOrder && <ManualOrderModal onClose={() => setShowManualOrder(false)} onSuccess={() => { setShowManualOrder(false); fetchData(); }} />}
      {reorderItem && <ReorderModal item={reorderItem} onClose={() => setReorderItem(null)} onSuccess={() => { setReorderItem(null); fetchData(); }} />}
      {showEditSuggestion && suggestionData && (
        <EditSuggestionModal
          medicine={suggestionData.item}
          medicineName={suggestionData.medicineName}
          suggestedQty={suggestionData.suggestedQty}
          suppliers={suggestionData.suppliers}
          supplierName={suggestionData.item.supplier?.name || suggestionData.suppliers[0]?.name || ''}
          onClose={() => setShowEditSuggestion(false)}
          onApprove={(qty, supplier) => { approveSuggestion(qty, supplier); setShowEditSuggestion(false); }}
        />
      )}
      {selectedStock && (
        <StockDetailDrawer
          item={selectedStock}
          onClose={() => setSelectedStock(null)}
          onReorder={(item) => { setSelectedStock(null); setReorderItem(item); }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {t('dashboard.overview.greeting', { name: user?.first_name || user?.email?.split('@')[0] || 'Member' })}
          </h1>
          <p className="text-white/40 text-sm">{t('dashboard.overview.subtitle')}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowExport(true)} className="bg-white/5 border border-white/10 text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={14} /> {t('dashboard.overview.export_report')}
          </button>
          <button onClick={() => setShowManualOrder(true)} className="bg-acid text-void text-xs font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2">
            <Plus size={14} /> {t('dashboard.overview.manual_order')}
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {stats.critical > 0 && (
        <div className="bg-gradient-to-r from-danger/20 to-transparent border-l-4 border-danger p-4 rounded-r-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-danger" size={20} />
            <span className="text-sm font-bold">{t('dashboard.overview.critical_alert', { count: stats.critical })}</span>
          </div>
          <button onClick={() => setShowCritical(true)} className="text-xs font-bold text-danger hover:underline">{t('dashboard.overview.view_all')}</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('dashboard.overview.stats.total_stock'), val: stats.total + ' SKUs', sub: t('dashboard.overview.stats.total_sub'), icon: Package, color: 'text-acid' },
          { label: t('dashboard.overview.stats.critical'), val: stats.critical, sub: t('dashboard.overview.stats.critical_sub'), icon: AlertCircle, color: 'text-danger' },
          { label: t('dashboard.overview.stats.low_stock'), val: stats.low, sub: t('dashboard.overview.stats.low_sub'), icon: TrendingDown, color: 'text-warn' },
          { label: t('dashboard.overview.stats.expiring'), val: stats.expiringSoon, sub: t('dashboard.overview.stats.expiring_sub'), icon: Clock, color: 'text-coral' }
        ].map((stat, i) => (
          <div key={i} className="bg-[#161618] border border-white/5 p-6 rounded-xl hover:border-white/15 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{stat.label}</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {isLoading ? <Skeleton w="40px" h="28px" /> : stat.val}
            </h3>
            <p className="text-xs text-white/40">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Stock Table */}
        <div className="bg-[#161618] border border-white/5 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/60">{t('dashboard.overview.table.title')}</h4>
            <div className="flex items-center gap-2 text-white/30">
              <Search size={13} />
              <span className="text-[11px]">{t('dashboard.overview.table.items_count', { count: items.length })}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px] md:min-w-0">
              <thead className="text-white/30 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('dashboard.overview.table.drug_name')}</th>
                  <th className="px-6 py-4 font-medium border-l border-white/5">{t('dashboard.overview.table.category')}</th>
                  <th className="px-6 py-4 font-medium border-l border-white/5">{t('dashboard.overview.table.stock')}</th>
                  <th className="px-6 py-4 font-medium">{t('dashboard.overview.table.min')}</th>
                  <th className="px-6 py-4 font-medium border-l border-white/5">{t('dashboard.overview.table.status')}</th>
                  <th className="px-6 py-4 font-medium text-right border-l border-white/5">{t('dashboard.overview.table.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-6 py-2"><Skeleton h="20px" className="w-full" /></td></tr>
                  ))
                ) : items.slice(0, 10).map((row, i) => {
                  const qty = row.quantity ?? 0;
                  const threshold = row.medicine?.low_stock_threshold ?? 10;
                  const medicineName = row.medicine?.name || 'Unknown';
                  const manufacturer = row.medicine?.manufacturer || '-';
                  const expiry = row.expiry_date ? new Date(row.expiry_date) : null;
                  const isExpired = expiry && expiry < new Date();
                  const status = isExpired ? 'EXPIRED' : qty === 0 ? 'CRITICAL' : qty <= threshold ? 'LOW' : 'OK';

                  return (
                    <tr
                      key={row.id || i}
                      onClick={() => setSelectedStock(row)}
                      className={`hover:bg-white/[0.04] transition-colors group cursor-pointer ${qty === 0 ? 'bg-danger/[0.03]' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-bold text-white/90">{medicineName}</span>
                          {row.batch_number && <span className="block text-[10px] text-white/30 font-mono mt-0.5">{row.batch_number}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/40 border-l border-white/5">{manufacturer}</td>
                      <td className={`px-6 py-4 font-bold border-l border-white/5 ${status === 'CRITICAL' || status === 'EXPIRED' ? 'text-danger' : status === 'LOW' ? 'text-warn' : 'text-white/80'}`}>{qty}</td>
                      <td className="px-6 py-4 text-white/40">{threshold}</td>
                      <td className="px-6 py-4 border-l border-white/5">
                        <StatusBadge status={status} />
                      </td>
                      <td className="px-6 py-4 text-right border-l border-white/5">
                        {status !== 'OK' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setReorderItem(row); }}
                            className="bg-acid/10 hover:bg-acid text-acid hover:!text-black px-3 py-1 rounded font-bold transition-all"
                          >
                            {t('dashboard.overview.table.reorder')}
                          </button>
                        ) : (
                          <span className="text-white/20 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* AI Suggestion Card */}
          {suggestion.status === 'loading' && (
            <div className="bg-[#161618] border border-white/5 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-acid/20 flex items-center justify-center">
                  <Loader2 size={12} className="text-acid animate-spin" />
                </div>
                <span className="text-xs font-bold font-mono text-white/30 tracking-wide uppercase">Loading AI Suggestion...</span>
              </div>
              <Skeleton h="60px" className="w-full rounded-lg" />
            </div>
          )}

          {suggestion.status === 'pending' && suggestionData && (() => {
            const confidence = getConfidence();
            return (
              <div className="bg-[#161618] border-2 border-acid/20 rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-acid/5 rounded-full blur-2xl group-hover:bg-acid/10 transition-all"></div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-5 h-5 rounded-full bg-acid flex items-center justify-center text-void">
                    <Cpu size={12} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold font-mono text-acid tracking-wide uppercase">{t('dashboard.overview.suggestion.badge')}</span>
                  <span className="ml-auto text-[10px] text-white/30">{t('dashboard.overview.suggestion.time')}</span>
                </div>
                <h5 className="text-white font-bold text-sm mb-2">{suggestionData.medicineName}</h5>
                <p className="text-[11px] text-white/60 leading-relaxed mb-6">
                  Recommended: <span className="text-white font-bold">{suggestionData.suggestedQty.toLocaleString()} units</span>.
                  {suggestionData.daysOfStock !== null && <> Current stock covers <span className="text-white font-bold">~{suggestionData.daysOfStock} days</span>.</>}
                  {suggestionData.riskLevel && suggestionData.riskLevel !== 'unknown' && <> Risk level: <span className={`font-bold ${suggestionData.riskLevel === 'critical' ? 'text-danger' : suggestionData.riskLevel === 'high' ? 'text-warn' : 'text-white'}`}>{suggestionData.riskLevel}</span>.</>}
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{t('dashboard.overview.suggestion.confidence')}</span>
                    <span className="text-xs font-bold text-acid">{confidence}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-acid rounded-full shadow-[0_0_10px_rgba(232,245,50,0.5)]" style={{ width: `${confidence}%` }}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveSuggestion()}
                    disabled={approving}
                    className="flex-1 bg-acid text-void h-8 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
                  >
                    {approving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} {t('dashboard.overview.suggestion.approve')}
                  </button>
                  <button onClick={() => setShowEditSuggestion(true)} className="w-16 h-8 border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all" title={t('dashboard.overview.suggestion.edit')}>
                    <Edit size={14} />
                  </button>
                  <button onClick={rejectSuggestion} className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-danger transition-all" title={t('dashboard.overview.suggestion.reject')}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })()}

          {suggestion.status === 'approved' && (
            <div className="bg-emerald-500/5 border-2 border-emerald-500/20 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <CheckCircle size={28} className="text-emerald-500" />
              <p className="font-bold text-sm text-white">{t('dashboard.overview.suggestion.approved_title')}</p>
              <p className="text-[11px] text-white/40">
                {t('dashboard.overview.suggestion.approved_desc', {
                  qty: suggestionData?.suggestedQty?.toLocaleString() || '—',
                  supplier: suggestionData?.item?.supplier?.name || suggestionData?.suppliers?.[0]?.name || '—'
                })}
              </p>
              <button onClick={() => { setSuggestion({ status: 'loading' }); fetchAISuggestion(); }} className="text-[11px] font-bold text-white/30 hover:text-white mt-2">{t('dashboard.overview.suggestion.next_suggestion')}</button>
            </div>
          )}

          {suggestion.status === 'rejected' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <X size={24} className="text-white/30" />
              <p className="text-xs text-white/40">{t('dashboard.overview.suggestion.suggestion_dismissed')}</p>
              <button onClick={() => { setSuggestion({ status: 'loading' }); fetchAISuggestion(); }} className="text-[11px] font-bold text-acid hover:underline">{t('dashboard.overview.suggestion.restore')}</button>
            </div>
          )}

          {suggestion.status === 'none' && (
            <div className="bg-[#161618] border border-white/5 rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <CheckCircle size={24} className="text-emerald-500/40" />
              <p className="text-xs text-white/40">All stock levels healthy — no AI suggestions at this time.</p>
            </div>
          )}

          {/* Expiry Alerts */}
          <div className="bg-[#161618] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest">{t('dashboard.overview.expiry.title')}</h5>
              <Clock size={16} className="text-coral" />
            </div>
            <div className="space-y-6">
              {(() => {
                const now = new Date();
                const thirtyDays = 30 * 24 * 60 * 60 * 1000;
                const expiringItems = items.filter(r => {
                  if (!r.expiry_date || (r.quantity ?? 0) === 0) return false;
                  const expD = new Date(r.expiry_date);
                  return expD >= now && (expD - now) < thirtyDays;
                }).sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)).slice(0, 4);

                if (expiringItems.length === 0) {
                  return <p className="text-[11px] text-white/30 text-center py-4">No items expiring soon.</p>;
                }

                return expiringItems.map((item, i) => {
                  const daysLeft = Math.ceil((new Date(item.expiry_date) - now) / (1000 * 60 * 60 * 24));
                  const risk = daysLeft < 7 ? 'high' : daysLeft < 14 ? 'med' : 'low';
                  const riskDots = risk === 'high' ? 4 : risk === 'med' ? 3 : 1;
                  return (
                    <div key={item.id || i} className="flex flex-col gap-2 relative pl-4 border-l border-white/10 hover:border-acid/30 transition-all cursor-pointer">
                      <div className="text-[11px] font-bold text-white/90">{item.medicine?.name || 'Unknown'}</div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-white/40">Exp: {new Date(item.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="text-white/40 font-mono">{item.quantity} units</span>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= riskDots ? 'bg-acid' : 'bg-white/5'}`}></div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
              <button
                onClick={() => navigate('/dashboard/redistributions')}
                className="w-full h-9 border border-white/10 rounded-lg text-[11px] font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
              >
                {t('dashboard.overview.expiry.redistribute')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Terminal */}
      <NLQueryTerminal />
    </div>
  );
};

export default OverviewPage;
