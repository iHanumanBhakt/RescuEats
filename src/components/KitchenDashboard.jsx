import React, { useState } from "react";
import { 
  Sparkles, Camera, Upload, CheckCircle2, Clock, Send, ShieldCheck, RefreshCw 
} from "lucide-react";
import { api } from "../services/api";

export function KitchenDashboard({ listings, onSurplusCreated, iotData }) {
  const [targetHeadcount, setTargetHeadcount] = useState(2400);
  const recommendedPrep = Math.round(targetHeadcount * 0.88);
  const estimatedSavings = (targetHeadcount - recommendedPrep) * 35;

  const [foodTitle, setFoodTitle] = useState("Steamed Basmati Rice & Dal Tadka");
  const [foodCategory, setFoodCategory] = useState("Cooked");
  const [quantityKg, setQuantityKg] = useState("45");
  const [estimatedServings, setEstimatedServings] = useState("110");
  const [imageFile, setImageFile] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [judgeVerdict, setJudgeVerdict] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleInspect = async () => {
    setIsInspecting(true);
    setInspectionResult(null);
    setJudgeVerdict(null);

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("title", foodTitle);
    formData.append("category", foodCategory);

    try {
      const res = await api.inspectFood(formData);
      if (res.success) {
        setInspectionResult(res.data);
      }
    } catch (err) {
      console.error("Inspection error:", err);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const payload = {
        kitchenId: "k-001",
        foodTitle,
        foodType: foodCategory,
        quantityKg: Number(quantityKg),
        estimatedServings: Number(estimatedServings),
        inspection: inspectionResult || {
          freshnessScore: 92,
          status: "SAFE_FOR_REDISTRIBUTION",
          safeConsumptionWindowHours: 4.5
        }
      };

      const res = await api.createAndDispatchSurplus(payload);
      if (res.success) {
        setJudgeVerdict(res.listing.judgeVerdict);
        onSurplusCreated(res.listing);
      }
    } catch (err) {
      console.error("Dispatch error:", err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Demand Forecaster Card - Minimalist */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">Demand Forecasting</span>
            <h2 className="text-base font-semibold text-zinc-100">Prep Volume Planning</h2>
            <p className="text-xs text-zinc-400">
              Evaluates past meal demand to prevent cooking surplus.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div>
              <span className="text-zinc-500 block font-mono text-[10px]">Headcount</span>
              <input
                type="number"
                value={targetHeadcount}
                onChange={(e) => setTargetHeadcount(Number(e.target.value))}
                className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-medium focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-zinc-500 block font-mono text-[10px]">Optimal Prep</span>
              <span className="text-sm font-semibold text-zinc-100">{recommendedPrep} meals</span>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <span className="text-zinc-500 block font-mono text-[10px]">Estimated Savings</span>
              <span className="text-sm font-semibold text-emerald-400 font-mono">₹{estimatedSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid: Inspection & Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Form */}
        <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-medium text-zinc-200">Quality Inspection</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Gemini Vision</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 mb-1 block">Item Name</label>
              <input
                type="text"
                value={foodTitle}
                onChange={(e) => setFoodTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="text-zinc-400 mb-1 block">Category</label>
              <select
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                <option value="Cooked">Cooked Dish</option>
                <option value="Raw_Produce">Raw Produce</option>
                <option value="Packaged">Packaged Goods</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 mb-1 block">Surplus (kg)</label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="text-zinc-400 mb-1 block">Servings</label>
              <input
                type="number"
                value={estimatedServings}
                onChange={(e) => setEstimatedServings(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="border border-dashed border-zinc-800 hover:border-zinc-700 rounded-lg p-3 text-center bg-zinc-950/40 transition">
            <input
              type="file"
              accept="image/*"
              id="food-tray-snap"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="food-tray-snap" className="cursor-pointer flex items-center justify-center space-x-2 text-xs text-zinc-400 hover:text-zinc-200">
              <Upload className="h-4 w-4 text-zinc-500" />
              <span>{imageFile ? imageFile.name : "Upload or capture dish photo"}</span>
            </label>
          </div>

          <button
            onClick={handleInspect}
            disabled={isInspecting}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition disabled:opacity-50"
          >
            {isInspecting ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Inspecting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Run Quality Inspection</span>
              </>
            )}
          </button>

          {/* Inspection Result Minimalist Card */}
          {inspectionResult && (
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">Analysis Result:</span>
                <span className="text-emerald-400 font-mono font-medium">Safe for Redistribution</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/40">
                  <span className="text-zinc-500 text-[10px] block">Freshness</span>
                  <span className="text-sm font-semibold text-zinc-100">{inspectionResult.freshnessScore}%</span>
                </div>
                <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800/40">
                  <span className="text-zinc-500 text-[10px] block">Safe Window</span>
                  <span className="text-sm font-semibold text-zinc-100">{inspectionResult.safeConsumptionWindowHours} hrs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dispatch & Judge Review */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-zinc-200">Redistribution Dispatch</h3>
              <p className="text-xs text-zinc-400">
                Matches nearest verified shelters within 8km.
              </p>
            </div>

            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold transition disabled:opacity-50"
            >
              {isDispatching ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting to Judge...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Broadcast Surplus Batch</span>
                </>
              )}
            </button>
          </div>

          {/* Safety Judge Minimalist Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                <h3 className="text-sm font-medium text-zinc-200">Judge Consensus</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Arbiter</span>
            </div>

            {judgeVerdict ? (
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Decision:</span>
                  <span className="text-emerald-400 font-medium font-mono text-[11px]">{judgeVerdict.finalDecision}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Consensus Score:</span>
                  <span className="text-zinc-200 font-mono">{judgeVerdict.consensusScore}%</span>
                </div>
                <div className="pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400 space-y-1">
                  {judgeVerdict.rulesChecked?.slice(0, 2).map((r, i) => (
                    <div key={i} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{r.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">
                Awaiting batch dispatch to trigger safety verification.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Listings Table - Minimalist */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-200">Active Listings</h3>
          <span className="text-xs font-mono text-zinc-500">{listings.length} batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] font-mono text-zinc-500 border-b border-zinc-800/80">
              <tr>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Volume</th>
                <th className="py-2.5 px-3">Freshness</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Assigned NGO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {listings.map((l) => (
                <tr key={l.id} className="hover:bg-zinc-800/20 transition">
                  <td className="py-2.5 px-3">
                    <span className="text-zinc-200 font-medium block">{l.foodTitle}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{l.id}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className="text-zinc-300">{l.quantityKg} kg</span>
                    <span className="text-zinc-500 block text-[10px]">{l.estimatedServings} meals</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">
                    {l.inspection?.freshnessScore || 92}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      l.status === "AVAILABLE"
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">
                    {l.matchedNgo ? l.matchedNgo.name : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
