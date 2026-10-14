import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { KitchenEquipment } from '../domain/models';
import { Plus, Trash2, Move, RotateCw, Save } from 'lucide-react';

const STATIONS = [
  { id: 'espresso-bar', name: 'Espresso Bar', color: '#E07A3A' },
  { id: 'beverage-station', name: 'Beverage Station', color: '#5B8FA8' },
  { id: 'cold-kitchen', name: 'Cold Kitchen', color: '#7BA05B' },
  { id: 'hot-kitchen', name: 'Hot Kitchen', color: '#D4605A' },
  { id: 'bakery', name: 'Bakery', color: '#E8B84B' },
  { id: 'plating', name: 'Plating', color: '#9BC07B' },
  { id: 'dishwashing', name: 'Dishwashing', color: '#888' },
  { id: 'storage', name: 'Storage', color: '#A89888' },
];

const EQUIPMENT_TYPES = [
  { type: 'espresso-machine', name: 'Espresso Machine', w: 0.8, d: 0.5 },
  { type: 'grinder', name: 'Grinder', w: 0.3, d: 0.3 },
  { type: 'refrigerator', name: 'Kulkas', w: 0.7, d: 0.7 },
  { type: 'prep-table', name: 'Prep Table', w: 1.5, d: 0.7 },
  { type: 'stove', name: 'Kompor', w: 0.7, d: 0.6 },
  { type: 'grill', name: 'Grill', w: 0.8, d: 0.6 },
  { type: 'oven', name: 'Oven', w: 0.7, d: 0.7 },
  { type: 'blender', name: 'Blender', w: 0.25, d: 0.25 },
  { type: 'sink', name: 'Sink', w: 0.6, d: 0.5 },
  { type: 'freezer', name: 'Freezer', w: 0.7, d: 0.7 },
];

export default function KitchenDesigner() {
  const { kitchenLayout, updateKitchenLayout } = useAppStore();
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [gridSize] = useState(0.5);

  const scale = 60; // px per meter

  const handleAddEquipment = (type: string) => {
    const template = EQUIPMENT_TYPES.find(t => t.type === type);
    if (!template) return;
    const newEq: KitchenEquipment = {
      id: `eq-${Date.now()}`, name: template.name, type: template.type,
      width: template.w, depth: template.d, height: 0.9,
      positionX: 2, positionY: 2, rotation: 0, station: 'espresso-bar',
    };
    updateKitchenLayout({ equipment: [...kitchenLayout.equipment, newEq] });
  };

  const handleMoveEquipment = (id: string, dx: number, dy: number) => {
    const updated = kitchenLayout.equipment.map(eq => {
      if (eq.id !== id) return eq;
      return { ...eq, positionX: eq.positionX + dx * gridSize, positionY: eq.positionY + dy * gridSize };
    });
    updateKitchenLayout({ equipment: updated });
  };

  const handleRotateEquipment = (id: string) => {
    const updated = kitchenLayout.equipment.map(eq => {
      if (eq.id !== id) return eq;
      return { ...eq, rotation: (eq.rotation + 90) % 360 };
    });
    updateKitchenLayout({ equipment: updated });
  };

  const handleDeleteEquipment = (id: string) => {
    updateKitchenLayout({ equipment: kitchenLayout.equipment.filter(eq => eq.id !== id) });
    setSelectedEquipment(null);
  };

  const updateStation = (id: string, station: string) => {
    const updated = kitchenLayout.equipment.map(eq => eq.id === id ? { ...eq, station } : eq);
    updateKitchenLayout({ equipment: updated });
  };

  const selected = kitchenLayout.equipment.find(eq => eq.id === selectedEquipment);

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Kitchen Designer</h1>
          <p className="text-sm text-gray-500">Desain tata letak dapur kafe Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Equipment Palette */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Tambah Peralatan</h3>
          <div className="space-y-1">
            {EQUIPMENT_TYPES.map(et => (
              <button key={et.type} onClick={() => handleAddEquipment(et.type)} className="w-full text-left text-xs p-2 rounded hover:bg-beige transition flex items-center justify-between">
                <span>{et.name}</span>
                <Plus size={12} className="text-gray-400" />
              </button>
            ))}
          </div>
          
          <h3 className="font-semibold text-espresso text-sm mt-4 mb-2">Stasiun Kerja</h3>
          <div className="space-y-1">
            {STATIONS.map(s => (
              <div key={s.id} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: s.color }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 card p-4 overflow-auto">
          <div className="relative border-2 border-dashed border-beige rounded-lg" style={{ width: kitchenLayout.width * scale, height: kitchenLayout.height * scale, minWidth: '400px', minHeight: '300px' }}>
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {Array.from({ length: Math.ceil(kitchenLayout.width / gridSize) + 1 }).map((_, i) => (
                <line key={`v${i}`} x1={i * gridSize * scale} y1={0} x2={i * gridSize * scale} y2={kitchenLayout.height * scale} stroke="#ccc" strokeWidth={0.5} />
              ))}
              {Array.from({ length: Math.ceil(kitchenLayout.height / gridSize) + 1 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={i * gridSize * scale} x2={kitchenLayout.width * scale} y2={i * gridSize * scale} stroke="#ccc" strokeWidth={0.5} />
              ))}
            </svg>

            {/* Equipment */}
            {kitchenLayout.equipment.map(eq => {
              const station = STATIONS.find(s => s.id === eq.station);
              const isSelected = selectedEquipment === eq.id;
              return (
                <div
                  key={eq.id}
                  onClick={() => setSelectedEquipment(eq.id)}
                  className={`absolute cursor-pointer rounded transition-all ${isSelected ? 'ring-2 ring-burnt-orange' : 'hover:ring-1 hover:ring-burnt-orange/30'}`}
                  style={{
                    left: eq.positionX * scale,
                    top: eq.positionY * scale,
                    width: eq.width * scale,
                    height: eq.depth * scale,
                    backgroundColor: station?.color || '#ccc',
                    opacity: 0.8,
                    transform: `rotate(${eq.rotation}deg)`,
                  }}
                >
                  <span className="text-white text-[8px] font-medium p-1 truncate block">{eq.name}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {kitchenLayout.width}m × {kitchenLayout.height}m • Grid: {gridSize}m
          </div>
        </div>

        {/* Inspector */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Inspector</h3>
          {selected ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama</label>
                <input value={selected.name} onChange={e => {
                  const updated = kitchenLayout.equipment.map(eq => eq.id === selected.id ? { ...eq, name: e.target.value } : eq);
                  updateKitchenLayout({ equipment: updated });
                }} className="input-field text-xs" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Stasiun</label>
                <select value={selected.station} onChange={e => updateStation(selected.id, e.target.value)} className="input-field text-xs">
                  {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-gray-600">X (m)</label><input type="number" step="0.5" value={selected.positionX} onChange={e => { const u = kitchenLayout.equipment.map(eq => eq.id === selected.id ? { ...eq, positionX: Number(e.target.value) } : eq); updateKitchenLayout({ equipment: u }); }} className="input-field text-xs" /></div>
                <div><label className="text-xs text-gray-600">Y (m)</label><input type="number" step="0.5" value={selected.positionY} onChange={e => { const u = kitchenLayout.equipment.map(eq => eq.id === selected.id ? { ...eq, positionY: Number(e.target.value) } : eq); updateKitchenLayout({ equipment: u }); }} className="input-field text-xs" /></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleMoveEquipment(selected.id, -1, 0)} className="btn-secondary text-xs">←</button>
                <button onClick={() => handleMoveEquipment(selected.id, 1, 0)} className="btn-secondary text-xs">→</button>
                <button onClick={() => handleMoveEquipment(selected.id, 0, -1)} className="btn-secondary text-xs">↑</button>
                <button onClick={() => handleMoveEquipment(selected.id, 0, 1)} className="btn-secondary text-xs">↓</button>
                <button onClick={() => handleRotateEquipment(selected.id)} className="btn-secondary text-xs"><RotateCw size={12} /></button>
              </div>
              <button onClick={() => handleDeleteEquipment(selected.id)} className="btn-danger w-full text-xs flex items-center justify-center gap-1"><Trash2 size={12} /> Hapus</button>
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">Pilih peralatan untuk mengedit</p>
          )}
        </div>
      </div>
    </div>
  );
}
