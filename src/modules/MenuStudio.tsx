import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { MenuItem, MenuCategory, CATEGORY_LABELS } from '../domain/models';
import { formatCurrency } from '../domain/calculations';
import { Plus, Search, Edit, Trash2, Copy, Eye, X, Filter } from 'lucide-react';

export default function MenuStudio() {
  const { menuItems, recipes, addMenuItem, updateMenuItem, deleteMenuItem, duplicateMenuItem } = useAppStore();
  const [viewMode, setViewMode] = useState<'admin' | 'customer'>('admin');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = menuItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleSave = (data: Partial<MenuItem>) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, data);
    } else {
      addMenuItem({
        name: data.name || '', sku: data.sku || `MNU-${Date.now()}`, category: (data.category || 'coffee') as MenuCategory,
        description: data.description || '', sellingPrice: data.sellingPrice || 0, servingSize: data.servingSize || '',
        estimatedPrepTime: data.estimatedPrepTime || 0, allergens: data.allergens || [], dietaryLabels: data.dietaryLabels || [],
        isActive: data.isActive !== undefined ? data.isActive : true, internalNotes: data.internalNotes || '',
        recipeId: data.recipeId, sopId: data.sopId,
      });
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus item menu ini?')) deleteMenuItem(id);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Menu Studio</h1>
          <p className="text-sm text-gray-500">Kelola menu kafe dan restoran Anda</p>
        </div>
        <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Tambah Menu
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari menu..." className="input-field pl-9" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="input-field w-auto">
          <option value="all">Semua Kategori</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <div className="flex gap-1 bg-beige rounded-lg p-1">
          <button onClick={() => setViewMode('admin')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'admin' ? 'bg-white shadow text-espresso' : 'text-gray-500'}`}>Admin</button>
          <button onClick={() => setViewMode('customer')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${viewMode === 'customer' ? 'bg-white shadow text-espresso' : 'text-gray-500'}`}>Preview</button>
        </div>
      </div>

      {/* Admin Grid View */}
      {viewMode === 'admin' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => {
            const recipe = recipes.find(r => r.id === item.recipeId);
            return (
              <div key={item.id} className="card p-4 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-espresso text-sm">{item.name}</h3>
                    <span className="badge bg-beige text-espresso text-xs mt-1">{CATEGORY_LABELS[item.category]}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingItem(item); setShowForm(true); }} className="p-1.5 rounded hover:bg-beige"><Edit size={14} className="text-gray-400" /></button>
                    <button onClick={() => duplicateMenuItem(item.id)} className="p-1.5 rounded hover:bg-beige"><Copy size={14} className="text-gray-400" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-soft-red/10"><Trash2 size={14} className="text-soft-red" /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-burnt-orange">{formatCurrency(item.sellingPrice)}</span>
                  <span className="text-gray-400">{item.estimatedPrepTime} menit</span>
                </div>
                {recipe && (
                  <div className="mt-2 pt-2 border-t border-beige text-xs text-gray-400">
                    Resep: {recipe.name} • {recipe.ingredients.length} bahan
                  </div>
                )}
                {!item.isActive && <span className="badge bg-gray-100 text-gray-500 mt-2">Nonaktif</span>}
              </div>
            );
          })}
        </div>
      ) : (
        /* Customer Preview */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.filter(m => m.isActive).map(item => (
            <div key={item.id} className="card overflow-hidden card-hover">
              <div className="h-32 bg-gradient-to-br from-burnt-orange/10 to-sage/10 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-espresso">{item.name}</h3>
                  <span className="font-bold text-burnt-orange text-sm">{formatCurrency(item.sellingPrice)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                {item.allergens.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.allergens.map(a => <span key={a} className="badge bg-soft-red/10 text-soft-red text-xs">{a}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm">Tidak ada item menu ditemukan</p>
          <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn-primary mt-3 text-xs">Tambah Menu Pertama</button>
        </div>
      )}

      {/* Edit Form Modal */}
      {showForm && (
        <MenuItemForm 
          item={editingItem} 
          recipes={recipes}
          onSave={handleSave} 
          onClose={() => { setShowForm(false); setEditingItem(null); }} 
        />
      )}
    </div>
  );
}

function MenuItemForm({ item, recipes, onSave, onClose }: { item: MenuItem | null; recipes: any[]; onSave: (d: Partial<MenuItem>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: item?.name || '', sku: item?.sku || '', category: item?.category || 'coffee' as MenuCategory,
    description: item?.description || '', sellingPrice: item?.sellingPrice || 0, servingSize: item?.servingSize || '',
    estimatedPrepTime: item?.estimatedPrepTime || 0, recipeId: item?.recipeId || '',
    allergens: item?.allergens?.join(', ') || '', dietaryLabels: item?.dietaryLabels?.join(', ') || '',
    isActive: item?.isActive ?? true, internalNotes: item?.internalNotes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      sellingPrice: Number(form.sellingPrice),
      estimatedPrepTime: Number(form.estimatedPrepTime),
      allergens: form.allergens.split(',').map(s => s.trim()).filter(Boolean),
      dietaryLabels: form.dietaryLabels.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-beige">
          <h2 className="font-bold text-espresso">{item ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Nama *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">SKU</label>
              <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value as MenuCategory})} className="input-field">
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Resep</label>
              <select value={form.recipeId} onChange={e => setForm({...form, recipeId: e.target.value})} className="input-field">
                <option value="">-- Pilih Resep --</option>
                {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Harga Jual (Rp)</label>
              <input type="number" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: Number(e.target.value)})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Ukuran Saji</label>
              <input value={form.servingSize} onChange={e => setForm({...form, servingSize: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Waktu Prep (menit)</label>
              <input type="number" value={form.estimatedPrepTime} onChange={e => setForm({...form, estimatedPrepTime: Number(e.target.value)})} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Alergen (pisahkan koma)</label>
              <input value={form.allergens} onChange={e => setForm({...form, allergens: e.target.value})} className="input-field" placeholder="Dairy, Gluten" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Label Diet (pisahkan koma)</label>
              <input value={form.dietaryLabels} onChange={e => setForm({...form, dietaryLabels: e.target.value})} className="input-field" placeholder="Vegan, Vegetarian" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} id="active" />
            <label htmlFor="active" className="text-xs text-gray-600">Aktif</label>
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
