import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { Recipe, RecipeIngredient, Unit, UNIT_LABELS } from '../domain/models';
import { calculateRecipeCosting, formatCurrency, scaleRecipe } from '../domain/calculations';
import { Plus, X, Edit, Trash2, Scale, Beaker } from 'lucide-react';

export default function RecipeLab() {
  const { recipes, ingredients, menuItems, addRecipe, updateRecipe, deleteRecipe } = useAppStore();
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const selected = recipes.find(r => r.id === selectedRecipe);
  const scaledRecipe = selected ? scaleRecipe(selected, selected.yield * scaleFactor) : null;
  const costing = scaledRecipe ? calculateRecipeCosting(scaledRecipe, ingredients) : null;

  const handleSave = (data: Partial<Recipe>) => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id, data);
    } else {
      addRecipe({
        name: data.name || '', ingredients: data.ingredients || [], instructions: data.instructions || [],
        yield: data.yield || 1, servingSize: data.servingSize || '', prepTime: data.prepTime || 0,
        equipment: data.equipment || [], temperatures: data.temperatures || [], menuItemId: data.menuItemId,
      });
    }
    setShowForm(false);
    setEditingRecipe(null);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Recipe Lab</h1>
          <p className="text-sm text-gray-500">Kembangkan dan kelola resep Anda</p>
        </div>
        <button onClick={() => { setEditingRecipe(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Buat Resep
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recipe List */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Daftar Resep ({recipes.length})</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {recipes.map(r => {
              const menuItem = menuItems.find(m => m.recipeId === r.id);
              const cost = calculateRecipeCosting(r, ingredients);
              return (
                <div key={r.id} onClick={() => setSelectedRecipe(r.id)} className={`p-3 rounded-lg cursor-pointer transition ${selectedRecipe === r.id ? 'bg-burnt-orange/10 border border-burnt-orange/20' : 'hover:bg-beige'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-espresso">{r.name}</span>
                    <span className="text-xs text-burnt-orange font-medium">{formatCurrency(cost.costPerServing)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{r.ingredients.length} bahan</span>
                    <span>•</span>
                    <span>{r.prepTime} mnt</span>
                    {menuItem && <><span>•</span><span className="text-sage">{menuItem.name}</span></>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recipe Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-espresso">{selected.name}</h2>
                  <p className="text-xs text-gray-500">Versi {selected.version} • Yield: {selected.yield} porsi • {selected.servingSize}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingRecipe(selected); setShowForm(true); }} className="btn-secondary text-xs flex items-center gap-1"><Edit size={12} /> Edit</button>
                  <button onClick={() => { if(confirm('Hapus resep?')) deleteRecipe(selected.id); }} className="btn-danger text-xs flex items-center gap-1"><Trash2 size={12} /></button>
                </div>
              </div>

              {/* Scale Control */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-beige rounded-lg">
                <Scale size={16} className="text-espresso" />
                <span className="text-xs font-medium text-espresso">Skala:</span>
                {[1, 5, 10, 25, 50, 100].map(s => (
                  <button key={s} onClick={() => setScaleFactor(s)} className={`px-2 py-1 rounded text-xs ${scaleFactor === s ? 'bg-burnt-orange text-white' : 'bg-white text-gray-600'}`}>{s}x</button>
                ))}
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-espresso mb-2">Bahan-bahan</h3>
                <div className="space-y-1">
                  {(scaledRecipe?.ingredients || []).map((ri, i) => {
                    const ing = ingredients.find(ing => ing.id === ri.ingredientId);
                    const cost = costing?.ingredientCosts[i];
                    return (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-cream">
                        <span className="text-gray-700">{ing?.name || 'Unknown'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{ri.quantity.toFixed(1)} {ri.unit}</span>
                          <span className="text-burnt-orange font-medium w-20 text-right">{cost ? formatCurrency(cost.cost) : '-'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Costing Summary */}
              {costing && (
                <div className="p-3 bg-sage/5 border border-sage/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-espresso mb-2">Ringkasan Costing</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-gray-500">Total Biaya</span><p className="font-bold text-espresso">{formatCurrency(costing.totalCost)}</p></div>
                    <div><span className="text-gray-500">Per Porsi</span><p className="font-bold text-espresso">{formatCurrency(costing.costPerServing)}</p></div>
                    <div><span className="text-gray-500">Yield</span><p className="font-bold text-espresso">{scaledRecipe?.yield} porsi</p></div>
                    <div><span className="text-gray-500">Waktu Prep</span><p className="font-bold text-espresso">{selected.prepTime} menit</p></div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-espresso mb-2">Instruksi</h3>
                <ol className="space-y-1">
                  {selected.instructions.map((inst, i) => (
                    <li key={i} className="text-xs text-gray-600 flex gap-2"><span className="text-burnt-orange font-medium">{i+1}.</span>{inst}</li>
                  ))}
                </ol>
              </div>

              {/* Equipment */}
              {selected.equipment.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-espresso mb-2">Peralatan</h3>
                  <div className="flex flex-wrap gap-1">
                    {selected.equipment.map((eq, i) => <span key={i} className="badge bg-beige text-espresso text-xs">{eq}</span>)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Beaker size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">Pilih resep untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>

      {showForm && <RecipeForm recipe={editingRecipe} ingredients={ingredients} menuItems={menuItems} onSave={handleSave} onClose={() => { setShowForm(false); setEditingRecipe(null); }} />}
    </div>
  );
}

function RecipeForm({ recipe, ingredients, menuItems, onSave, onClose }: { recipe: Recipe | null; ingredients: any[]; menuItems: any[]; onSave: (d: Partial<Recipe>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: recipe?.name || '', yield: recipe?.yield || 1, servingSize: recipe?.servingSize || '',
    prepTime: recipe?.prepTime || 0, menuItemId: recipe?.menuItemId || '',
    ingredients: recipe?.ingredients || [] as RecipeIngredient[],
    instructions: recipe?.instructions || [] as string[],
    equipment: recipe?.equipment?.join(', ') || '',
  });

  const addIngredient = () => setForm({ ...form, ingredients: [...form.ingredients, { ingredientId: '', quantity: 0, unit: 'g' as Unit }] });
  const updateIng = (i: number, data: Partial<RecipeIngredient>) => {
    const updated = [...form.ingredients];
    updated[i] = { ...updated[i], ...data };
    setForm({ ...form, ingredients: updated });
  };
  const removeIng = (i: number) => setForm({ ...form, ingredients: form.ingredients.filter((_, idx) => idx !== i) });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      yield: Number(form.yield),
      prepTime: Number(form.prepTime),
      equipment: form.equipment.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-beige">
          <h2 className="font-bold text-espresso">{recipe ? 'Edit Resep' : 'Buat Resep Baru'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Nama Resep *</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Menu Terkait</label>
              <select value={form.menuItemId} onChange={e => setForm({...form, menuItemId: e.target.value})} className="input-field">
                <option value="">-- Tidak ada --</option>
                {menuItems.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Yield (porsi)</label><input type="number" min="1" value={form.yield} onChange={e => setForm({...form, yield: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Ukuran Saji</label><input value={form.servingSize} onChange={e => setForm({...form, servingSize: e.target.value})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Waktu Prep (mnt)</label><input type="number" value={form.prepTime} onChange={e => setForm({...form, prepTime: Number(e.target.value)})} className="input-field" /></div>
          </div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Peralatan (pisah koma)</label><input value={form.equipment} onChange={e => setForm({...form, equipment: e.target.value})} className="input-field" /></div>
          
          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">Bahan-bahan</label>
              <button type="button" onClick={addIngredient} className="text-xs text-burnt-orange flex items-center gap-1"><Plus size={12} /> Tambah</button>
            </div>
            <div className="space-y-2">
              {form.ingredients.map((ri, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select value={ri.ingredientId} onChange={e => updateIng(i, { ingredientId: e.target.value })} className="input-field flex-1">
                    <option value="">Pilih bahan</option>
                    {ingredients.map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)}
                  </select>
                  <input type="number" step="0.1" value={ri.quantity} onChange={e => updateIng(i, { quantity: Number(e.target.value) })} className="input-field w-20" />
                  <select value={ri.unit} onChange={e => updateIng(i, { unit: e.target.value as Unit })} className="input-field w-20">
                    {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <button type="button" onClick={() => removeIng(i)} className="p-1 text-soft-red"><X size={14} /></button>
                </div>
              ))}
            </div>
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
