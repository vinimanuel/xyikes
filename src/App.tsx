import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from './stores';
import { 
  LayoutDashboard, UtensilsCrossed, FlaskConical, ClipboardList, Box, 
  ChefHat, Package, DollarSign, BarChart3, Settings, Menu, X, 
  Search, Bell, Save, User, Monitor
} from 'lucide-react';
import Dashboard from './modules/Dashboard';
import MenuStudio from './modules/MenuStudio';
import RecipeLab from './modules/RecipeLab';
import SOPWorkshop from './modules/SOPWorkshop';
import Simulation3D from './modules/Simulation3D';
import KitchenDesigner from './modules/KitchenDesigner';
import Inventory from './modules/Inventory';
import Costing from './modules/Costing';
import Reports from './modules/Reports';
import SettingsPage from './modules/Settings';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/menu', icon: UtensilsCrossed, label: 'Menu Studio' },
  { path: '/recipes', icon: FlaskConical, label: 'Recipe Lab' },
  { path: '/sops', icon: ClipboardList, label: 'SOP Workshop' },
  { path: '/simulation', icon: Box, label: 'Simulasi 3D' },
  { path: '/kitchen', icon: ChefHat, label: 'Kitchen Designer' },
  { path: '/inventory', icon: Package, label: 'Inventori' },
  { path: '/costing', icon: DollarSign, label: 'Cost & Profit' },
  { path: '/reports', icon: BarChart3, label: 'Laporan' },
  { path: '/settings', icon: Settings, label: 'Pengaturan' },
];

function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, demoMode } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const currentPage = NAV_ITEMS.find(n => n.path === location.pathname) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-60'} hidden md:flex flex-col bg-white border-r border-[rgba(61,43,31,0.08)] transition-all duration-200`}>
        <div className="flex items-center gap-2 p-4 border-b border-[rgba(61,43,31,0.08)]">
          <div className="w-8 h-8 rounded-lg bg-burnt-orange flex items-center justify-center text-white font-bold text-sm">G</div>
          {!sidebarCollapsed && <span className="font-bold text-espresso text-sm">GastroSim 3D</span>}
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button onClick={toggleSidebar} className="p-3 text-gray-400 hover:text-espresso border-t border-[rgba(61,43,31,0.08)]">
          <Menu size={18} />
        </button>
      </aside>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(61,43,31,0.08)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-burnt-orange flex items-center justify-center text-white font-bold text-sm">G</div>
                <span className="font-bold text-espresso text-sm">GastroSim 3D</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <nav className="p-2">
              {NAV_ITEMS.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[rgba(61,43,31,0.08)] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}><Menu size={20} /></button>
            <div className="text-sm text-gray-500">
              <span className="text-espresso font-medium">{currentPage.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {demoMode && (
              <span className="badge bg-warning-yellow/20 text-warning-yellow text-xs flex items-center gap-1">
                <Monitor size={12} /> Demo
              </span>
            )}
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari..." className="input-field pl-8 py-1.5 w-40 text-xs" />
            </div>
            <button className="relative p-1.5 text-gray-400 hover:text-espresso">
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-sage">
              <Save size={14} />
              <span className="hidden sm:inline">Tersimpan</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-beige flex items-center justify-center">
              <User size={16} className="text-espresso" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/menu" element={<MenuStudio />} />
            <Route path="/recipes" element={<RecipeLab />} />
            <Route path="/sops" element={<SOPWorkshop />} />
            <Route path="/simulation" element={<Simulation3D />} />
            <Route path="/kitchen" element={<KitchenDesigner />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/costing" element={<Costing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
