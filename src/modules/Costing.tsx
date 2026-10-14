import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { calculateRecipeCosting, formatCurrency, suggestPrice } from '../domain/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { Calculator, Target, TrendingUp } from 'lucide-react';

export default function Costing() {
  const { recipes, menuItems, ingredients } = useAppStore();
  const [targetFoodCost, setTargetFoodCost] = useState(30);
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0]?.id || '');

  const costingData = menuItems
    .filter(m => m.recipeId)
    .map(m => {
      const recipe = recipes.find(r => r.id === m.recipeId);
      if (!recipe) return null;
      const costing = calculateRecipeCosting(recipe, ingredients, m.sellingPrice);
      return { ...costing, name: m.name, category: m.category };
    })
    .filter(Boolean) as any[];

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);
  const selectedMenuItem = menuItems.find(m => m.recipeId === selectedRecipeId);
  const selectedCosting = selectedRecipe ? calculateRecipeCosting(selectedRecipe, ingredients, selectedMenuItem?.sellingPrice) : null;
  const suggestedPrice = selectedCosting ? suggestPrice(selectedCosting.costPerServing, targetFoodCost) : 0;

  // Menu Engineering Matrix
  const avgMargin = costingData.length > 0 ? costingData.reduce((s, c) => s + c.grossMargin, 0) / costingData.length : 0;
  
  const matrixData = costingData.map(c => {
    const classification = c.grossMargin >= avgMargin ? (c.foodCost < 30 ? 'Star' : 'Plowhorse') : (c.foodCost < 30 ? 'Puzzle' : 'Dog');
    return { name: c.name, margin: c.grossMargin, foodCost: c.foodCost, profit: c.grossProfit, classification };
  });

  const COLORS: Record<string, string> = { Star: '#7BA05B', Plowhorse: '#E07A3A', Puzzle: '#E8B84B', Dog: '#D4605A' };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Cost & Profit</h1>
          <p className="text-sm text-gray-500">Analisis biaya resep dan margin keuntungan</p>
        </div>
      </div>

      {/* Recipe Costing Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3 flex items-center gap-2">
            <Calculator size={16} /> Detail Costing Resep
          </h3>
          <select value={selectedRecipeId} onChange={e => setSelectedRecipeId(e.target.value)} className="input-field mb-3 text-xs">
            {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          
          {selectedCosting && (
            <div className="space-y-2">
              {selectedCosting.ingredientCosts.map((ic, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-cream">
                  <span className="text-gray-700">{ic.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{ic.quantity.toFixed(1)} {ic.unit}</span>
                    <span className="text-burnt-orange font-medium">{formatCurrency(ic.cost)}</span>
                  </div>
                </div>
              ))}
              <div className="border-t border-beige pt-2 mt-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-espresso">Total Biaya Resep</span>
                  <span className="text-burnt-orange">{formatCurrency(selectedCosting.totalCost)}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Cost per porsi</span>
                  <span className="text-espresso font-medium">{formatCurrency(selectedCosting.costPerServing)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3 flex items-center gap-2">
            <Target size={16} /> Rekomendasi Harga
          </h3>
          {selectedCosting && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Target Food Cost: {targetFoodCost}%</label>
                <input type="range" min="10" max="60" value={targetFoodCost} onChange={e => setTargetFoodCost(Number(e.target.value))} className="w-full accent-burnt-orange" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-cream rounded-lg">
                  <span className="text-xs text-gray-500">Harga Jual Saat Ini</span>
                  <p className="text-lg font-bold text-espresso">{selectedMenuItem ? formatCurrency(selectedMenuItem.sellingPrice) : '-'}</p>
                </div>
                <div className="p-3 bg-sage/10 rounded-lg border border-sage/20">
                  <span className="text-xs text-sage">Harga Rekomendasi</span>
                  <p className="text-lg font-bold text-sage">{formatCurrency(suggestedPrice)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-cream rounded text-center">
                  <span className="text-gray-500 block">Gross Profit</span>
                  <span className="font-bold text-espresso">{formatCurrency(selectedCosting.grossProfit)}</span>
                </div>
                <div className="p-2 bg-cream rounded text-center">
                  <span className="text-gray-500 block">Margin</span>
                  <span className="font-bold text-sage">{selectedCosting.grossMargin.toFixed(1)}%</span>
                </div>
                <div className="p-2 bg-cream rounded text-center">
                  <span className="text-gray-500 block">Food Cost</span>
                  <span className={`font-bold ${selectedCosting.foodCostPercent > 35 ? 'text-soft-red' : 'text-espresso'}`}>{selectedCosting.foodCostPercent.toFixed(1)}%</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 italic">* Harga rekomendasi dihitung: Recipe Cost ÷ Target Food Cost Ratio. Pembulatan ke Rp1.000 terdekat. Tidak termasuk biaya operasional (sewa, gaji, utilitas, pajak).</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Engineering Matrix */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold text-espresso text-sm mb-3 flex items-center gap-2">
          <TrendingUp size={16} /> Menu Engineering Matrix
        </h3>
        <p className="text-xs text-gray-500 mb-3">Klasifikasi berdasarkan margin (threshold: {avgMargin.toFixed(1)}% rata-rata). Data popularitas belum tersedia — klasifikasi berdasarkan estimasi biaya.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['Star', 'Plowhorse', 'Puzzle', 'Dog'] as const).map(cls => {
            const items = matrixData.filter(m => m.classification === cls);
            return (
              <div key={cls} className="p-3 rounded-lg border-2" style={{ borderColor: COLORS[cls] + '40' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[cls] }} />
                  <span className="text-xs font-bold" style={{ color: COLORS[cls] }}>{cls === 'Star' ? '⭐ Star' : cls === 'Plowhorse' ? '🐴 Plowhorse' : cls === 'Puzzle' ? '🧩 Puzzle' : '🐕 Dog'}</span>
                </div>
                <div className="space-y-1">
                  {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate">{item.name}</span>
                      <span className="font-medium" style={{ color: COLORS[cls] }}>{item.margin.toFixed(0)}%</span>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-xs text-gray-300">Tidak ada</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Distribution Chart */}
      <div className="card p-4">
        <h3 className="font-semibold text-espresso text-sm mb-3">Food Cost vs Margin per Menu</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={costingData.map(c => ({ name: c.name?.substring(0, 10), foodCost: c.foodCostPercent.toFixed(1), margin: c.grossMargin.toFixed(1) }))}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="foodCost" fill="#E07A3A" radius={[4, 4, 0, 0]} name="Food Cost %" />
            <Bar dataKey="margin" fill="#7BA05B" radius={[4, 4, 0, 0]} name="Margin %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
