import React from 'react';
import { useAppStore } from '../stores';
import { calculateRecipeCosting, formatCurrency } from '../domain/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Plus, UtensilsCrossed, FlaskConical, ClipboardList, Box, Package, TrendingUp, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { menuItems, recipes, sops, ingredients, simulations } = useAppStore();
  const navigate = useNavigate();

  const activeRecipes = recipes.filter(r => r.menuItemId);
  const activeSOPs = sops.filter(s => s.status === 'approved');
  const inventoryValue = ingredients.reduce((sum, i) => sum + (i.currentStock / (i.purchaseQuantity || 1)) * i.purchasePrice, 0);
  
  const avgPrepTime = menuItems.length > 0 
    ? menuItems.reduce((sum, m) => sum + m.estimatedPrepTime, 0) / menuItems.length 
    : 0;

  // Calculate costing for menu items
  const costingData = menuItems
    .filter(m => m.recipeId)
    .map(m => {
      const recipe = recipes.find(r => r.id === m.recipeId);
      if (!recipe) return null;
      const costing = calculateRecipeCosting(recipe, ingredients, m.sellingPrice);
      return { name: m.name, foodCost: costing.foodCostPercent, margin: costing.grossMargin, cost: costing.costPerServing, price: m.sellingPrice, profit: costing.grossProfit };
    })
    .filter(Boolean) as any[];

  const avgFoodCost = costingData.length > 0 
    ? costingData.reduce((s, c) => s + c.foodCost, 0) / costingData.length 
    : 0;

  const lowStockIngredients = ingredients.filter(i => i.currentStock <= i.minStock);
  
  const topMarginItems = [...costingData].sort((a, b) => b.margin - a.margin).slice(0, 5);

  const costDistribution = [
    { name: '< 25%', value: costingData.filter(c => c.foodCost < 25).length },
    { name: '25-35%', value: costingData.filter(c => c.foodCost >= 25 && c.foodCost < 35).length },
    { name: '35-45%', value: costingData.filter(c => c.foodCost >= 35 && c.foodCost < 45).length },
    { name: '> 45%', value: costingData.filter(c => c.foodCost >= 45).length },
  ];

  const COLORS = ['#7BA05B', '#E07A3A', '#E8B84B', '#D4605A'];

  const revenueData = costingData.map(c => ({
    name: c.name.substring(0, 12),
    profit: Math.round(c.profit),
    cost: Math.round(c.cost),
  }));

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Ringkasan operasional kafe Anda</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/menu')} className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={14} /> Item Menu
          </button>
          <button onClick={() => navigate('/recipes')} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Plus size={14} /> Resep
          </button>
          <button onClick={() => navigate('/simulation')} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Box size={14} /> Simulasi
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard icon={<UtensilsCrossed size={20} />} label="Item Menu" value={menuItems.length.toString()} color="bg-burnt-orange/10 text-burnt-orange" />
        <MetricCard icon={<FlaskConical size={20} />} label="Resep Aktif" value={activeRecipes.length.toString()} color="bg-soft-blue/10 text-soft-blue" />
        <MetricCard icon={<ClipboardList size={20} />} label="SOP Aktif" value={activeSOPs.length.toString()} color="bg-sage/10 text-sage" />
        <MetricCard icon={<DollarSign size={20} />} label="Nilai Inventori" value={formatCurrency(inventoryValue)} color="bg-warning-yellow/10 text-warning-yellow" />
        <MetricCard icon={<Clock size={20} />} label="Rata-rata Prep" value={`${Math.round(avgPrepTime)} menit`} color="bg-soft-blue/10 text-soft-blue" />
        <MetricCard icon={<TrendingUp size={20} />} label="Rata-rata Food Cost" value={`${avgFoodCost.toFixed(1)}%`} color="bg-sage/10 text-sage" />
        <MetricCard icon={<Package size={20} />} label="Stok Rendah" value={lowStockIngredients.length.toString()} color={lowStockIngredients.length > 0 ? 'bg-soft-red/10 text-soft-red' : 'bg-sage/10 text-sage'} />
        <MetricCard icon={<Box size={20} />} label="Total Simulasi" value={simulations.length.toString()} color="bg-burnt-orange/10 text-burnt-orange" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Profit per Menu Item</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="profit" fill="#7BA05B" radius={[4, 4, 0, 0]} name="Profit" />
              <Bar dataKey="cost" fill="#E07A3A" radius={[4, 4, 0, 0]} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Distribusi Food Cost</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={costDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {costDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Margin Items */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Margin Tertinggi</h3>
          <div className="space-y-2">
            {topMarginItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium text-sage">{item.margin.toFixed(1)}%</span>
              </div>
            ))}
            {topMarginItems.length === 0 && <p className="text-xs text-gray-400">Belum ada data costing</p>}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-soft-red" /> Stok Rendah
          </h3>
          <div className="space-y-2">
            {lowStockIngredients.slice(0, 5).map(ing => (
              <div key={ing.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{ing.name}</span>
                <span className="font-medium text-soft-red">{ing.currentStock} {ing.baseUnit}</span>
              </div>
            ))}
            {lowStockIngredients.length === 0 && <p className="text-xs text-gray-400">Semua stok aman ✓</p>}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Aksi Cepat</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/menu')} className="w-full text-left text-xs p-2 rounded-lg hover:bg-beige transition">📋 Buat Item Menu Baru</button>
            <button onClick={() => navigate('/recipes')} className="w-full text-left text-xs p-2 rounded-lg hover:bg-beige transition">🧪 Kembangkan Resep</button>
            <button onClick={() => navigate('/sops')} className="w-full text-left text-xs p-2 rounded-lg hover:bg-beige transition">📝 Buat SOP Baru</button>
            <button onClick={() => navigate('/simulation')} className="w-full text-left text-xs p-2 rounded-lg hover:bg-beige transition">🎮 Mulai Simulasi 3D</button>
            <button onClick={() => navigate('/inventory')} className="w-full text-left text-xs p-2 rounded-lg hover:bg-beige transition">📦 Tambah Bahan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="card p-4 card-hover">
      <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-2`}>{icon}</div>
      <p className="text-lg font-bold text-espresso">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
