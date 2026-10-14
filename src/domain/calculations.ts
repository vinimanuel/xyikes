import { Ingredient, Recipe, RecipeIngredient, CostingResult, Unit } from './models';

// Unit conversion factors to base units
const CONVERSIONS: Record<string, Record<Unit, number>> = {
  mass: { g: 1, kg: 1000, pcs: 1, tsp: 5, tbsp: 15, portion: 1, ml: 0, L: 0 },
  volume: { ml: 1, L: 1000, g: 0, kg: 0, pcs: 0, tsp: 5, tbsp: 15, portion: 0 },
};

export function canConvert(from: Unit, to: Unit): boolean {
  if (from === to) return true;
  const massUnits: Unit[] = ['g', 'kg'];
  const volumeUnits: Unit[] = ['ml', 'L'];
  if (massUnits.includes(from) && massUnits.includes(to)) return true;
  if (volumeUnits.includes(from) && volumeUnits.includes(to)) return true;
  return false;
}

export function convertUnit(value: number, from: Unit, to: Unit, density?: number): number {
  if (from === to) return value;
  const massUnits: Unit[] = ['g', 'kg'];
  const volumeUnits: Unit[] = ['ml', 'L'];
  
  if (massUnits.includes(from) && massUnits.includes(to)) {
    const factor = CONVERSIONS.mass[to] / CONVERSIONS.mass[from];
    return value * factor;
  }
  if (volumeUnits.includes(from) && volumeUnits.includes(to)) {
    const factor = CONVERSIONS.volume[to] / CONVERSIONS.volume[from];
    return value * factor;
  }
  // Cross-unit conversion requires density (g/ml)
  if (density && massUnits.includes(from) && volumeUnits.includes(to)) {
    const grams = value * CONVERSIONS.mass[from];
    return grams / density / CONVERSIONS.volume[from] * CONVERSIONS.volume[to];
  }
  if (density && volumeUnits.includes(from) && massUnits.includes(to)) {
    const ml = value * CONVERSIONS.volume[from];
    return ml * density * CONVERSIONS.mass[to];
  }
  return value; // fallback
}

export function getCostPerBaseUnit(ingredient: Ingredient): number {
  const { purchaseQuantity, purchasePrice, purchaseUnit, baseUnit, conversionFactor, wastePercentage } = ingredient;
  
  // Convert purchase quantity to base unit
  let baseQuantity = purchaseQuantity;
  if (purchaseUnit !== baseUnit) {
    baseQuantity = convertUnit(purchaseQuantity, purchaseUnit, baseUnit, conversionFactor || undefined);
  }
  
  // Apply waste factor
  const usableQuantity = baseQuantity * (1 - wastePercentage / 100);
  
  if (usableQuantity <= 0) return 0;
  return purchasePrice / usableQuantity;
}

export function calculateIngredientCost(
  ingredient: Ingredient,
  quantity: number,
  unit: Unit
): number {
  const costPerBase = getCostPerBaseUnit(ingredient);
  let baseQuantity = quantity;
  
  if (unit !== ingredient.baseUnit) {
    baseQuantity = convertUnit(quantity, unit, ingredient.baseUnit, ingredient.conversionFactor || undefined);
  }
  
  return baseQuantity * costPerBase;
}

export function calculateRecipeCosting(
  recipe: Recipe,
  ingredients: Ingredient[],
  sellingPrice?: number
): CostingResult {
  const ingredientMap = new Map(ingredients.map(i => [i.id, i]));
  
  const ingredientCosts = recipe.ingredients.map(ri => {
    const ingredient = ingredientMap.get(ri.ingredientId);
    if (!ingredient) return { ingredientId: ri.ingredientId, name: 'Unknown', quantity: ri.quantity, unit: ri.unit, cost: 0 };
    const cost = calculateIngredientCost(ingredient, ri.quantity, ri.unit);
    return { ingredientId: ri.ingredientId, name: ingredient.name, quantity: ri.quantity, unit: ri.unit, cost };
  });
  
  const totalCost = ingredientCosts.reduce((sum, ic) => sum + ic.cost, 0);
  const costPerServing = recipe.yield > 0 ? totalCost / recipe.yield : totalCost;
  const price = sellingPrice || 0;
  const grossProfit = price - costPerServing;
  const grossMargin = price > 0 ? (grossProfit / price) * 100 : 0;
  const foodCostPercent = price > 0 ? (costPerServing / price) * 100 : 0;
  
  return {
    recipeId: recipe.id,
    ingredientCosts,
    totalCost,
    costPerServing,
    sellingPrice: price,
    grossProfit,
    grossMargin,
    foodCostPercent,
  };
}

export function suggestPrice(recipeCost: number, targetFoodCostPercent: number, roundingRule: 'nearest1000' | 'nearest500' | 'none' = 'nearest1000'): number {
  if (targetFoodCostPercent <= 0) return 0;
  const raw = recipeCost / (targetFoodCostPercent / 100);
  
  switch (roundingRule) {
    case 'nearest1000': return Math.ceil(raw / 1000) * 1000;
    case 'nearest500': return Math.ceil(raw / 500) * 500;
    default: return Math.round(raw);
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export function scaleRecipe(recipe: Recipe, targetYield: number): Recipe {
  const factor = targetYield / recipe.yield;
  return {
    ...recipe,
    yield: targetYield,
    ingredients: recipe.ingredients.map(ri => ({
      ...ri,
      quantity: ri.quantity * factor,
    })),
  };
}
