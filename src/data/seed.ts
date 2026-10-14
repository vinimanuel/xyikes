import { Ingredient, MenuItem, Recipe, SOP, KitchenLayout } from '../domain/models';
import { v4 as uuid } from 'uuid';

export const SEED_INGREDIENTS: Ingredient[] = [
  { id: 'ing-1', name: 'Espresso Beans (Arabica)', sku: 'ING-001', supplier: 'Kopi Nusantara', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 180000, conversionFactor: 1, wastePercentage: 5, currentStock: 2000, minStock: 500, category: 'Biji Kopi', storageLocation: 'Gudang Kering' },
  { id: 'ing-2', name: 'Susu Full Cream', sku: 'ING-002', supplier: 'Greenfields', purchaseUnit: 'L', baseUnit: 'ml', purchaseQuantity: 1, purchasePrice: 22000, conversionFactor: 1, wastePercentage: 2, currentStock: 5000, minStock: 1000, category: 'Dairy', storageLocation: 'Kulkas' },
  { id: 'ing-3', name: 'Gula Pasir', sku: 'ING-003', supplier: 'Gulaku', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 15000, conversionFactor: 1, wastePercentage: 0, currentStock: 3000, minStock: 500, category: 'Bahan Kering', storageLocation: 'Gudang Kering' },
  { id: 'ing-4', name: 'Es Batu', sku: 'ING-004', supplier: 'Ice Factory', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 5, purchasePrice: 15000, conversionFactor: 1, wastePercentage: 20, currentStock: 3000, minStock: 1000, category: 'Es', storageLocation: 'Freezer' },
  { id: 'ing-5', name: 'Teh Hijau Premium', sku: 'ING-005', supplier: 'Teh Poci', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 120000, conversionFactor: 1, wastePercentage: 3, currentStock: 800, minStock: 200, category: 'Teh', storageLocation: 'Gudang Kering' },
  { id: 'ing-6', name: 'Coklat Bubuk', sku: 'ING-006', supplier: 'Cacao Heritage', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 95000, conversionFactor: 1, wastePercentage: 2, currentStock: 1500, minStock: 300, category: 'Bahan Kering', storageLocation: 'Gudang Kering' },
  { id: 'ing-7', name: 'Vanilla Syrup', sku: 'ING-007', supplier: 'Monin', purchaseUnit: 'L', baseUnit: 'ml', purchaseQuantity: 1, purchasePrice: 85000, conversionFactor: 1, wastePercentage: 0, currentStock: 2000, minStock: 500, category: 'Sirup', storageLocation: 'Gudang Kering' },
  { id: 'ing-8', name: 'Tepung Terigu', sku: 'ING-008', supplier: 'Bogasari', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 12000, conversionFactor: 1, wastePercentage: 1, currentStock: 5000, minStock: 1000, category: 'Bahan Kering', storageLocation: 'Gudang Kering' },
  { id: 'ing-9', name: 'Telur Ayam', sku: 'ING-009', supplier: 'Peternakan Lokal', purchaseUnit: 'pcs', baseUnit: 'pcs', purchaseQuantity: 30, purchasePrice: 54000, conversionFactor: 1, wastePercentage: 2, currentStock: 60, minStock: 20, category: 'Protein', storageLocation: 'Kulkas' },
  { id: 'ing-10', name: 'Mentega', sku: 'ING-010', supplier: 'Wijsman', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 75000, conversionFactor: 1, wastePercentage: 0, currentStock: 2000, minStock: 500, category: 'Dairy', storageLocation: 'Kulkas' },
  { id: 'ing-11', name: 'Roti Burger', sku: 'ING-011', supplier: 'Sari Roti', purchaseUnit: 'pcs', baseUnit: 'pcs', purchaseQuantity: 20, purchasePrice: 60000, conversionFactor: 1, wastePercentage: 5, currentStock: 40, minStock: 10, category: 'Roti', storageLocation: 'Gudang Kering' },
  { id: 'ing-12', name: 'Daging Sapi (Patty)', sku: 'ING-012', supplier: 'Butcher Shop', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 150000, conversionFactor: 1, wastePercentage: 5, currentStock: 2000, minStock: 500, category: 'Protein', storageLocation: 'Freezer' },
  { id: 'ing-13', name: 'Keju Cheddar', sku: 'ING-013', supplier: 'Kraft', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 120000, conversionFactor: 1, wastePercentage: 3, currentStock: 1000, minStock: 300, category: 'Dairy', storageLocation: 'Kulkas' },
  { id: 'ing-14', name: 'Selada', sku: 'ING-014', supplier: 'Sayuran Segar', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 25000, conversionFactor: 1, wastePercentage: 15, currentStock: 500, minStock: 200, category: 'Sayuran', storageLocation: 'Kulkas' },
  { id: 'ing-15', name: 'Tomat', sku: 'ING-015', supplier: 'Sayuran Segar', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 18000, conversionFactor: 1, wastePercentage: 10, currentStock: 600, minStock: 200, category: 'Sayuran', storageLocation: 'Kulkas' },
  { id: 'ing-16', name: 'Spaghetti', sku: 'ING-016', supplier: 'La Fonte', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 25000, conversionFactor: 1, wastePercentage: 0, currentStock: 3000, minStock: 500, category: 'Pasta', storageLocation: 'Gudang Kering' },
  { id: 'ing-17', name: 'Saus Bolognese', sku: 'ING-017', supplier: 'La Moderna', purchaseUnit: 'L', baseUnit: 'ml', purchaseQuantity: 1, purchasePrice: 45000, conversionFactor: 1, wastePercentage: 0, currentStock: 2000, minStock: 500, category: 'Saus', storageLocation: 'Gudang Kering' },
  { id: 'ing-18', name: 'Nasi Putih', sku: 'ING-018', supplier: 'Beras Premium', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 5, purchasePrice: 60000, conversionFactor: 1, wastePercentage: 5, currentStock: 10000, minStock: 2000, category: 'Beras', storageLocation: 'Gudang Kering' },
  { id: 'ing-19', name: 'Ayam Fillet', sku: 'ING-019', supplier: 'Charoen Pokphand', purchaseUnit: 'kg', baseUnit: 'g', purchaseQuantity: 1, purchasePrice: 45000, conversionFactor: 1, wastePercentage: 5, currentStock: 3000, minStock: 500, category: 'Protein', storageLocation: 'Freezer' },
  { id: 'ing-20', name: 'Whipped Cream', sku: 'ING-020', supplier: 'Emborg', purchaseUnit: 'L', baseUnit: 'ml', purchaseQuantity: 1, purchasePrice: 55000, conversionFactor: 1, wastePercentage: 2, currentStock: 1000, minStock: 300, category: 'Dairy', storageLocation: 'Kulkas' },
  { id: 'ing-21', name: 'Cup Plastik 16oz', sku: 'ING-021', supplier: 'Packaging Store', purchaseUnit: 'pcs', baseUnit: 'pcs', purchaseQuantity: 100, purchasePrice: 75000, conversionFactor: 1, wastePercentage: 0, currentStock: 500, minStock: 100, category: 'Packaging', storageLocation: 'Gudang Kering' },
  { id: 'ing-22', name: 'Susu Oat', sku: 'ING-022', supplier: 'Oatly', purchaseUnit: 'L', baseUnit: 'ml', purchaseQuantity: 1, purchasePrice: 45000, conversionFactor: 1, wastePercentage: 2, currentStock: 3000, minStock: 500, category: 'Dairy Alternatif', storageLocation: 'Kulkas' },
];

export const SEED_RECIPES: Recipe[] = [
  {
    id: 'rec-1', name: 'Espresso', menuItemId: 'menu-1',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 18, unit: 'g' },
    ],
    instructions: ['Giling biji kopi', 'Tamp espresso', 'Ekstrak 25-30 detik'],
    yield: 1, servingSize: '30ml', prepTime: 2, equipment: ['Espresso Machine', 'Grinder'], temperatures: ['92-96°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-2', name: 'Iced Latte', menuItemId: 'menu-2',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-2', quantity: 200, unit: 'ml' },
      { ingredientId: 'ing-4', quantity: 150, unit: 'g' },
      { ingredientId: 'ing-21', quantity: 1, unit: 'pcs' },
    ],
    instructions: ['Siapkan cup', 'Isi es batu', 'Tuang susu dingin', 'Ekstrak espresso', 'Tuang espresso di atas susu'],
    yield: 1, servingSize: '16oz', prepTime: 3, equipment: ['Espresso Machine', 'Grinder'], temperatures: ['92-96°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-3', name: 'Cappuccino', menuItemId: 'menu-3',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-2', quantity: 120, unit: 'ml' },
    ],
    instructions: ['Ekstrak espresso', 'Steam susu hingga microfoam', 'Tuang susu ke espresso'],
    yield: 1, servingSize: '8oz', prepTime: 3, equipment: ['Espresso Machine', 'Grinder', 'Steam Wand'], temperatures: ['60-65°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-4', name: 'Iced Tea Lemon', menuItemId: 'menu-5',
    ingredients: [
      { ingredientId: 'ing-5', quantity: 5, unit: 'g' },
      { ingredientId: 'ing-3', quantity: 20, unit: 'g' },
      { ingredientId: 'ing-4', quantity: 200, unit: 'g' },
      { ingredientId: 'ing-21', quantity: 1, unit: 'pcs' },
    ],
    instructions: ['Seduh teh dengan air panas', 'Tambahkan gula', 'Tuang ke cup berisi es'],
    yield: 1, servingSize: '16oz', prepTime: 4, equipment: ['Kettle'], temperatures: ['90-95°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-5', name: 'Beef Burger', menuItemId: 'menu-8',
    ingredients: [
      { ingredientId: 'ing-11', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing-12', quantity: 150, unit: 'g' },
      { ingredientId: 'ing-13', quantity: 30, unit: 'g' },
      { ingredientId: 'ing-14', quantity: 20, unit: 'g' },
      { ingredientId: 'ing-15', quantity: 25, unit: 'g' },
    ],
    instructions: ['Panggang patty', 'Toast bun', 'Susun sayuran dan keju', 'Sajikan'],
    yield: 1, servingSize: '1 porsi', prepTime: 8, equipment: ['Grill', 'Toaster'], temperatures: ['Internal 71°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-6', name: 'Spaghetti Bolognese', menuItemId: 'menu-9',
    ingredients: [
      { ingredientId: 'ing-16', quantity: 120, unit: 'g' },
      { ingredientId: 'ing-17', quantity: 150, unit: 'ml' },
    ],
    instructions: ['Rebus pasta al dente', 'Panaskan saus bolognese', 'Campur dan sajikan'],
    yield: 1, servingSize: '1 porsi', prepTime: 12, equipment: ['Kompor', 'Panci'], temperatures: ['100°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-7', name: 'Nasi Goreng Ayam', menuItemId: 'menu-10',
    ingredients: [
      { ingredientId: 'ing-18', quantity: 200, unit: 'g' },
      { ingredientId: 'ing-19', quantity: 100, unit: 'g' },
      { ingredientId: 'ing-9', quantity: 1, unit: 'pcs' },
    ],
    instructions: ['Tumis ayam', 'Masukkan nasi', 'Tambahkan bumbu', 'Goreng dengan api besar', 'Sajikan dengan telur'],
    yield: 1, servingSize: '1 porsi', prepTime: 10, equipment: ['Wok', 'Kompor'], temperatures: ['Api besar'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'rec-8', name: 'Vanilla Latte', menuItemId: 'menu-4',
    ingredients: [
      { ingredientId: 'ing-1', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-2', quantity: 200, unit: 'ml' },
      { ingredientId: 'ing-7', quantity: 30, unit: 'ml' },
    ],
    instructions: ['Tambahkan vanilla syrup ke cup', 'Ekstrak espresso', 'Steam susu', 'Tuang susu ke cup'],
    yield: 1, servingSize: '12oz', prepTime: 3, equipment: ['Espresso Machine', 'Grinder', 'Steam Wand'], temperatures: ['60-65°C'], version: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  { id: 'menu-1', name: 'Espresso', sku: 'MNU-001', category: 'coffee', description: 'Single shot espresso dari biji arabica pilihan', recipeId: 'rec-1', sopId: 'sop-1', sellingPrice: 18000, servingSize: '30ml', estimatedPrepTime: 2, allergens: [], dietaryLabels: ['Vegan'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-2', name: 'Iced Latte', sku: 'MNU-002', category: 'coffee', description: 'Espresso dingin dengan susu segar dan es batu', recipeId: 'rec-2', sopId: 'sop-2', sellingPrice: 28000, servingSize: '16oz', estimatedPrepTime: 3, allergens: ['Dairy'], dietaryLabels: ['Vegetarian'], isActive: true, internalNotes: 'Best seller', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-3', name: 'Cappuccino', sku: 'MNU-003', category: 'coffee', description: 'Espresso dengan microfoam susu yang lembut', recipeId: 'rec-3', sopId: 'sop-3', sellingPrice: 30000, servingSize: '8oz', estimatedPrepTime: 3, allergens: ['Dairy'], dietaryLabels: ['Vegetarian'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-4', name: 'Vanilla Latte', sku: 'MNU-004', category: 'coffee', description: 'Latte dengan sentuhan vanilla syrup premium', recipeId: 'rec-8', sellingPrice: 32000, servingSize: '12oz', estimatedPrepTime: 3, allergens: ['Dairy'], dietaryLabels: ['Vegetarian'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-5', name: 'Iced Tea Lemon', sku: 'MNU-005', category: 'tea', description: 'Teh hijau dingin dengan irisan lemon segar', recipeId: 'rec-4', sellingPrice: 22000, servingSize: '16oz', estimatedPrepTime: 4, allergens: [], dietaryLabels: ['Vegan'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-6', name: 'Hot Chocolate', sku: 'MNU-006', category: 'non-coffee', description: 'Coklat panas premium dengan whipped cream', sellingPrice: 28000, servingSize: '10oz', estimatedPrepTime: 4, allergens: ['Dairy'], dietaryLabels: ['Vegetarian'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-7', name: 'Matcha Latte', sku: 'MNU-007', category: 'non-coffee', description: 'Matcha premium dengan susu oat', sellingPrice: 35000, servingSize: '12oz', estimatedPrepTime: 3, allergens: [], dietaryLabels: ['Vegan'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-8', name: 'Beef Burger', sku: 'MNU-008', category: 'main-course', description: 'Burger sapi premium dengan keju cheddar dan sayuran segar', recipeId: 'rec-5', sellingPrice: 55000, servingSize: '1 porsi', estimatedPrepTime: 8, allergens: ['Gluten', 'Dairy'], dietaryLabels: [], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-9', name: 'Spaghetti Bolognese', sku: 'MNU-009', category: 'main-course', description: 'Spaghetti dengan saus bolognese homemade', recipeId: 'rec-6', sellingPrice: 45000, servingSize: '1 porsi', estimatedPrepTime: 12, allergens: ['Gluten'], dietaryLabels: [], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-10', name: 'Nasi Goreng Ayam', sku: 'MNU-010', category: 'main-course', description: 'Nasi goreng dengan ayam dan telur', recipeId: 'rec-7', sellingPrice: 38000, servingSize: '1 porsi', estimatedPrepTime: 10, allergens: ['Gluten', 'Egg'], dietaryLabels: [], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-11', name: 'Croissant', sku: 'MNU-011', category: 'pastries', description: 'Croissant butter yang renyah dan berlapis', sellingPrice: 25000, servingSize: '1 pcs', estimatedPrepTime: 5, allergens: ['Gluten', 'Dairy', 'Egg'], dietaryLabels: ['Vegetarian'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 'menu-12', name: 'Tiramisu', sku: 'MNU-012', category: 'desserts', description: 'Tiramisu klasik dengan mascarpone dan espresso', sellingPrice: 42000, servingSize: '1 porsi', estimatedPrepTime: 5, allergens: ['Dairy', 'Gluten', 'Egg'], dietaryLabels: ['Vegetarian'], isActive: true, internalNotes: '', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const SEED_SOPS: SOP[] = [
  {
    id: 'sop-1', title: 'SOP Pembuatan Espresso', category: 'coffee', objective: 'Memastikan konsistensi ekstraksi espresso', scope: 'Barista', responsibleRole: 'Barista',
    requiredEquipment: ['Espresso Machine', 'Grinder'], requiredIngredients: [{ ingredientId: 'ing-1', quantity: 18, unit: 'g' }], prepTime: 2,
    steps: [
      { id: 'step-1-1', stepNumber: 1, instruction: 'Pastikan mesin espresso sudah panas (minimal 15 menit)', requiredIngredients: [], equipment: ['Espresso Machine'], timerDuration: 0, isOptional: false },
      { id: 'step-1-2', stepNumber: 2, instruction: 'Giling 18g biji kopi dengan setting fine', requiredIngredients: [{ ingredientId: 'ing-1', quantity: 18, unit: 'g' }], equipment: ['Grinder'], timerDuration: 20, isOptional: false },
      { id: 'step-1-3', stepNumber: 3, instruction: 'Tamp espresso dengan tekanan 15kg, pastikan rata', requiredIngredients: [], equipment: ['Espresso Machine'], isOptional: false, qualityCheckpoint: 'Permukaan rata dan level' },
      { id: 'step-1-4', stepNumber: 4, instruction: 'Ekstrak espresso selama 25-30 detik', requiredIngredients: [], equipment: ['Espresso Machine'], timerDuration: 28, temperature: '92-96°C', isOptional: false, qualityCheckpoint: 'Volume 30ml ± 3ml, warna honey-brown', warning: 'Jika waktu ekstraksi < 20 detik, giling lebih halus' },
    ],
    menuItemId: 'menu-1', recipeId: 'rec-1', status: 'approved', revision: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'sop-2', title: 'SOP Iced Latte', category: 'coffee', objective: 'Membuat iced latte yang konsisten dan berkualitas', scope: 'Barista', responsibleRole: 'Barista',
    requiredEquipment: ['Espresso Machine', 'Grinder'], requiredIngredients: [{ ingredientId: 'ing-1', quantity: 18, unit: 'g' }, { ingredientId: 'ing-2', quantity: 200, unit: 'ml' }, { ingredientId: 'ing-4', quantity: 150, unit: 'g' }], prepTime: 3,
    steps: [
      { id: 'step-2-1', stepNumber: 1, instruction: 'Siapkan workstation: bersihkan area, siapkan cup 16oz', requiredIngredients: [], equipment: [], isOptional: false },
      { id: 'step-2-2', stepNumber: 2, instruction: 'Isi cup dengan es batu hingga 3/4 penuh', requiredIngredients: [{ ingredientId: 'ing-4', quantity: 150, unit: 'g' }], equipment: [], isOptional: false },
      { id: 'step-2-3', stepNumber: 3, instruction: 'Tuang susu dingin 200ml ke dalam cup', requiredIngredients: [{ ingredientId: 'ing-2', quantity: 200, unit: 'ml' }], equipment: [], isOptional: false, qualityCheckpoint: 'Volume susu sesuai standar' },
      { id: 'step-2-4', stepNumber: 4, instruction: 'Ekstrak double shot espresso (18g in, 30ml out, 25-30 detik)', requiredIngredients: [{ ingredientId: 'ing-1', quantity: 18, unit: 'g' }], equipment: ['Espresso Machine', 'Grinder'], timerDuration: 28, temperature: '92-96°C', isOptional: false, qualityCheckpoint: 'Ekstraksi 25-30 detik, warna honey-brown', warning: 'Periksa grind size jika waktu di luar range' },
      { id: 'step-2-5', stepNumber: 5, instruction: 'Tuang espresso perlahan di atas susu untuk efek layering', requiredIngredients: [], equipment: [], isOptional: false, qualityCheckpoint: 'Layer terlihat jelas' },
      { id: 'step-2-6', stepNumber: 6, instruction: 'Periksa visual akhir dan sajikan', requiredIngredients: [], equipment: [], isOptional: false, qualityCheckpoint: 'Layering jelas, tidak ada residu di rim cup' },
    ],
    menuItemId: 'menu-2', recipeId: 'rec-2', status: 'approved', revision: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'sop-3', title: 'SOP Cappuccino', category: 'coffee', objective: 'Membuat cappuccino dengan microfoam sempurna', scope: 'Barista', responsibleRole: 'Barista',
    requiredEquipment: ['Espresso Machine', 'Grinder', 'Steam Wand'], requiredIngredients: [{ ingredientId: 'ing-1', quantity: 18, unit: 'g' }, { ingredientId: 'ing-2', quantity: 120, unit: 'ml' }], prepTime: 3,
    steps: [
      { id: 'step-3-1', stepNumber: 1, instruction: 'Ekstrak double shot espresso', requiredIngredients: [{ ingredientId: 'ing-1', quantity: 18, unit: 'g' }], equipment: ['Espresso Machine', 'Grinder'], timerDuration: 28, isOptional: false, qualityCheckpoint: '30ml ± 3ml dalam 25-30 detik' },
      { id: 'step-3-2', stepNumber: 2, instruction: 'Steam 120ml susu hingga 60-65°C dengan microfoam', requiredIngredients: [{ ingredientId: 'ing-2', quantity: 120, unit: 'ml' }], equipment: ['Steam Wand'], timerDuration: 30, temperature: '60-65°C', isOptional: false, qualityCheckpoint: 'Microfoam halus, tidak ada bubble besar', warning: 'Jangan melebihi 70°C' },
      { id: 'step-3-3', stepNumber: 3, instruction: 'Tuang susu ke espresso dengan teknik free pour', requiredIngredients: [], equipment: [], isOptional: false, qualityCheckpoint: 'Pola latte art terlihat' },
    ],
    menuItemId: 'menu-3', recipeId: 'rec-3', status: 'approved', revision: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'sop-4', title: 'SOP Iced Tea Lemon', category: 'tea', objective: 'Membuat iced tea lemon yang segar dan konsisten', scope: 'Barista', responsibleRole: 'Barista',
    requiredEquipment: ['Kettle'], requiredIngredients: [{ ingredientId: 'ing-5', quantity: 5, unit: 'g' }, { ingredientId: 'ing-3', quantity: 20, unit: 'g' }, { ingredientId: 'ing-4', quantity: 200, unit: 'g' }], prepTime: 4,
    steps: [
      { id: 'step-4-1', stepNumber: 1, instruction: 'Rebus air hingga 90-95°C', requiredIngredients: [], equipment: ['Kettle'], timerDuration: 120, temperature: '90-95°C', isOptional: false },
      { id: 'step-4-2', stepNumber: 2, instruction: 'Seduh 5g teh hijau dengan 100ml air panas selama 3 menit', requiredIngredients: [{ ingredientId: 'ing-5', quantity: 5, unit: 'g' }], equipment: ['Kettle'], timerDuration: 180, isOptional: false, qualityCheckpoint: 'Warna hijau kekuningan, aroma teh keluar' },
      { id: 'step-4-3', stepNumber: 3, instruction: 'Tambahkan 20g gula, aduk hingga larut', requiredIngredients: [{ ingredientId: 'ing-3', quantity: 20, unit: 'g' }], equipment: [], isOptional: false },
      { id: 'step-4-4', stepNumber: 4, instruction: 'Siapkan cup dengan es batu, tuang teh', requiredIngredients: [{ ingredientId: 'ing-4', quantity: 200, unit: 'g' }], equipment: [], isOptional: false },
    ],
    menuItemId: 'menu-5', recipeId: 'rec-4', status: 'approved', revision: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
  {
    id: 'sop-5', title: 'SOP Beef Burger', category: 'main-course', objective: 'Memasak beef burger dengan tingkat kematangan sempurna', scope: 'Cook', responsibleRole: 'Cook',
    requiredEquipment: ['Grill', 'Toaster'], requiredIngredients: [{ ingredientId: 'ing-11', quantity: 1, unit: 'pcs' }, { ingredientId: 'ing-12', quantity: 150, unit: 'g' }, { ingredientId: 'ing-13', quantity: 30, unit: 'g' }, { ingredientId: 'ing-14', quantity: 20, unit: 'g' }, { ingredientId: 'ing-15', quantity: 25, unit: 'g' }], prepTime: 8,
    steps: [
      { id: 'step-5-1', stepNumber: 1, instruction: 'Panaskan grill hingga 200°C', requiredIngredients: [], equipment: ['Grill'], timerDuration: 300, temperature: '200°C', isOptional: false },
      { id: 'step-5-2', stepNumber: 2, instruction: 'Panggang patty 150g selama 3 menit per sisi', requiredIngredients: [{ ingredientId: 'ing-12', quantity: 150, unit: 'g' }], equipment: ['Grill'], timerDuration: 360, temperature: '200°C', isOptional: false, qualityCheckpoint: 'Internal temperature 71°C', warning: 'Pastikan suhu internal mencapai 71°C' },
      { id: 'step-5-3', stepNumber: 3, instruction: 'Letakkan keju di atas patty, tutup 30 detik hingga meleleh', requiredIngredients: [{ ingredientId: 'ing-13', quantity: 30, unit: 'g' }], equipment: ['Grill'], timerDuration: 30, isOptional: false },
      { id: 'step-5-4', stepNumber: 4, instruction: 'Toast bun hingga keemasan', requiredIngredients: [{ ingredientId: 'ing-11', quantity: 1, unit: 'pcs' }], equipment: ['Toaster'], timerDuration: 60, isOptional: false },
      { id: 'step-5-5', stepNumber: 5, instruction: 'Susun: bun bawah, selada, tomat, patty+keju, bun atas', requiredIngredients: [{ ingredientId: 'ing-14', quantity: 20, unit: 'g' }, { ingredientId: 'ing-15', quantity: 25, unit: 'g' }], equipment: [], isOptional: false, qualityCheckpoint: 'Susunan rapi, tidak berantakan' },
    ],
    menuItemId: 'menu-8', recipeId: 'rec-5', status: 'approved', revision: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01',
  },
];

export const SEED_KITCHEN_LAYOUT: KitchenLayout = {
  id: 'layout-1', name: 'Layout Kafe Utama', width: 10, height: 8,
  equipment: [
    { id: 'eq-1', name: 'Espresso Machine', type: 'espresso-machine', width: 0.8, depth: 0.5, height: 0.5, positionX: 2, positionY: 1, rotation: 0, station: 'espresso-bar' },
    { id: 'eq-2', name: 'Grinder', type: 'grinder', width: 0.3, depth: 0.3, height: 0.4, positionX: 3, positionY: 1, rotation: 0, station: 'espresso-bar' },
    { id: 'eq-3', name: 'Kulkas', type: 'refrigerator', width: 0.7, depth: 0.7, height: 1.8, positionX: 8, positionY: 1, rotation: 0, station: 'storage' },
    { id: 'eq-4', name: 'Prep Table', type: 'prep-table', width: 1.5, depth: 0.7, height: 0.9, positionX: 5, positionY: 3, rotation: 0, station: 'cold-kitchen' },
    { id: 'eq-5', name: 'Kompor', type: 'stove', width: 0.7, depth: 0.6, height: 0.9, positionX: 2, positionY: 5, rotation: 0, station: 'hot-kitchen' },
    { id: 'eq-6', name: 'Grill', type: 'grill', width: 0.8, depth: 0.6, height: 0.9, positionX: 3.5, positionY: 5, rotation: 0, station: 'hot-kitchen' },
    { id: 'eq-7', name: 'Sink', type: 'sink', width: 0.6, depth: 0.5, height: 0.9, positionX: 8, positionY: 5, rotation: 0, station: 'dishwashing' },
  ],
  createdAt: '2024-01-01', updatedAt: '2024-01-01',
};
