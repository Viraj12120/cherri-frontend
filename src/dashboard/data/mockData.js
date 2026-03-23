// ─── DATA ───────────────────────────────────────────────────────────────────

export const CRITICAL_ITEMS = [
  { name: 'Metformin 500mg', sku: 'MET-500', category: 'Diabetes', stock: 12, min: 200, batch: 'B-2024-01', expiry: '2025-03-15', daysLeft: 3, supplier: 'MediSource India', suggestedOrder: 2400, risk: 'Stockout in 3 days. Demand spike (+34%) expected next week.' },
  { name: 'Insulin Glargine', sku: 'INS-GLR', category: 'Diabetes', stock: 45, min: 100, batch: 'B-2024-02', expiry: '2025-06-30', daysLeft: 13, supplier: 'PharmaCorp', suggestedOrder: 480, risk: 'Stock 55% below minimum. Refrigeration required — prioritize.' },
  { name: 'Cetirizine 10mg', sku: 'CET-010', category: 'Allergy', stock: 8, min: 120, batch: 'B-2024-07', expiry: '2025-12-01', daysLeft: 2, supplier: 'GenericMed', suggestedOrder: 600, risk: 'Only 2 days of stock remaining. Immediate reorder required.' },
];

export const STOCK_TABLE = [
  { name: 'Metformin 500mg', sku: 'MET-500', cat: 'Diabetes', stock: 12, min: 200, status: 'CRIT', color: 'text-danger bg-danger/10 border-danger/20', supplier: 'MediSource India', suggestedQty: 2400, unitCost: 2.50, batch: 'B-2024-01', expiry: '2025-03-15', sellingPrice: 4.00, daysLeft: 3, description: 'Oral hypoglycaemic agent used in the treatment of type 2 diabetes mellitus.', consumption: [40, 38, 45, 50, 48, 55, 60] },
  { name: 'Insulin Glargine', sku: 'INS-GLR', cat: 'Diabetes', stock: 45, min: 100, status: 'LOW', color: 'text-warn bg-warn/10 border-warn/20', supplier: 'PharmaCorp', suggestedQty: 480, unitCost: 18.00, batch: 'B-2024-02', expiry: '2025-06-30', sellingPrice: 24.00, daysLeft: 13, description: 'Long-acting insulin analogue used for the management of type 1 and 2 diabetes.', consumption: [3, 4, 3, 5, 4, 6, 5] },
  { name: 'Amoxicillin 500mg', sku: 'AMX-500', cat: 'Antibiotic', stock: 320, min: 50, status: 'OK', color: 'text-success bg-success/10 border-success/20', supplier: 'BioPharm Ltd', suggestedQty: 0, unitCost: 3.20, batch: 'B-2024-03', expiry: '2026-01-20', sellingPrice: 5.50, daysLeft: 90, description: 'Broad-spectrum penicillin antibiotic used to treat bacterial infections.', consumption: [10, 8, 12, 9, 11, 10, 13] },
  { name: 'Atorvastatin 10mg', sku: 'ATV-010', cat: 'Cholesterol', stock: 89, min: 100, status: 'LOW', color: 'text-warn bg-warn/10 border-warn/20', supplier: 'GenericMed', suggestedQty: 200, unitCost: 4.10, batch: 'B-2024-04', expiry: '2025-03-28', sellingPrice: 7.00, daysLeft: 25, description: 'Statin used to prevent cardiovascular disease and lower cholesterol levels.', consumption: [3, 4, 3, 3, 4, 5, 4] },
  { name: 'Metoprolol 50mg', sku: 'MTP-050', cat: 'Hypertension', stock: 156, min: 50, status: 'OK', color: 'text-success bg-success/10 border-success/20', supplier: 'PharmaCorp', suggestedQty: 0, unitCost: 1.80, batch: 'B-2024-05', expiry: '2026-05-10', sellingPrice: 3.20, daysLeft: 52, description: 'Beta-blocker used for treatment of heart failure and high blood pressure.', consumption: [5, 6, 5, 4, 6, 5, 7] },
];

export const SUPPLIERS = ['MediSource India', 'PharmaCorp', 'BioPharm Ltd', 'GenericMed', 'Apollo Health'];
