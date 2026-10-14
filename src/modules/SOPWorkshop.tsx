import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { SOP, SOPStep, SOPStatus, RecipeIngredient, Unit, UNIT_LABELS } from '../domain/models';
import { Plus, X, Edit, Trash2, Play, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SOPWorkshop() {
  const { sops, recipes, menuItems, ingredients, addSOP, updateSOP, deleteSOP } = useAppStore();
  const [selectedSOP, setSelectedSOP] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);
  const navigate = useNavigate();

  const selected = sops.find(s => s.id === selectedSOP);

  const statusColors: Record<SOPStatus, string> = {
    draft: 'bg-gray-100 text-gray-600',
    review: 'bg-warning-yellow/20 text-warning-yellow',
    approved: 'bg-sage/20 text-sage',
    archived: 'bg-soft-red/10 text-soft-red',
  };

  const statusLabels: Record<SOPStatus, string> = {
    draft: 'Draft', review: 'Review', approved: 'Disetujui', archived: 'Arsip',
  };

  const handleSave = (data: Partial<SOP>) => {
    if (editingSOP) {
      updateSOP(editingSOP.id, data);
    } else {
      addSOP({
        title: data.title || '', category: data.category || 'general', objective: data.objective || '',
        scope: data.scope || '', responsibleRole: data.responsibleRole || '',
        requiredEquipment: data.requiredEquipment || [], requiredIngredients: data.requiredIngredients || [],
        prepTime: data.prepTime || 0, steps: data.steps || [],
        menuItemId: data.menuItemId, recipeId: data.recipeId,
        status: (data.status || 'draft') as SOPStatus,
      });
    }
    setShowForm(false);
    setEditingSOP(null);
  };

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-espresso">SOP Workshop</h1>
          <p className="text-sm text-gray-500">Buat dan kelola Standard Operating Procedures</p>
        </div>
        <button onClick={() => { setEditingSOP(null); setShowForm(true); }} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} /> Buat SOP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SOP List */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Daftar SOP ({sops.length})</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {sops.map(sop => (
              <div key={sop.id} onClick={() => setSelectedSOP(sop.id)} className={`p-3 rounded-lg cursor-pointer transition ${selectedSOP === sop.id ? 'bg-burnt-orange/10 border border-burnt-orange/20' : 'hover:bg-beige'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-espresso">{sop.title}</span>
                  <span className={`badge text-xs ${statusColors[sop.status]}`}>{statusLabels[sop.status]}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{sop.steps.length} langkah</span>
                  <span>•</span>
                  <span>{sop.prepTime} mnt</span>
                  <span>•</span>
                  <span>Rev {sop.revision}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOP Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-espresso">{selected.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge text-xs ${statusColors[selected.status]}`}>{statusLabels[selected.status]}</span>
                    <span className="text-xs text-gray-400">Rev {selected.revision} • {selected.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/simulation?sop=${selected.id}`)} className="btn-primary text-xs flex items-center gap-1"><Play size={12} /> Simulasi</button>
                  <button onClick={() => { setEditingSOP(selected); setShowForm(true); }} className="btn-secondary text-xs flex items-center gap-1"><Edit size={12} /> Edit</button>
                  <button onClick={() => { if(confirm('Hapus SOP?')) deleteSOP(selected.id); }} className="btn-danger text-xs"><Trash2 size={12} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="p-2 bg-cream rounded"><span className="text-gray-500">Tujuan:</span> <span className="text-espresso">{selected.objective}</span></div>
                <div className="p-2 bg-cream rounded"><span className="text-gray-500">Penanggung Jawab:</span> <span className="text-espresso">{selected.responsibleRole}</span></div>
                <div className="p-2 bg-cream rounded"><span className="text-gray-500">Waktu:</span> <span className="text-espresso">{selected.prepTime} menit</span></div>
                <div className="p-2 bg-cream rounded"><span className="text-gray-500">Peralatan:</span> <span className="text-espresso">{selected.requiredEquipment.join(', ')}</span></div>
              </div>

              {/* Steps */}
              <h3 className="text-sm font-semibold text-espresso mb-3">Langkah-langkah</h3>
              <div className="space-y-3">
                {selected.steps.map((step, i) => (
                  <div key={step.id} className="p-3 rounded-lg border border-beige bg-cream/50">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-burnt-orange text-white flex items-center justify-center text-xs font-bold shrink-0">{step.stepNumber}</div>
                      <div className="flex-1">
                        <p className="text-sm text-espresso">{step.instruction}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {step.timerDuration && step.timerDuration > 0 && (
                            <span className="badge bg-soft-blue/10 text-soft-blue text-xs flex items-center gap-1"><Clock size={10} /> {step.timerDuration}s</span>
                          )}
                          {step.temperature && (
                            <span className="badge bg-warning-yellow/10 text-warning-yellow text-xs">🌡️ {step.temperature}</span>
                          )}
                          {step.qualityCheckpoint && (
                            <span className="badge bg-sage/10 text-sage text-xs flex items-center gap-1"><CheckCircle size={10} /> {step.qualityCheckpoint}</span>
                          )}
                          {step.warning && (
                            <span className="badge bg-soft-red/10 text-soft-red text-xs flex items-center gap-1"><AlertTriangle size={10} /> {step.warning}</span>
                          )}
                          {step.isOptional && <span className="badge bg-gray-100 text-gray-500 text-xs">Opsional</span>}
                        </div>
                        {step.requiredIngredients.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {step.requiredIngredients.map((ri, j) => {
                              const ing = ingredients.find(ing => ing.id === ri.ingredientId);
                              return <span key={j} className="text-xs bg-white px-2 py-0.5 rounded border border-beige">{ing?.name}: {ri.quantity} {ri.unit}</span>;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Clock size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">Pilih SOP untuk melihat detail</p>
            </div>
          )}
        </div>
      </div>

      {showForm && <SOPForm sop={editingSOP} recipes={recipes} menuItems={menuItems} onSave={handleSave} onClose={() => { setShowForm(false); setEditingSOP(null); }} />}
    </div>
  );
}

function SOPForm({ sop, recipes, menuItems, onSave, onClose }: { sop: SOP | null; recipes: any[]; menuItems: any[]; onSave: (d: Partial<SOP>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: sop?.title || '', category: sop?.category || 'general', objective: sop?.objective || '',
    scope: sop?.scope || '', responsibleRole: sop?.responsibleRole || 'Barista',
    prepTime: sop?.prepTime || 0, menuItemId: sop?.menuItemId || '', recipeId: sop?.recipeId || '',
    status: sop?.status || 'draft' as SOPStatus,
    steps: sop?.steps || [] as SOPStep[],
  });

  const addStep = () => {
    const newStep: SOPStep = {
      id: `step-${Date.now()}`, stepNumber: form.steps.length + 1, instruction: '',
      requiredIngredients: [], equipment: [], isOptional: false,
    };
    setForm({ ...form, steps: [...form.steps, newStep] });
  };

  const updateStep = (i: number, data: Partial<SOPStep>) => {
    const updated = [...form.steps];
    updated[i] = { ...updated[i], ...data };
    setForm({ ...form, steps: updated });
  };

  const removeStep = (i: number) => setForm({ ...form, steps: form.steps.filter((_, idx) => idx !== i) });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, prepTime: Number(form.prepTime) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-beige">
          <h2 className="font-bold text-espresso">{sop ? 'Edit SOP' : 'Buat SOP Baru'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Judul SOP *</label><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Kategori</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Menu Terkait</label>
              <select value={form.menuItemId} onChange={e => setForm({...form, menuItemId: e.target.value})} className="input-field">
                <option value="">-- Pilih --</option>
                {menuItems.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Resep Terkait</label>
              <select value={form.recipeId} onChange={e => setForm({...form, recipeId: e.target.value})} className="input-field">
                <option value="">-- Pilih --</option>
                {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Penanggung Jawab</label><input value={form.responsibleRole} onChange={e => setForm({...form, responsibleRole: e.target.value})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Waktu (menit)</label><input type="number" value={form.prepTime} onChange={e => setForm({...form, prepTime: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as SOPStatus})} className="input-field">
                <option value="draft">Draft</option><option value="review">Review</option><option value="approved">Disetujui</option>
              </select>
            </div>
          </div>
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">Tujuan</label><textarea value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} className="input-field" rows={2} /></div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">Langkah-langkah</label>
              <button type="button" onClick={addStep} className="text-xs text-burnt-orange flex items-center gap-1"><Plus size={12} /> Tambah Langkah</button>
            </div>
            <div className="space-y-2">
              {form.steps.map((step, i) => (
                <div key={i} className="p-3 bg-cream rounded-lg border border-beige">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-burnt-orange text-white text-xs flex items-center justify-center">{i+1}</span>
                    <input value={step.instruction} onChange={e => updateStep(i, { instruction: e.target.value })} placeholder="Instruksi langkah..." className="input-field flex-1 text-xs" />
                    <button type="button" onClick={() => removeStep(i)} className="text-soft-red"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Timer (detik)" value={step.timerDuration || ''} onChange={e => updateStep(i, { timerDuration: Number(e.target.value) || undefined })} className="input-field text-xs" />
                    <input placeholder="Suhu" value={step.temperature || ''} onChange={e => updateStep(i, { temperature: e.target.value })} className="input-field text-xs" />
                    <input placeholder="Quality Check" value={step.qualityCheckpoint || ''} onChange={e => updateStep(i, { qualityCheckpoint: e.target.value })} className="input-field text-xs" />
                  </div>
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
