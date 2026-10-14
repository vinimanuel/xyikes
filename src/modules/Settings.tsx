import React, { useState } from 'react';
import { useAppStore } from '../stores';
import { RotateCcw, Database, Monitor, Info } from 'lucide-react';

export default function SettingsPage() {
  const { demoMode, setDemoMode, resetToDemo, menuItems, recipes, ingredients, sops, simulations } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetToDemo();
    setShowResetConfirm(false);
  };

  const stats = {
    menuItems: menuItems.length,
    recipes: recipes.length,
    ingredients: ingredients.length,
    sops: sops.length,
    simulations: simulations.length,
  };

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-espresso">Pengaturan</h1>
        <p className="text-sm text-gray-500">Konfigurasi aplikasi dan data</p>
      </div>

      <div className="space-y-4">
        {/* Demo Mode */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor size={20} className="text-burnt-orange" />
              <div>
                <h3 className="font-semibold text-espresso text-sm">Mode Demo</h3>
                <p className="text-xs text-gray-500">Data disimpan secara lokal di browser. Tidak disinkronkan ke server.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={demoMode} onChange={e => setDemoMode(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-burnt-orange"></div>
            </label>
          </div>
        </div>

        {/* Data Stats */}
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Database size={20} className="text-soft-blue" />
            <h3 className="font-semibold text-espresso text-sm">Statistik Data</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-2 bg-cream rounded text-center">
              <p className="text-lg font-bold text-espresso">{stats.menuItems}</p>
              <p className="text-xs text-gray-500">Menu</p>
            </div>
            <div className="p-2 bg-cream rounded text-center">
              <p className="text-lg font-bold text-espresso">{stats.recipes}</p>
              <p className="text-xs text-gray-500">Resep</p>
            </div>
            <div className="p-2 bg-cream rounded text-center">
              <p className="text-lg font-bold text-espresso">{stats.ingredients}</p>
              <p className="text-xs text-gray-500">Bahan</p>
            </div>
            <div className="p-2 bg-cream rounded text-center">
              <p className="text-lg font-bold text-espresso">{stats.sops}</p>
              <p className="text-xs text-gray-500">SOP</p>
            </div>
            <div className="p-2 bg-cream rounded text-center">
              <p className="text-lg font-bold text-espresso">{stats.simulations}</p>
              <p className="text-xs text-gray-500">Simulasi</p>
            </div>
          </div>
        </div>

        {/* Reset Data */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-soft-red" />
              <div>
                <h3 className="font-semibold text-espresso text-sm">Reset Data Demo</h3>
                <p className="text-xs text-gray-500">Kembalikan semua data ke kondisi awal seed data.</p>
              </div>
            </div>
            <button onClick={() => setShowResetConfirm(true)} className="btn-danger text-xs">Reset</button>
          </div>
        </div>

        {/* About */}
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-3">
            <Info size={20} className="text-sage" />
            <h3 className="font-semibold text-espresso text-sm">Tentang GastroSim 3D</h3>
          </div>
          <div className="text-xs text-gray-600 space-y-2">
            <p>GastroSim 3D adalah platform simulasi operasi kafe dan restoran yang menggabungkan manajemen menu, pengembangan resep, SOP, costing, dan visualisasi 3D interaktif.</p>
            <p><strong>Versi:</strong> 1.0.0 (Demo)</p>
            <p><strong>Stack:</strong> React, TypeScript, Three.js, React Three Fiber, Zustand, Tailwind CSS</p>
            <p><strong>Fitur yang diimplementasikan:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Dashboard dengan metrik operasional</li>
              <li>Menu Studio (CRUD, filter, preview)</li>
              <li>Recipe Lab dengan batch scaling</li>
              <li>SOP Workshop dengan step editor</li>
              <li>Simulasi 3D interaktif dengan Three.js</li>
              <li>Kitchen Designer (2D layout)</li>
              <li>Inventory Management</li>
              <li>Costing Engine dengan price recommendation</li>
              <li>Menu Engineering Matrix</li>
              <li>Laporan & Export CSV</li>
            </ul>
            <p className="mt-2"><strong>Limitasi yang diketahui:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Data disimpan di localStorage (browser-only)</li>
              <li>Tidak ada autentikasi/otorisasi di mode demo</li>
              <li>Model 3D menggunakan procedural geometry (bukan GLB)</li>
              <li>PDF export belum diimplementasikan (gunakan Print browser)</li>
              <li>Konversi unit lintas tipe (mass↔volume) memerlukan density factor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <RotateCcw size={40} className="mx-auto text-soft-red mb-3" />
            <h3 className="font-bold text-espresso mb-2">Reset Semua Data?</h3>
            <p className="text-xs text-gray-500 mb-4">Semua data akan dikembalikan ke kondisi awal. Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowResetConfirm(false)} className="btn-secondary">Batal</button>
              <button onClick={handleReset} className="btn-danger">Ya, Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
