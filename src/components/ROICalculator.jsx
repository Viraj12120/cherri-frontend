import React, { useState } from 'react';
import { Calculator, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';

/**
 * ROICalculator
 * 
 * Interactive tool for Distributor onboarding.
 * Inputs: Monthly Inventory Value, Current Expiry Rate (%).
 * Outputs: Annual Expiry Loss, Potential Savings (with Cherri+).
 *
 * Data sources (latest articles):
 * [1] GS1 India Supply Chain Study (2022) via Maersk Insights (Feb 2024)
 *     https://www.maersk.com/insights/growth/2024/02/27/pharmaceutical-supply-chain-in-india
 *     → >50% of pharma manufacturers lose ~1% of sales to expiry & pilferage.
 *     → Indian distributors hold 98 days of inventory vs. global best-in-class 64 days.
 *
 * [2] Pharmarack + IPA: "Changing Dynamics of Indian Pharma Supply Chain" (Aug 2024)
 *     https://www.businesstoday.in/industry/pharma/story/indian-pharmaceutical-industry-expected-to-reach-55-billion-by-2030-report-443526-2024-08-29
 *     → Indian pharma market valued at ₹2.42 lakh crore ($29B) in 2023.
 *     → Standalone pharmacies hold 54% market; organised stockists at 10%, growing to 25–30% by 2030.
 *     → Digitisation and Good Distribution Practices (GDP) key to last-mile quality.
 *
 * [3] Dept. of Pharmaceuticals, GoI — PIB Press Release (FY24)
 *     https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2085345
 *     → Domestic pharma consumption FY24 = ₹2,01,372 crore (~$23.5B); ~65,000 stockists nationwide.
 *     → Mid-size distributor handles approx. ₹15–50L/month.
 *
 * [4] IBEF: Indian Pharmaceuticals Industry Analysis (2025)
 *     https://www.ibef.org/industry/pharmaceutical-india
 *     → Indian pharma market reached ₹4,71,295 crore ($55B) in 2025 (Bain & Co).
 *
 * [5] Pharmanow: Inventory Management in Pharma — 2025 Solutions Guide
 *     https://www.pharmanow.live/knowledge-hub/research/inventory-management-pharma-supply-chain
 *     → FEFO (First-Expired-First-Out) adoption across distribution reduces expiry waste significantly.
 *     → Industry expiry range: 5–12% for untracked stockists; 1–3% for digitised operations.
 *     → 45% savings projection based on automated replenishment deployment outcomes.
 */
const ROICalculator = () => {
    const [inventoryValue, setInventoryValue] = useState(200000);
    const [expiryRate, setExpiryRate] = useState(5);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    const annualLoss = (inventoryValue * (expiryRate / 100)) * 12;
    const potentialSavings = annualLoss * 0.45; // 45% reduction in expiry with Cherri+

    return (
        <div className="bg-[#0A0C10] border border-white/5 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-acid/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-acid/10 transition-all duration-700 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-acid/10 rounded-2xl text-acid">
                    <Calculator size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">ROI Calculator</h3>
                    <p className="text-xs text-white/40">Estimate your annual savings with Cherri+ Distributor</p>
                </div>
            </div>

            <div className="space-y-8 relative z-10">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-white/60 tracking-widest uppercase">Monthly Inventory Value</label>
                        <span className="text-sm font-bold text-acid">{formatCurrency(inventoryValue)}</span>
                    </div>
                    <input
                        type="range"
                        min="200000"
                        max="10000000"
                        step="50000"
                        value={inventoryValue}
                        onChange={(e) => setInventoryValue(Number(e.target.value))}
                        className="w-full accent-acid h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-white/20">
                        <span>Min: ₹2L</span>
                        <span>Max: ₹1Cr</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-white/60 tracking-widest uppercase">Current Expiry Rate (%)</label>
                        <span className="text-sm font-bold text-danger">{expiryRate}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="15"
                        step="0.5"
                        value={expiryRate}
                        onChange={(e) => setExpiryRate(Number(e.target.value))}
                        className="w-full accent-danger h-1 bg-white/5 rounded-lg appearance-none cursor-pointer opacity-80"
                    />
                    <div className="flex justify-between text-[10px] text-white/20">
                        <span>Min: 1%</span>
                        <span>Max: 15%</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/5">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                        <div className="flex items-center gap-2 text-danger/60 mb-2 font-bold text-[10px] uppercase tracking-widest leading-none">
                            <TrendingDown size={12} />
                            Annual Expiry Loss
                        </div>
                        <div className="text-lg font-bold text-white/90">{formatCurrency(annualLoss)}</div>
                        <p className="text-[9px] text-white/30 mt-1 leading-tight">Without automated tracking & replenishment</p>
                    </div>

                    <div className="p-5 bg-acid/5 rounded-2xl border border-acid/20 shadow-[0_0_20px_rgba(232,245,50,0.05)] scale-[1.05] relative shadow-xl">
                        <div className="absolute -top-3 -right-2 bg-acid text-void text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-lg">
                            Savings
                        </div>
                        <div className="flex items-center gap-2 text-acid mb-2 font-bold text-[10px] uppercase tracking-widest leading-none">
                            <DollarSign size={12} />
                            Potential Recovery
                        </div>
                        <div className="text-2xl font-bold text-white">{formatCurrency(potentialSavings)}</div>
                        <p className="text-[9px] text-acid/60 mt-1 leading-tight">Projected annual savings with Cherri+ Pro</p>
                    </div>
                </div>

                <button className="w-full py-4 bg-acid text-void rounded-2xl font-bold text-sm tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(232,245,50,0.15)] flex items-center justify-center gap-3 mt-6 group/btn">
                    Start Your Pro Pilot Now
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default ROICalculator;