import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ingredient, MenuItem, Recipe, SOP, SimulationSession, StockMovement, KitchenLayout } from '../domain/models';
import { SEED_INGREDIENTS, SEED_MENU_ITEMS, SEED_RECIPES, SEED_SOPS, SEED_KITCHEN_LAYOUT } from '../data/seed';
import { v4 as uuid } from 'uuid';

interface AppState {
  // Data
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  recipes: Recipe[];
  sops: SOP[];
  simulations: SimulationSession[];
  stockMovements: StockMovement[];
  kitchenLayout: KitchenLayout;
  
  // UI State
  sidebarCollapsed: boolean;
  demoMode: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setDemoMode: (v: boolean) => void;
  
  // Ingredient actions
  addIngredient: (i: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, data: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  
  // Menu actions
  addMenuItem: (m: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMenuItem: (id: string, data: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  duplicateMenuItem: (id: string) => void;
  
  // Recipe actions
  addRecipe: (r: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void;
  updateRecipe: (id: string, data: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  
  // SOP actions
  addSOP: (s: Omit<SOP, 'id' | 'createdAt' | 'updatedAt' | 'revision'>) => void;
  updateSOP: (id: string, data: Partial<SOP>) => void;
  deleteSOP: (id: string) => void;
  
  // Simulation actions
  addSimulation: (s: Omit<SimulationSession, 'id'>) => void;
  updateSimulation: (id: string, data: Partial<SimulationSession>) => void;
  
  // Stock actions
  addStockMovement: (m: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  applyStockMovement: (ingredientId: string, quantity: number) => void;
  
  // Kitchen layout
  updateKitchenLayout: (data: Partial<KitchenLayout>) => void;
  
  // Reset
  resetToDemo: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ingredients: SEED_INGREDIENTS,
      menuItems: SEED_MENU_ITEMS,
      recipes: SEED_RECIPES,
      sops: SEED_SOPS,
      simulations: [],
      stockMovements: [],
      kitchenLayout: SEED_KITCHEN_LAYOUT,
      sidebarCollapsed: false,
      demoMode: true,
      
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setDemoMode: (v) => set({ demoMode: v }),
      
      addIngredient: (i) => set(s => ({ ingredients: [...s.ingredients, { ...i, id: uuid() }] })),
      updateIngredient: (id, data) => set(s => ({ ingredients: s.ingredients.map(i => i.id === id ? { ...i, ...data } : i) })),
      deleteIngredient: (id) => set(s => ({ ingredients: s.ingredients.filter(i => i.id !== id) })),
      
      addMenuItem: (m) => {
        const now = new Date().toISOString();
        set(s => ({ menuItems: [...s.menuItems, { ...m, id: uuid(), createdAt: now, updatedAt: now }] }));
      },
      updateMenuItem: (id, data) => set(s => ({ menuItems: s.menuItems.map(m => m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m) })),
      deleteMenuItem: (id) => set(s => ({ menuItems: s.menuItems.filter(m => m.id !== id) })),
      duplicateMenuItem: (id) => {
        const item = get().menuItems.find(m => m.id === id);
        if (item) {
          const now = new Date().toISOString();
          set(s => ({ menuItems: [...s.menuItems, { ...item, id: uuid(), name: item.name + ' (Salinan)', sku: item.sku + '-COPY', createdAt: now, updatedAt: now }] }));
        }
      },
      
      addRecipe: (r) => {
        const now = new Date().toISOString();
        set(s => ({ recipes: [...s.recipes, { ...r, id: uuid(), version: 1, createdAt: now, updatedAt: now }] }));
      },
      updateRecipe: (id, data) => set(s => ({ recipes: s.recipes.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r) })),
      deleteRecipe: (id) => set(s => ({ recipes: s.recipes.filter(r => r.id !== id) })),
      
      addSOP: (sop) => {
        const now = new Date().toISOString();
        set(s => ({ sops: [...s.sops, { ...sop, id: uuid(), revision: 1, createdAt: now, updatedAt: now }] }));
      },
      updateSOP: (id, data) => set(s => ({ sops: s.sops.map(so => so.id === id ? { ...so, ...data, updatedAt: new Date().toISOString() } : so) })),
      deleteSOP: (id) => set(s => ({ sops: s.sops.filter(so => so.id !== id) })),
      
      addSimulation: (sim) => set(s => ({ simulations: [...s.simulations, { ...sim, id: uuid() }] })),
      updateSimulation: (id, data) => set(s => ({ simulations: s.simulations.map(sim => sim.id === id ? { ...sim, ...data } : sim) })),
      
      addStockMovement: (m) => set(s => ({ stockMovements: [...s.stockMovements, { ...m, id: uuid(), timestamp: new Date().toISOString() }] })),
      applyStockMovement: (ingredientId, quantity) => set(s => ({
        ingredients: s.ingredients.map(i => i.id === ingredientId ? { ...i, currentStock: i.currentStock + quantity } : i)
      })),
      
      updateKitchenLayout: (data) => set(s => ({ kitchenLayout: { ...s.kitchenLayout, ...data, updatedAt: new Date().toISOString() } })),
      
      resetToDemo: () => set({
        ingredients: SEED_INGREDIENTS,
        menuItems: SEED_MENU_ITEMS,
        recipes: SEED_RECIPES,
        sops: SEED_SOPS,
        simulations: [],
        stockMovements: [],
        kitchenLayout: SEED_KITCHEN_LAYOUT,
      }),
    }),
    { name: 'gastrosim-storage' }
  )
);
