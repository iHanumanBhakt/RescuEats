import React, { useState } from "react";
import { 
  Calendar, Sparkles, Clock, AlertCircle, TrendingDown, 
  ChefHat, Layers, CloudRain, Briefcase, FileSpreadsheet, 
  CheckCircle2, ShoppingCart, MapPin, AlertTriangle, ShieldCheck,
  PlusCircle, X, HelpCircle, ChevronDown, ChevronUp, Cpu
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";

export function PrepPlanningDashboard() {
  const [activeSubTab, setActiveSubTab] = useState("production"); // 'production' | 'procurement' | 'surplus_hotspots'
  const [selectedMeal, setSelectedMeal] = useState("lunch");
  const [selectedDay, setSelectedDay] = useState("Friday (Today)");
  const [headcount, setHeadcount] = useState(2600);
  const [showReasoning, setShowReasoning] = useState(true);

  // Add Custom Dish State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [customDishName, setCustomDishName] = useState("");
  const [customCourse, setCustomCourse] = useState("Curry / Main");
  const [customStandardKg, setCustomStandardKg] = useState("100");

  // Dynamic calculations based on context
  const attendanceFactor = selectedDay.includes("Friday") ? 0.78 : selectedDay.includes("Saturday") ? 0.45 : 0.94;
  const recommendedPortions = Math.round(headcount * attendanceFactor);
  const bufferPortions = Math.round(recommendedPortions * 0.05);
  const finalCookTarget = recommendedPortions + bufferPortions;
  const mealsPrevented = headcount - finalCookTarget;
  const costSavingsINR = mealsPrevented * 38;

  // Hourly cafeteria footfall distribution curve
  const footfallCurve = [
    { time: "11:30 AM", regularCapacity: 250, aiForecast: 180 },
    { time: "12:00 PM", regularCapacity: 650, aiForecast: 480 },
    { time: "12:30 PM", regularCapacity: 900, aiForecast: 710 },
    { time: "01:00 PM", regularCapacity: 1100, aiForecast: 850 },
    { time: "01:30 PM", regularCapacity: 850, aiForecast: 620 },
    { time: "02:00 PM", regularCapacity: 450, aiForecast: 310 },
    { time: "02:30 PM", regularCapacity: 200, aiForecast: 120 }
  ];

  // Dish-by-Dish Raw Ingredient Requisition State
  const [dishes, setDishes] = useState([
    {
      id: "d1",
      dishName: "Steamed Jeera Rice",
      course: "Grains",
      standardBatchKg: 140,
      aiOptimizedKg: 105,
      rawIngredients: "Raw Basmati: 45kg • Cumin: 800g • Ghee: 1.5kg",
      batchSchedule: "Batch 1 (11:30 AM): 70kg • Batch 2 (1:00 PM): 35kg",
      reductionPercent: "-25%"
    },
    {
      id: "d2",
      dishName: "Dal Tadka (Lentil Curry)",
      course: "Protein / Pulse",
      standardBatchKg: 160,
      aiOptimizedKg: 125,
      rawIngredients: "Toor Dal: 32kg • Onions: 8kg • Tomatoes: 10kg",
      batchSchedule: "Single Batch (11:00 AM): 125kg (Safe Hot-Hold)",
      reductionPercent: "-22%"
    },
    {
      id: "d3",
      dishName: "Paneer Butter Masala",
      course: "Curry / Dairy",
      standardBatchKg: 120,
      aiOptimizedKg: 95,
      rawIngredients: "Fresh Paneer: 38kg • Cream: 6L • Tomato Gravy: 45kg",
      batchSchedule: "Batch 1 (11:45 AM): 65kg • Batch 2 (1:15 PM): 30kg",
      reductionPercent: "-21%"
    },
    {
      id: "d4",
      dishName: "Tandoori Roti / Chapati",
      course: "Bread",
      standardBatchKg: 2800,
      aiOptimizedKg: 2150,
      rawIngredients: "Whole Wheat Atta: 75kg • Water: 45L",
      batchSchedule: "Live Tandoor Stream (Continuous on-demand prep)",
      reductionPercent: "-23%"
    },
    {
      id: "d5",
      dishName: "Kachumber Salad",
      course: "Fresh Produce",
      standardBatchKg: 75,
      aiOptimizedKg: 55,
      rawIngredients: "Cucumbers: 25kg • Tomatoes: 18kg • Carrots: 12kg",
      batchSchedule: "Prepared at 11:15 AM (Kept Chilled at 4°C)",
      reductionPercent: "-27%"
    }
  ]);

  // Handle adding custom dish to menu
  const handleAddDish = (e) => {
    e.preventDefault();
    const stdKg = Number(customStandardKg) || 100;
    const optKg = Math.round(stdKg * attendanceFactor);
    const reduction = Math.round(((stdKg - optKg) / stdKg) * 100);

    const newDish = {
      id: `d-${Date.now()}`,
      dishName: customDishName || "Special Vegetable Pulao",
      course: customCourse,
      standardBatchKg: stdKg,
      aiOptimizedKg: optKg,
      rawIngredients: `Primary Ingredient: ${Math.round(optKg * 0.4)}kg • Spices & Oil: ${Math.round(optKg * 0.08)}kg`,
      batchSchedule: `Staggered Prep: Batch 1 (${Math.round(optKg * 0.65)}kg) • Batch 2 (${Math.round(optKg * 0.35)}kg)`,
      reductionPercent: `-${reduction}%`
    };

    setDishes([...dishes, newDish]);
    setShowAddDishModal(false);
    setCustomDishName("");
  };

  // Specific Prediction: WHEN and WHERE Surplus Will Generate
  const surplusHotspots = [
    {
      id: "h1",
      location: "Main Dining Hall - Buffet Counter 2 (Rice & Grains)",
      projectedTime: "02:15 PM - 02:45 PM",
      projectedItem: "Steamed Jeera Rice",
      estimatedSurplusKg: 18,
      riskLevel: "MODERATE",
      preventiveAction: "Hold Batch 2 cooking until 01:15 PM footfall count is verified."
    },
    {
      id: "h2",
      location: "North Wing Canteen - Gravy Station",
      projectedTime: "02:30 PM - 03:00 PM",
      projectedItem: "Dal Tadka",
      estimatedSurplusKg: 14,
      riskLevel: "LOW",
      preventiveAction: "Maintain in 65°C hot-holding unit for immediate NGO redistribution window."
    },
    {
      id: "h3",
      location: "Bakery / Bread Live Counter",
      projectedTime: "01:45 PM - 02:15 PM",
      projectedItem: "Tandoori Roti",
      estimatedSurplusKg: 8,
      riskLevel: "VERY_LOW",
      preventiveAction: "Cap live tandoor rolling at 01:30 PM based on counter sensor counts."
    }
  ];

  // Smart Procurement Data
  const procurementOrders = [
    {
      ingredient: "Basmati Rice (Raw)",
      category: "Dry Grains",
      currentStockKg: 250,
      standardOrderKg: 90,
      aiOptimizedOrderKg: 65,
      inventoryReductionKg: 25,
      costSavedINR: 2125,
      shelfLifeDays: 180,
      reorderTriggerPointKg: 50,
      procurementAdvice: "Stock ample. Reduce order by 25kg to prevent warehouse pest risk."
    },
    {
      ingredient: "Toor Dal (Lentils)",
      category: "Pulses",
      currentStockKg: 140,
      standardOrderKg: 60,
      aiOptimizedOrderKg: 45,
      inventoryReductionKg: 15,
      costSavedINR: 2100,
      shelfLifeDays: 90,
      reorderTriggerPointKg: 30,
      procurementAdvice: "Adequate buffer. 45kg matches Friday-Saturday demand window."
    },
    {
      ingredient: "Fresh Paneer (Dairy)",
      category: "Perishable Dairy",
      currentStockKg: 15,
      standardOrderKg: 55,
      aiOptimizedOrderKg: 42,
      inventoryReductionKg: 13,
      costSavedINR: 4420,
      shelfLifeDays: 3,
      reorderTriggerPointKg: 10,
      procurementAdvice: "CRITICAL: Highly perishable (3-day expiry). Cap order at 42kg to avoid cold-room spoilage."
    },
    {
      ingredient: "Tomatoes & Fresh Veggies",
      category: "Farm Produce",
      currentStockKg: 40,
      standardOrderKg: 120,
      aiOptimizedOrderKg: 85,
      inventoryReductionKg: 35,
      costSavedINR: 1575,
      shelfLifeDays: 5,
      reorderTriggerPointKg: 20,
      procurementAdvice: "Order staggered in two 40kg deliveries to ensure crisp quality."
    }
  ];

  const totalProcurementSavings = procurementOrders.reduce((sum, item) => sum + item.costSavedINR, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header & Sub-Tab Switcher */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <ChefHat className="h-4 w-4" />
            <span>SIH Pillar 1: AI-Driven Demand & Production Planning</span>
          </div>
          <h2 className="text-base font-semibold text-zinc-100">Predictive Demand & Smart Procurement Engine</h2>
          <p className="text-xs text-zinc-400">
            Forecasts consumption curves, explains predictive reasoning, and prevents warehouse over-purchasing.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap rounded-lg bg-zinc-950 border border-zinc-800 p-0.5 self-start md:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveSubTab("production")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeSubTab === "production" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Production Plan
          </button>
          <button
            onClick={() => setActiveSubTab("surplus_hotspots")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeSubTab === "surplus_hotspots" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Surplus Hotspots (When/Where)
          </button>
          <button
            onClick={() => setActiveSubTab("procurement")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeSubTab === "procurement" ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Smart Procurement
          </button>
        </div>
      </div>

      {/* 2. Key High-Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-zinc-500 text-[11px] font-mono block">Registered Headcount</span>
          <span className="text-2xl font-bold font-mono text-zinc-200">{headcount}</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Total cafeteria roster</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-zinc-500 text-[11px] font-mono block">Recommended Prep Target</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{finalCookTarget} meals</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Includes 5% buffer (+{bufferPortions})</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-zinc-500 text-[11px] font-mono block">Overproduction Prevented</span>
          <span className="text-2xl font-bold font-mono text-teal-300">{mealsPrevented} portions</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Source waste stopped</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <span className="text-zinc-500 text-[11px] font-mono block">Direct Inventory Saved</span>
          <span className="text-2xl font-bold font-mono text-zinc-100">₹{(costSavingsINR + totalProcurementSavings).toLocaleString()}</span>
          <span className="text-[10px] text-zinc-500 block mt-1">Cooking + Warehouse savings</span>
        </div>
      </div>

      {/* 3. Deep AI Prediction Reasoning Chain (NEW!) */}
      <div className="bg-zinc-900/40 border border-emerald-500/20 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowReasoning(!showReasoning)}>
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">AI Prediction Reasoning & Causal Decision Chain</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Confidence: 98.2%
            </span>
          </div>
          <button className="text-zinc-400 hover:text-white">
            {showReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {showReasoning && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 space-y-1.5">
              <span className="font-mono text-emerald-400 text-[11px] font-semibold block">
                Factor 1: Calendar & WFH (Weight: 50%)
              </span>
              <p className="text-zinc-300 text-[11px]">
                Analysis of the last 6 Fridays indicates an average <strong>22% decline</strong> in dining hall footfall due to hybrid work policies.
              </p>
              <span className="text-zinc-500 font-mono text-[10px] block">Impact: Base volume adjusted to 2,028 portions.</span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 space-y-1.5">
              <span className="font-mono text-teal-400 text-[11px] font-semibold block">
                Factor 2: Weather Ingestion (Weight: 15%)
              </span>
              <p className="text-zinc-300 text-[11px]">
                Forecast: Clear skies (28°C). Zero precipitation means zero weather-related commute delays or surge in hostel dining.
              </p>
              <span className="text-zinc-500 font-mono text-[10px] block">Impact: Nominal variance coefficient applied.</span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 space-y-1.5">
              <span className="font-mono text-cyan-400 text-[11px] font-semibold block">
                Factor 3: Historical Plate Waste (Weight: 35%)
              </span>
              <p className="text-zinc-300 text-[11px]">
                Smart scale sensor recorded <strong>14.5 kg excess rice</strong> in bin yesterday. Model reduces carbohydrate volume by an extra 4.2%.
              </p>
              <span className="text-zinc-500 font-mono text-[10px] block">Impact: Recommends 105kg Jeera Rice vs 140kg standard.</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Sub-View A: Production & Staggered Footfall Planning */}
      {activeSubTab === "production" && (
        <div className="space-y-6">
          {/* Staggered Footfall Chart */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <h3 className="font-medium text-zinc-200">Hourly Footfall & Staggered Production Strategy</h3>
                <p className="text-[11px] text-zinc-500">
                  Splits food cooking into two staggered batches to prevent degradation and unserved leftovers.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-[11px] font-mono">
                <span className="flex items-center space-x-1 text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-zinc-700" />
                  <span>Guesswork Prep</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>AI Staggered Target</span>
                </span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={footfallCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="regularCapacity" stroke="#52525b" fill="#27272a" fillOpacity={0.4} name="Guesswork Prep" />
                  <Area type="monotone" dataKey="aiForecast" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="AI Optimal Prep" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dish-by-Dish Production Matrix with "Add Custom Dish" Button */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <h3 className="font-medium text-zinc-200">Dish-by-Dish Cooking Targets & Schedule</h3>
                <span className="text-zinc-500 font-mono text-[11px]">Chef Production Roster</span>
              </div>
              <button
                onClick={() => setShowAddDishModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition self-start sm:self-auto"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>+ Add Custom Menu Dish</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] text-zinc-500 border-b border-zinc-800/80">
                  <tr>
                    <th className="py-2.5 px-3">Menu Item</th>
                    <th className="py-2.5 px-3">Standard Batch</th>
                    <th className="py-2.5 px-3">AI Recommended</th>
                    <th className="py-2.5 px-3">Adjustment</th>
                    <th className="py-2.5 px-3">Raw Ingredients Issued</th>
                    <th className="py-2.5 px-3">Batch Cooking Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {dishes.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/20 transition">
                      <td className="py-3 px-3">
                        <span className="text-zinc-200 font-medium font-sans block">{item.dishName}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.course}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">
                        {item.standardBatchKg} {item.course === "Bread" ? "pcs" : "kg"}
                      </td>
                      <td className="py-3 px-3 text-zinc-100 font-bold">
                        {item.aiOptimizedKg} {item.course === "Bread" ? "pcs" : "kg"}
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        {item.reductionPercent}
                      </td>
                      <td className="py-3 px-3 text-zinc-300 text-[11px] font-sans">
                        {item.rawIngredients}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 text-[11px] font-sans">
                        {item.batchSchedule}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Sub-View B: Surplus Hotspots (WHEN and WHERE Surplus Will Generate) */}
      {activeSubTab === "surplus_hotspots" && (
        <div className="space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono uppercase">
              <MapPin className="h-4 w-4" />
              <span>Predictive Surplus Mapping (Spatial & Temporal Forecaster)</span>
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Where & When Will Surplus Generate Today?</h3>
            <p className="text-xs text-zinc-400">
              The AI Analyst cross-correlates past consumption speed across cafeteria serving stations to predict exact surplus time windows before food is cooked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {surplusHotspots.map((spot) => (
              <div
                key={spot.id}
                className="bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-5 space-y-3 transition"
              >
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    spot.riskLevel === "MODERATE"
                      ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {spot.riskLevel} SURPLUS RISK
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-200">~{spot.estimatedSurplusKg} kg</span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{spot.projectedItem}</h4>
                  <p className="text-xs text-zinc-400 flex items-center space-x-1 mt-1">
                    <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
                    <span className="truncate">{spot.location}</span>
                  </p>
                </div>

                <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/40 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Projected Time:</span>
                    <span className="text-zinc-200 font-medium">{spot.projectedTime}</span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                  <span className="text-zinc-500 block font-mono text-[10px]">AI PREVENTIVE ACTION:</span>
                  <span className="text-zinc-300">{spot.preventiveAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Sub-View C: Smart Procurement & Inventory Optimization */}
      {activeSubTab === "procurement" && (
        <div className="space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono uppercase">
                <ShoppingCart className="h-4 w-4" />
                <span>Smart Procurement & Raw Inventory Optimization</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">Warehouse Purchase Requisition Optimizer</h3>
              <p className="text-xs text-zinc-400">
                Aligns procurement with consumption forecasts to prevent over-purchasing perishable stock at the source.
              </p>
            </div>

            <div className="text-right font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block">Total Procurement Capital Saved</span>
              <span className="text-base font-bold text-emerald-400">₹{totalProcurementSavings.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] text-zinc-500 border-b border-zinc-800/80">
                  <tr>
                    <th className="py-2.5 px-3">Raw Ingredient</th>
                    <th className="py-2.5 px-3">Current Stock</th>
                    <th className="py-2.5 px-3">Standard Order</th>
                    <th className="py-2.5 px-3">AI Reorder Target</th>
                    <th className="py-2.5 px-3">Reduction</th>
                    <th className="py-2.5 px-3">Cost Saved</th>
                    <th className="py-2.5 px-3">Procurement Advice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {procurementOrders.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/20 transition">
                      <td className="py-3 px-3">
                        <span className="text-zinc-200 font-medium font-sans block">{item.ingredient}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.category} • Shelf-life: {item.shelfLifeDays}d</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{item.currentStockKg} kg</td>
                      <td className="py-3 px-3 text-zinc-500 line-through">{item.standardOrderKg} kg</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{item.aiOptimizedOrderKg} kg</td>
                      <td className="py-3 px-3 text-zinc-300">-{item.inventoryReductionKg} kg</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">₹{item.costSavedINR}</td>
                      <td className="py-3 px-3 text-zinc-400 font-sans text-[11px] max-w-xs">{item.procurementAdvice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Add Custom Dish Modal (NEW!) */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <PlusCircle className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Add Dish to Menu & Calculate AI Prep</h3>
              </div>
              <button onClick={() => setShowAddDishModal(false)} className="text-zinc-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Veg Hakka Noodles / Paneer Biryani"
                  value={customDishName}
                  onChange={(e) => setCustomDishName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Course / Category</label>
                <select
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                >
                  <option value="Grains / Rice">Grains / Rice</option>
                  <option value="Curry / Gravy">Curry / Gravy</option>
                  <option value="Bread / Roti">Bread / Roti</option>
                  <option value="Fresh Produce">Fresh Produce / Salad</option>
                  <option value="Snacks / Dessert">Snacks / Dessert</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Standard Cooking Target (kg)</label>
                <input
                  type="number"
                  required
                  value={customStandardKg}
                  onChange={(e) => setCustomStandardKg(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold"
                >
                  Calculate Prep & Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
