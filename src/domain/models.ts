// Domain Models for GastroSim 3D

export interface Ingredient {
  id: string;
  name: string;
  sku: string;
  supplier: string;
  purchaseUnit: Unit;
  baseUnit: Unit;
  purchaseQuantity: number;
  purchasePrice: number;
  conversionFactor: number;
  wastePercentage: number;
  currentStock: number;
  minStock: number;
  category: string;
  expirationDate?: string;
  storageLocation: string;
}

export type Unit = 'g' | 'kg' | 'ml' | 'L' | 'pcs' | 'tsp' | 'tbsp' | 'portion';

export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: Unit;
}

export interface Recipe {
  id: string;
  name: string;
  menuItemId?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  yield: number;
  servingSize: string;
  prepTime: number; // minutes
  equipment: string[];
  temperatures: string[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type MenuCategory = 'coffee' | 'non-coffee' | 'tea' | 'pastries' | 'appetizers' | 'main-course' | 'desserts' | 'signature' | 'custom';

export interface MenuItem {
  id: string;
  name: string;
  sku: string;
  category: MenuCategory;
  description: string;
  recipeId?: string;
  sopId?: string;
  sellingPrice: number;
  servingSize: string;
  estimatedPrepTime: number;
  allergens: string[];
  dietaryLabels: string[];
  isActive: boolean;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SOPStep {
  id: string;
  stepNumber: number;
  instruction: string;
  requiredIngredients: RecipeIngredient[];
  equipment: string[];
  timerDuration?: number; // seconds
  temperature?: string;
  qualityCheckpoint?: string;
  warning?: string;
  isOptional: boolean;
}

export type SOPStatus = 'draft' | 'review' | 'approved' | 'archived';

export interface SOP {
  id: string;
  title: string;
  category: string;
  objective: string;
  scope: string;
  responsibleRole: string;
  requiredEquipment: string[];
  requiredIngredients: RecipeIngredient[];
  prepTime: number;
  steps: SOPStep[];
  menuItemId?: string;
  recipeId?: string;
  status: SOPStatus;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationSession {
  id: string;
  sopId: string;
  recipeId: string;
  menuItemId?: string;
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  currentStep: number;
  elapsedSeconds: number;
  stepResults: StepResult[];
  ingredientConsumption: Record<string, number>;
  recipeSnapshot: Recipe;
  sopSnapshot: SOP;
}

export interface StepResult {
  stepId: string;
  stepNumber: number;
  completed: boolean;
  skipped: boolean;
  passed: boolean;
  actualDuration?: number;
  notes?: string;
  timestamp: string;
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  type: 'receipt' | 'consumption' | 'adjustment' | 'waste';
  quantity: number;
  unit: Unit;
  reason: string;
  simulationId?: string;
  timestamp: string;
}

export interface KitchenEquipment {
  id: string;
  name: string;
  type: string;
  width: number;
  depth: number;
  height: number;
  positionX: number;
  positionY: number;
  rotation: number;
  station: string;
}

export interface KitchenLayout {
  id: string;
  name: string;
  width: number;
  height: number;
  equipment: KitchenEquipment[];
  createdAt: string;
  updatedAt: string;
}

export interface CostingResult {
  recipeId: string;
  ingredientCosts: { ingredientId: string; name: string; quantity: number; unit: Unit; cost: number }[];
  totalCost: number;
  costPerServing: number;
  sellingPrice: number;
  grossProfit: number;
  grossMargin: number;
  foodCostPercent: number;
}

export const UNIT_LABELS: Record<Unit, string> = {
  'g': 'gram',
  'kg': 'kilogram',
  'ml': 'mililiter',
  'L': 'liter',
  'pcs': 'buah',
  'tsp': 'sendok teh',
  'tbsp': 'sendok makan',
  'portion': 'porsi',
};

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  'coffee': 'Kopi',
  'non-coffee': 'Non-Kopi',
  'tea': 'Teh',
  'pastries': 'Pastry',
  'appetizers': 'Appetizer',
  'main-course': 'Hidangan Utama',
  'desserts': 'Hidangan Penutup',
  'signature': 'Menu Spesial',
  'custom': 'Kategori Lain',
};
