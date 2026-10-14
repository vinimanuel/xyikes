import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { calculateRecipeCosting, formatCurrency } from '../domain/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { FileText, Download, Printer } from 'lucide-react';

export default function Reports() {
  const { recipes, menuItems, ingredients, simulations, sops, stockMovements } = useAppStore();
  const [activeReport, setActiveReport] = useState('costing');

  const costingData = menuItems
    .filter(m => m.recipeId)
    .map(m => {
      const recipe = recipes.find(r => r.id === m.recipeId);
      if (!recipe) return null;
      const costing = calculateRecipeCosting(recipe, ingredients, m.sellingPrice);
      return { name: m.name, cost: costing.costPerServing, price: m.sellingPrice, profit: costing.grossProfit, margin: costing.grossMargin, foodCost: costing.foodCostPercent };
    })
    .filter(Boolean) as any[];

  const ingredientUsage = ingredients.map(ing => {
    let totalUsed = 0;
    recipes.forEach(r => {
      r.ingredients.forEach(ri => {
        if (ri.ingredientId === ing.id) totalUsed += ri.quantity;
      });
    });
    return { name: ing.name.substring(0, 15), usage: totalUsed, stock: ing.currentStock };
  }).sort((a, b) => b.usage - a.usage);

  const simulationHistory = simulations.map(s => ({
    name: sops.find(so => so.id === s.sopId)?.title?.substring(0, 15) || 'Unknown',
    duration: s.elapsedSeconds,
    date: new Date(s.startedAt).toLocaleDateString('id-ID'),
    status: s.status,
  }));

  const handleExportCSV = () => {
    const headers = ['Menu', 'Harga Jual', 'Cost per Porsi', 'Profit', 'Margin %', 'Food Cost %'];
    const rows = costingData.map(c => [c.name, c.price, Math.round(c.cost), Math.round(c.profit), c.margin.toFixed(1), c.foodCost.toFixed(1)]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'gastrosim-costing-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  const reports = [
    { id: 'costing', label: 'Recipe Costing' },
    { id: 'margin', label: 'Gross Margin' },
    { id: 'ingredients', label: 'Ingredient Usage' },
    { id: 'simulations', label: 'Simulation History' },
    { id: 'inventory', label: 'Inventory Status' },
  ];

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Laporan</h1>
          <p className="text-sm text-gray-500">Analisis dan export data operasional</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-1.5 text-xs"><Download size={14} /> Export CSV</button>
          <button onClick={handlePrintRecipe} className="btn-secondary flex items-center gap-1.5 text-xs"><Printer size={14} /> Print</button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex gap-1 bg-beige rounded-lg p-1 mb-4 overflow-x-auto">
        {reports.map(r => (
          <button key={r.id} onClick={() => setActiveReport(r.id)} className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${activeReport === r.id ? 'bg-white shadow text-espresso' : 'text-gray-500'}`}>{r.label}</button>
        ))}
      </div>

      {/* Report Content */}
      {activeReport === 'costing' && (
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Recipe Costing Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-beige">
                <tr>
                  <th className="text-left p-2">Menu</th>
                  <th className="text-right p-2">Harga Jual</th>
                  <th className="text-right p-2">Cost/Porsi</th>
                  <th className="text-right p-2">Gross Profit</th>
                  <th className="text-right p-2">Margin</th>
                  <th className="text-right p-2">Food Cost</th>
                </tr>
              </thead>
              <tbody>
                {costingData.map((c, i) => (
                  <tr key={i} className="border-t border-beige">
                    <td className="p-2 font-medium text-espresso">{c.name}</td>
                    <td className="p-2 text-right">{formatCurrency(c.price)}</td>
                    <td className="p-2 text-right">{formatCurrency(c.cost)}</td>
                    <td className="p-2 text-right text-sage font-medium">{formatCurrency(c.profit)}</td>
                    <td className="p-2 text-right">{c.margin.toFixed(1)}%</td>
                    <td className={`p-2 text-right ${c.foodCost > 35 ? 'text-soft-red' : ''}`}>{c.foodCost.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === 'margin' && (
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Gross Margin per Menu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costingData.map(c => ({ name: c.name.substring(0, 12), margin: c.margin, profit: Math.round(c.profit) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="margin" fill="#7BA05B" radius={[4, 4, 0, 0]} name="Margin %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'ingredients' && (
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Penggunaan Bahan dalam Resep</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ingredientUsage.slice(0, 15)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip />
              <Bar dataKey="usage" fill="#E07A3A" radius={[0, 4, 4, 0]} name="Total Penggunaan" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'simulations' && (
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Riwayat Simulasi</h3>
          {simulationHistory.length > 0 ? (
            <div className="space-y-2">
              {simulationHistory.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-cream rounded text-xs">
                  <span className="font-medium text-espresso">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{s.duration.toFixed(1)}s</span>
                    <span className="text-gray-400">{s.date}</span>
                    <span className={`badge ${s.status === 'completed' ? 'bg-sage/20 text-sage' : 'bg-warning-yellow/20 text-warning-yellow'}`}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">Belum ada simulasi yang dijalankan</p>
          )}
        </div>
      )}

      {activeReport === 'inventory' && (
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Status Inventori</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-beige">
                <tr>
                  <th className="text-left p-2">Bahan</th>
                  <th className="text-right p-2">Stok</th>
                  <th className="text-right p-2">Min</th>
                  <th className="text-right p-2">Status</th>
                  <th className="text-left p-2">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map(ing => (
                  <tr key={ing.id} className="border-t border-beige">
                    <td className="p-2 font-medium text-espresso">{ing.name}</td>
                    <td className="p-2 text-right">{ing.currentStock} {ing.baseUnit}</td>
                    <td className="p-2 text-right text-gray-500">{ing.minStock} {ing.baseUnit}</td>
                    <td className="p-2 text-right">
                      <span className={`badge ${ing.currentStock <= ing.minStock ? 'bg-soft-red/10 text-soft-red' : 'bg-sage/20 text-sage'}`}>
                        {ing.currentStock <= ing.minStock ? 'Rendah' : 'Aman'}
                      </span>
                    </td>
                    <td className="p-2 text-gray-500">{ing.storageLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
