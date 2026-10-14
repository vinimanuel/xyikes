import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Environment, ContactShadows } from '@react-three/drei';
import { useAppStore } from '../stores';
import { SOP, Recipe, SimulationSession, StepResult } from '../domain/models';
import { formatCurrency } from '../domain/calculations';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle, AlertTriangle, Clock, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import * as THREE from 'three';
import { useSearchParams } from 'react-router-dom';

// ============ 3D COMPONENTS ============

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#F5EDE3" />
    </mesh>
  );
}

function Counter({ position = [0, 0, -2] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Counter top */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.08, 1]} />
        <meshStandardMaterial color="#8B6F47" />
      </mesh>
      {/* Counter base */}
      <mesh position={[0, 0.43, 0]} castShadow>
        <boxGeometry args={[3.8, 0.86, 0.9]} />
        <meshStandardMaterial color="#F5EDE3" />
      </mesh>
    </group>
  );
}

function EspressoMachine({ highlighted = false, position = [-1, 0.94, -2] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const color = highlighted ? '#E07A3A' : '#4A4A4A';
  
  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Group head */}
      <mesh position={[0, -0.1, 0.22]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Portafilter */}
      <mesh position={[0, -0.2, 0.25]} castShadow>
        <cylinderGeometry args={[0.08, 0.04, 0.05, 16]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Steam wand */}
      <mesh position={[0.2, -0.1, 0.15]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      {highlighted && (
        <pointLight position={[0, 0.5, 0.5]} intensity={0.5} color="#E07A3A" distance={2} />
      )}
    </group>
  );
}

function Grinder({ highlighted = false, position = [-0.3, 0.94, -2] as [number, number, number] }) {
  const color = highlighted ? '#E07A3A' : '#555';
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.35, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Hopper */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color="#333" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Cup({ color = '#FFFFFF', position = [0.5, 0.98, -1.8] as [number, number, number], highlighted = false, scale = 1 }) {
  const cupColor = highlighted ? '#E07A3A' : color;
  return (
    <group position={position} scale={scale}>
      {/* Cup body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color={cupColor} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.008, 8, 16, Math.PI]} />
        <meshStandardMaterial color={cupColor} />
      </mesh>
    </group>
  );
}

function TallCup({ color = '#FFFFFF', position = [0.5, 0.98, -1.8] as [number, number, number], highlighted = false }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.18, 16]} />
        <meshStandardMaterial color={highlighted ? '#E07A3A' : color} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function IceCubes({ position = [0.5, 1.0, -1.8] as [number, number, number], visible = true }) {
  if (!visible) return null;
  return (
    <group position={position}>
      {[[-0.02, 0, 0.01], [0.02, 0.01, -0.01], [0, -0.01, 0.02]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.random(), Math.random(), 0]} castShadow>
          <boxGeometry args={[0.025, 0.025, 0.025]} />
          <meshStandardMaterial color="#D4EFFF" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function MilkLayer({ position = [0.5, 1.0, -1.8] as [number, number, number], height = 0.08, visible = true }) {
  if (!visible) return null;
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.04, 0.035, height, 16]} />
      <meshStandardMaterial color="#F5F0E8" />
    </mesh>
  );
}

function EspressoLayer({ position = [0.5, 1.06, -1.8] as [number, number, number], visible = true }) {
  if (!visible) return null;
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.038, 0.038, 0.02, 16]} />
      <meshStandardMaterial color="#3D2B1F" />
    </mesh>
  );
}

function IngredientContainer({ color = '#7BA05B', position = [2, 0.94, -2] as [number, number, number], highlighted = false, label = '' }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
        <meshStandardMaterial color={highlighted ? '#E07A3A' : color} />
      </mesh>
      {highlighted && (
        <pointLight position={[0, 0.2, 0]} intensity={0.3} color="#E07A3A" distance={1} />
      )}
    </group>
  );
}

function Plate({ position = [1.5, 0.94, -1.8] as [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.015, 24]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

function BurgerModel({ position = [1.5, 1.0, -1.8] as [number, number, number], visible = true }) {
  if (!visible) return null;
  return (
    <group position={position}>
      {/* Bottom bun */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.03, 16]} />
        <meshStandardMaterial color="#D4943A" />
      </mesh>
      {/* Patty */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.025, 16]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      {/* Cheese */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.14, 0.008, 0.14]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Lettuce */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.08, 0.015, 16]} />
        <meshStandardMaterial color="#7BA05B" />
      </mesh>
      {/* Top bun */}
      <mesh position={[0, 0.09, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#D4943A" />
      </mesh>
    </group>
  );
}

function PastaModel({ position = [1.5, 1.0, -1.8] as [number, number, number], visible = true }) {
  if (!visible) return null;
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.04, 16]} />
        <meshStandardMaterial color="#F5DEB3" />
      </mesh>
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        <meshStandardMaterial color="#C0392B" />
      </mesh>
    </group>
  );
}

function Wall() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2, -3.5]} receiveShadow>
        <boxGeometry args={[12, 4, 0.1]} />
        <meshStandardMaterial color="#FFF8F0" />
      </mesh>
      {/* Side wall */}
      <mesh position={[-5.5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshStandardMaterial color="#F5EDE3" />
      </mesh>
    </group>
  );
}

function Shelf({ position = [0, 2.5, -3.4] as [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[3, 0.05, 0.3]} />
      <meshStandardMaterial color="#8B6F47" />
    </mesh>
  );
}

// ============ SCENE ============

interface SceneProps {
  highlightedObjects: string[];
  showLayers: { ice: boolean; milk: boolean; espresso: boolean; burger: boolean; pasta: boolean };
  selectedModel: string;
}

function Scene({ highlightedObjects, showLayers, selectedModel }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow shadow-mapSize={1024} />
      <pointLight position={[-3, 3, 2]} intensity={0.3} color="#FFF0D4" />
      
      <Floor />
      <Wall />
      <Shelf />
      <Counter />
      
      <EspressoMachine highlighted={highlightedObjects.includes('espresso-machine')} position={[-1, 0.94, -2]} />
      <Grinder highlighted={highlightedObjects.includes('grinder')} position={[-0.3, 0.94, -2]} />
      
      {/* Ingredient containers */}
      <IngredientContainer color="#F5F0E8" position={[1.2, 0.94, -2.2]} highlighted={highlightedObjects.includes('milk')} label="Susu" />
      <IngredientContainer color="#D4EFFF" position={[1.5, 0.94, -2.2]} highlighted={highlightedObjects.includes('ice')} label="Es" />
      <IngredientContainer color="#3D2B1F" position={[1.8, 0.94, -2.2]} highlighted={highlightedObjects.includes('coffee')} label="Kopi" />
      <IngredientContainer color="#7BA05B" position={[2.1, 0.94, -2.2]} highlighted={highlightedObjects.includes('tea')} label="Teh" />
      
      {/* Cup / Glass */}
      <TallCup highlighted={highlightedObjects.includes('cup')} position={[0.5, 0.98, -1.8]} />
      
      {/* Layers */}
      <IceCubes position={[0.5, 1.0, -1.8]} visible={showLayers.ice} />
      <MilkLayer position={[0.5, 1.05, -1.8]} visible={showLayers.milk} />
      <EspressoLayer position={[0.5, 1.12, -1.8]} visible={showLayers.espresso} />
      
      {/* Food models */}
      <Plate position={[1.5, 0.94, -1.5]} />
      <BurgerModel position={[1.5, 1.0, -1.5]} visible={showLayers.burger} />
      <PastaModel position={[1.5, 1.0, -1.5]} visible={showLayers.pasta} />
      
      <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={10} blur={2} />
      <OrbitControls makeDefault minDistance={1} maxDistance={8} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}

// ============ SIMULATION MODULE ============

export default function Simulation3D() {
  const { sops, recipes, menuItems, ingredients, addSimulation, updateSimulation } = useAppStore();
  const [searchParams] = useSearchParams();
  const preselectedSOP = searchParams.get('sop');
  
  const [selectedSOPId, setSelectedSOPId] = useState(preselectedSOP || sops[0]?.id || '');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stepStartTime, setStepStartTime] = useState(0);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [showLayers, setShowLayers] = useState({ ice: false, milk: false, espresso: false, burger: false, pasta: false });
  const [highlightedObjects, setHighlightedObjects] = useState<string[]>([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const sop = sops.find(s => s.id === selectedSOPId);
  const recipe = sop ? recipes.find(r => r.id === sop.recipeId) : null;
  const menuItem = sop ? menuItems.find(m => m.id === sop.menuItemId) : null;

  // Timer logic using performance.now for accuracy
  useEffect(() => {
    if (isRunning && !isPaused) {
      startTimeRef.current = performance.now() - pausedTimeRef.current * 1000;
      const tick = () => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        setElapsedTime(elapsed);
        timerRef.current = requestAnimationFrame(tick);
      };
      timerRef.current = requestAnimationFrame(tick);
    }
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); };
  }, [isRunning, isPaused]);

  // Update highlights based on current step
  useEffect(() => {
    if (!sop || !sop.steps[currentStep]) return;
    const step = sop.steps[currentStep];
    const highlights: string[] = [];
    
    step.equipment.forEach(eq => {
      if (eq.toLowerCase().includes('espresso')) highlights.push('espresso-machine');
      if (eq.toLowerCase().includes('grinder')) highlights.push('grinder');
    });
    
    step.requiredIngredients.forEach(ri => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (ing) {
        if (ing.name.toLowerCase().includes('susu') || ing.name.toLowerCase().includes('milk')) highlights.push('milk');
        if (ing.name.toLowerCase().includes('es') || ing.name.toLowerCase().includes('ice')) highlights.push('ice');
        if (ing.name.toLowerCase().includes('kopi') || ing.name.toLowerCase().includes('espresso')) highlights.push('coffee');
        if (ing.name.toLowerCase().includes('teh') || ing.name.toLowerCase().includes('tea')) highlights.push('tea');
      }
    });
    
    highlights.push('cup');
    setHighlightedObjects(highlights);
  }, [currentStep, sop, ingredients]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(0);
    setElapsedTime(0);
    setStepResults([]);
    setSimulationComplete(false);
    setShowLayers({ ice: false, milk: false, espresso: false, burger: false, pasta: false });
    startTimeRef.current = performance.now();
    pausedTimeRef.current = 0;
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      pausedTimeRef.current = elapsedTime;
    }
  };

  const handleNextStep = () => {
    if (!sop) return;
    
    // Record step result
    const step = sop.steps[currentStep];
    const result: StepResult = {
      stepId: step.id, stepNumber: step.stepNumber, completed: true, skipped: false,
      passed: true, actualDuration: elapsedTime - stepStartTime, timestamp: new Date().toISOString(),
    };
    setStepResults([...stepResults, result]);

    // Update visual layers
    if (sop.recipeId === 'rec-2') { // Iced Latte
      if (currentStep === 1) setShowLayers(l => ({ ...l, ice: true }));
      if (currentStep === 2) setShowLayers(l => ({ ...l, milk: true }));
      if (currentStep === 4) setShowLayers(l => ({ ...l, espresso: true }));
    }

    if (currentStep < sop.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setStepStartTime(elapsedTime);
    } else {
      // Complete simulation
      handleComplete();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setStepResults(stepResults.slice(0, -1));
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    setSimulationComplete(true);
    
    if (sop && recipe) {
      const consumption: Record<string, number> = {};
      sop.steps.forEach(step => {
        step.requiredIngredients.forEach(ri => {
          consumption[ri.ingredientId] = (consumption[ri.ingredientId] || 0) + ri.quantity;
        });
      });
      
      addSimulation({
        sopId: sop.id, recipeId: recipe.id, menuItemId: sop.menuItemId,
        startedAt: new Date(Date.now() - elapsedTime * 1000).toISOString(),
        completedAt: new Date().toISOString(), status: 'completed',
        currentStep: sop.steps.length - 1, elapsedSeconds: elapsedTime,
        stepResults, ingredientConsumption: consumption,
        recipeSnapshot: recipe, sopSnapshot: sop,
      });
    }
  };

  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setElapsedTime(0);
    setStepResults([]);
    setSimulationComplete(false);
    setShowLayers({ ice: false, milk: false, espresso: false, burger: false, pasta: false });
    pausedTimeRef.current = 0;
  };

  const currentStepData = sop?.steps[currentStep];
  const progress = sop ? ((currentStep + (simulationComplete ? 1 : 0)) / sop.steps.length) * 100 : 0;

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Simulasi 3D</h1>
          <p className="text-sm text-gray-500">Simulasikan persiapan menu di dapur virtual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left Panel - SOP Info */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">SOP & Resep</h3>
          <select value={selectedSOPId} onChange={e => { setSelectedSOPId(e.target.value); handleRestart(); }} className="input-field mb-3 text-xs">
            {sops.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          
          {sop && (
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-cream rounded">
                <span className="text-gray-500">Menu:</span>
                <p className="font-medium text-espresso">{menuItem?.name || '-'}</p>
              </div>
              <div className="p-2 bg-cream rounded">
                <span className="text-gray-500">Resep:</span>
                <p className="font-medium text-espresso">{recipe?.name || '-'}</p>
              </div>
              <div className="p-2 bg-cream rounded">
                <span className="text-gray-500">Total Langkah:</span>
                <p className="font-medium text-espresso">{sop.steps.length}</p>
              </div>
              <div className="p-2 bg-cream rounded">
                <span className="text-gray-500">Estimasi Waktu:</span>
                <p className="font-medium text-espresso">{sop.prepTime} menit</p>
              </div>
              <div className="p-2 bg-cream rounded">
                <span className="text-gray-500">Peralatan:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sop.requiredEquipment.map((eq, i) => <span key={i} className="badge bg-beige text-espresso">{eq}</span>)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center - 3D View */}
        <div className="lg:col-span-2 card overflow-hidden" style={{ minHeight: '400px' }}>
          <div className="h-[400px] relative">
            <Canvas shadows camera={{ position: [3, 3, 3], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene highlightedObjects={highlightedObjects} showLayers={showLayers} selectedModel={selectedObject || ''} />
              </Suspense>
            </Canvas>
            {/* Overlay controls */}
            <div className="absolute top-3 left-3 flex gap-1">
              <button onClick={() => setHighlightedObjects([])} className="bg-white/80 backdrop-blur px-2 py-1 rounded text-xs shadow">Reset View</button>
            </div>
            {!isRunning && !simulationComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button onClick={handleStart} className="btn-primary flex items-center gap-2 text-lg px-6 py-3">
                  <Play size={20} /> Mulai Simulasi
                </button>
              </div>
            )}
            {simulationComplete && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white rounded-xl p-6 text-center shadow-xl">
                  <CheckCircle size={40} className="mx-auto text-sage mb-2" />
                  <h3 className="font-bold text-espresso">Simulasi Selesai!</h3>
                  <p className="text-sm text-gray-500 mt-1">Waktu: {elapsedTime.toFixed(1)} detik</p>
                  <button onClick={handleRestart} className="btn-primary mt-3 text-xs">Simulasi Ulang</button>
                </div>
              </div>
            )}
          </div>
          {/* Progress bar */}
          {isRunning && (
            <div className="p-3 border-t border-beige">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-espresso">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-beige rounded-full overflow-hidden">
                <div className="h-full bg-sage rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500"><Clock size={10} className="inline mr-1" />{elapsedTime.toFixed(1)}s</span>
                <div className="flex gap-1">
                  <button onClick={handlePrevStep} disabled={currentStep === 0} className="p-1.5 rounded bg-beige disabled:opacity-30"><ChevronLeft size={14} /></button>
                  <button onClick={handlePause} className="p-1.5 rounded bg-beige">{isPaused ? <Play size={14} /> : <Pause size={14} />}</button>
                  <button onClick={handleNextStep} className="p-1.5 rounded bg-burnt-orange text-white"><ChevronRight size={14} /></button>
                  <button onClick={handleRestart} className="p-1.5 rounded bg-beige"><RotateCcw size={14} /></button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Current Step */}
        <div className="card p-4">
          <h3 className="font-semibold text-espresso text-sm mb-3">Langkah Saat Ini</h3>
          {isRunning && currentStepData ? (
            <div className="space-y-3">
              <div className="p-3 bg-burnt-orange/10 rounded-lg border border-burnt-orange/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-burnt-orange text-white flex items-center justify-center text-xs font-bold">{currentStepData.stepNumber}</span>
                  <span className="text-xs text-gray-500">dari {sop?.steps.length}</span>
                </div>
                <p className="text-sm text-espresso font-medium">{currentStepData.instruction}</p>
              </div>

              {currentStepData.timerDuration && currentStepData.timerDuration > 0 && (
                <div className="p-2 bg-soft-blue/10 rounded-lg text-xs">
                  <span className="text-soft-blue font-medium">⏱ Timer: {currentStepData.timerDuration} detik</span>
                </div>
              )}

              {currentStepData.temperature && (
                <div className="p-2 bg-warning-yellow/10 rounded-lg text-xs">
                  <span className="text-warning-yellow font-medium">🌡️ Suhu: {currentStepData.temperature}</span>
                </div>
              )}

              {currentStepData.qualityCheckpoint && (
                <div className="p-2 bg-sage/10 rounded-lg text-xs">
                  <span className="text-sage font-medium">✓ QC: {currentStepData.qualityCheckpoint}</span>
                </div>
              )}

              {currentStepData.warning && (
                <div className="p-2 bg-soft-red/10 rounded-lg text-xs flex items-start gap-1">
                  <AlertTriangle size={12} className="text-soft-red shrink-0 mt-0.5" />
                  <span className="text-soft-red">{currentStepData.warning}</span>
                </div>
              )}

              {currentStepData.requiredIngredients.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-600 mb-1 block">Bahan yang dibutuhkan:</span>
                  {currentStepData.requiredIngredients.map((ri, i) => {
                    const ing = ingredients.find(ing => ing.id === ri.ingredientId);
                    return (
                      <div key={i} className="text-xs p-1.5 bg-cream rounded mb-1 flex justify-between">
                        <span>{ing?.name}</span>
                        <span className="font-medium">{ri.quantity} {ri.unit}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <button onClick={handleNextStep} className="btn-primary w-full text-sm flex items-center justify-center gap-1">
                Langkah Selanjutnya <ChevronRight size={14} />
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye size={30} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">Mulai simulasi untuk melihat langkah</p>
            </div>
          )}

          {/* Step history */}
          {stepResults.length > 0 && (
            <div className="mt-4 pt-3 border-t border-beige">
              <span className="text-xs font-medium text-gray-600 mb-2 block">Riwayat Langkah:</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {stepResults.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={12} className="text-sage" />
                    <span className="text-gray-600">Langkah {r.stepNumber}</span>
                    <span className="text-gray-400 ml-auto">{r.actualDuration?.toFixed(1)}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
