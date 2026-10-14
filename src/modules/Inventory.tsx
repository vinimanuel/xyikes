import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Ingredient, Unit, UNIT_LABELS } from '../domain/models';
import { formatCurrency, getCostPerBaseUnit } from '../domain/calculations';
import { Plus, X, Search, AlertTriangle, Package, TrendingDown } from 'lucide-react';

export default function Inventory() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient, addStockMovement, applyStockMovement } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingredient | null>(null);
  const [showAdjust, setShowAdjust] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'receipt' | 'consumption' | 'adjustment' | 'waste'>('receipt');

  const categories = [...new Set(ingredients.map(i => i.category))];
  const filtered = ingredients.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'all' || i.category === filterCategory;
    return matchSearch && matchCat;
  });

  const lowStock = ingredients.filter(i => i.currentStock <= i.minStock);
  const totalValue = ingredients.reduce((sum, i) => sum + (i.currentStock / (i.purchaseQuantity || 1)) * i.purchasePrice, 0);

  const handleSave = (data: Partial<Ingredient>) => {
    if (editingItem) {
      updateIngredient(editingItem.id, data);
    } else {
      addIngredient({
        name: data.name || '', sku: data.sku || `ING-${Date.now()}`, supplier: data.supplier || '',
        purchaseUnit: (data.purchaseUnit || 'kg') as Unit, baseUnit: (data.baseUnit || 'g') as Unit,
        purchaseQuantity: data.purchaseQuantity || 1, purchasePrice: data.purchasePrice || 0,
        conversionFactor: data.conversionFactor || 1, wastePercentage: data.wastePercentage || 0,
        currentStock: data.currentStock || 0, minStock: data.minStock || 0,
        category: data.category || 'Bahan Kering', storageLocation: data.storageLocation || 'Gudang Kering',
      });
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleAdjust = (ingredientId: string) => {
    const qty = adjustType === 'consumption' || adjustType === 'waste' ? -Math.abs(adjustQty) : Math.abs(adjustQty);
    applyStockMovement(ingredientId, qty);
    addStockMovement({ ingredientId, type: adjustType, quantity: Math.abs(adjustQty), unit: 'g', reason: `${adjustType} manual` });
    setShowAdjust(null);
    setAdjustQty(0);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Inventori</h1>
          <p className="text-sm text-gray-500">Kelola stok bahan baku</p>
        </div>
        <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Tambah Bahan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card p-3">
          <p className="text-xs text-gray-500">Total Bahan</p>
          <p className="text-lg font-bold text-espresso">{ingredients.length}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-gray-500">Nilai Stok</p>
          <p className="text-lg font-bold text-espresso">{formatCurrency(totalValue)}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-gray-500">Stok Rendah</p>
          <p className={`text-lg font-bold ${lowStock.length > 0 ? 'text-soft-red' : 'text-sage'}`}>{lowStock.length}</p>
        </div>
        <div className="card p-3">
          <p className="text-xs text-gray-500">Kategori</p>
          <p className="text-lg font-bold text-espresso">{categories.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari bahan..." className="input-field pl-9" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field w-auto">
          <option value="all">Semua Kategori</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-beige">
              <tr>
                <th className="text-left p-3 font-medium text-espresso">Bahan</th>
                <th className="text-left p-3 font-medium text-espresso">SKU</th>
                <th className="text-left p-3 font-medium text-espresso">Kategori</th>
                <th className="text-right p-3 font-medium text-espresso">Stok</th>
                <th className="text-right p-3 font-medium text-espresso">Min</th>
                <th className="text-right p-3 font-medium text-espresso">Harga/unit</th>
                <th className="text-right p-3 font-medium text-espresso">Cost/base</th>
                <th className="text-center p-3 font-medium text-espresso">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ing => {
                const isLow = ing.currentStock <= ing.minStock;
                const costPerBase = getCostPerBaseUnit(ing);
                return (
                  <tr key={ing.id} className="border-t border-beige hover:bg-cream/50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isLow && <AlertTriangle size={12} className="text-soft-red" />}
                        <span className="font-medium text-espresso">{ing.name}</span>
                      </div>
                      <span className="text-gray-400">{ing.supplier}</span>
                    </td>
                    <td className="p-3 text-gray-500">{ing.sku}</td>
                    <td className="p-3"><span className="badge bg-beige text-espresso">{ing.category}</span></td>
                    <td className={`p-3 text-right font-medium ${isLow ? 'text-soft-red' : 'text-espresso'}`}>{ing.currentStock} {ing.baseUnit}</td>
                    <td className="p-3 text-right text-gray-500">{ing.minStock} {ing.baseUnit}</td>
                    <td className="p-3 text-right">{formatCurrency(ing.purchasePrice)}/{ing.purchaseUnit}</td>
                    <td className="p-3 text-right text-burnt-orange">{formatCurrency(costPerBase)}/{ing.baseUnit}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setShowAdjust(ing.id)} className="p-1 rounded hover:bg-beige" title="Adjust stok"><Package size={12} /></button>
                        <button onClick={() => { setEditingItem(ing); setShowForm(true); }} className="p-1 rounded hover:bg-beige text-gray-500">Edit</button>
                        <button onClick={() => { if(confirm('Hapus bahan?')) deleteIngredient(ing.id); }} className="p-1 rounded hover:bg-soft-red/10 text-soft-red">
                          <X size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-4">
            <h3 className="font-bold text-espresso mb-3">Adjust Stok</h3>
            <p className="text-xs text-gray-500 mb-3">{ingredients.find(i => i.id === showAdjust)?.name}</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tipe</label>
                <select value={adjustType} onChange={e => setAdjustType(e.target.value as any)} className="input-field">
                  <option value="receipt">Penerimaan (Tambah)</option>
                  <option value="consumption">Konsumsi (Kurang)</option>
                  <option value="adjustment">Penyesuaian</option>
                  <option value="waste">Buang (Kurang)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Jumlah (g)</label>
                <input type="number" value={adjustQty} onChange={e => setAdjustQty(Number(e.target.value))} className="input-field" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAdjust(null)} className="btn-secondary text-xs">Batal</button>
                <button onClick={() => handleAdjust(showAdjust)} className="btn-primary text-xs">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && <IngredientForm ingredient={editingItem} onSave={handleSave} onClose={() => { setShowForm(false); setEditingItem(null); }} />}
    </div>
  );
}

function IngredientForm({ ingredient, onSave, onClose }: { ingredient: Ingredient | null; onSave: (d: Partial<Ingredient>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: ingredient?.name || '', sku: ingredient?.sku || '', supplier: ingredient?.supplier || '',
    purchaseUnit: (ingredient?.purchaseUnit || 'kg') as Unit, baseUnit: (ingredient?.baseUnit || 'g') as Unit,
    purchaseQuantity: ingredient?.purchaseQuantity || 1, purchasePrice: ingredient?.purchasePrice || 0,
    wastePercentage: ingredient?.wastePercentage || 0, currentStock: ingredient?.currentStock || 0,
    minStock: ingredient?.minStock || 0, category: ingredient?.category || 'Bahan Kering',
    storageLocation: ingredient?.storageLocation || 'Gudang Kering',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, purchaseQuantity: Number(form.purchaseQuantity), purchasePrice: Number(form.purchasePrice), wastePercentage: Number(form.wastePercentage), currentStock: Number(form.currentStock), minStock: Number(form.minStock) } as Partial<Ingredient>);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-beige">
          <h2 className="font-bold text-espresso">{ingredient ? 'Edit Bahan' : 'Tambah Bahan Baru'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Nama *</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">SKU</label><input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Supplier</label><input value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Kategori</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Unit Beli</label>
              <select value={form.purchaseUnit} onChange={e => setForm({...form, purchaseUnit: e.target.value as Unit})} className="input-field">
                {Object.entries(UNIT_LABELS).map(([k]) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Unit Dasar</label>
              <select value={form.baseUnit} onChange={e => setForm({...form, baseUnit: e.target.value as Unit})} className="input-field">
                {Object.entries(UNIT_LABELS).map(([k]) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Qty Beli</label><input type="number" step="0.01" value={form.purchaseQuantity} onChange={e => setForm({...form, purchaseQuantity: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Harga Beli (Rp)</label><input type="number" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Waste %</label><input type="number" value={form.wastePercentage} onChange={e => setForm({...form, wastePercentage: Number(e.target.value)})} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Stok Saat Ini</label><input type="number" value={form.currentStock} onChange={e => setForm({...form, currentStock: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Stok Minimum</label><input type="number" value={form.minStock} onChange={e => setForm({...form, minStock: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Lokasi</label><input value={form.storageLocation} onChange={e => setForm({...form, storageLocation: e.target.value})} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-beige">
            <button type="button" onClick={onClose} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
