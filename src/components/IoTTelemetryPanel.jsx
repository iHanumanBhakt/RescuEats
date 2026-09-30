import React, { useState } from "react";
import { 
  Radio, ThermometerSnowflake, Droplets, Scale, AlertTriangle, 
  Sliders, RefreshCw, CheckCircle2, ShieldAlert, Sparkles 
} from "lucide-react";
import { api } from "../services/api";

export function IoTTelemetryPanel({ iotData, criticalAlert }) {
  const [sliderTemp, setSliderTemp] = useState(4.2);
  const [sliderHumidity, setSliderHumidity] = useState(68);
  const [sliderWeight, setSliderWeight] = useState(14.5);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentTemp = iotData?.temperatureC ?? sliderTemp;
  const currentHumidity = iotData?.humidityPercent ?? sliderHumidity;
  const currentBinWeight = iotData?.smartBinWeightKg ?? sliderWeight;
  const isBreached = criticalAlert || currentTemp > 8.0;

  // Send slider change to backend simulator
  const handleSliderChange = async (updates) => {
    setIsUpdating(true);
    try {
      const payload = {
        temp: updates.temp !== undefined ? updates.temp : sliderTemp,
        humidity: updates.humidity !== undefined ? updates.humidity : sliderHumidity,
        weight: updates.weight !== undefined ? updates.weight : sliderWeight
      };
      if (updates.temp !== undefined) setSliderTemp(updates.temp);
      if (updates.humidity !== undefined) setSliderHumidity(updates.humidity);
      if (updates.weight !== undefined) setSliderWeight(updates.weight);

      await api.setIoTSensors(payload);
    } catch (err) {
      console.error("Slider update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Quick Preset Scenarios
  const applyPreset = (preset) => {
    setSliderTemp(preset.temp);
    setSliderHumidity(preset.humidity);
    setSliderWeight(preset.weight);
    handleSliderChange(preset);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Radio className="h-4 w-4" />
            <span>Interactive IoT & Telemetry Simulation Sandbox</span>
          </div>
          <h2 className="text-base font-semibold text-zinc-100">Cold Chain & Storage Telemetry Hub</h2>
          <p className="text-xs text-zinc-400">
            Use interactive sliders and presets below to simulate real-world thermal spikes and see how the AI responds.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-800">
          <span className="text-zinc-500">Telemetry Stream:</span>
          <span className="text-emerald-400 font-bold flex items-center space-x-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Active (3s intervals)</span>
          </span>
        </div>
      </div>

      {/* 2. Interactive Sensor Sandbox Sliders & Presets (NEW!) */}
      <div className="bg-zinc-900/60 border border-zinc-700/80 rounded-xl p-5 space-y-4 shadow-lg shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Live Hardware Telemetry Controls</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">Drag sliders to test AI reaction</span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Temperature Slider */}
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">Cold Storage Temperature</span>
              <span className={`font-mono font-bold ${currentTemp > 8.0 ? "text-rose-400" : "text-emerald-400"}`}>
                {currentTemp}°C
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="20.0"
              step="0.2"
              value={currentTemp}
              onChange={(e) => handleSliderChange({ temp: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0°C (Deep Freeze)</span>
              <span className="text-amber-400">8°C Threshold</span>
              <span>20°C (Room Temp)</span>
            </div>
          </div>

          {/* Humidity Slider */}
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">Storage Humidity</span>
              <span className="font-mono font-bold text-teal-300">{currentHumidity}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="1"
              value={currentHumidity}
              onChange={(e) => handleSliderChange({ humidity: Number(e.target.value) })}
              className="w-full accent-teal-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>30% (Dry)</span>
              <span>65% (Optimal)</span>
              <span>95% (Condensation)</span>
            </div>
          </div>

          {/* Smart Scale Slider */}
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">Waste Bin Load Cell</span>
              <span className="font-mono font-bold text-purple-300">{currentBinWeight} kg</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="50.0"
              step="0.5"
              value={currentBinWeight}
              onChange={(e) => handleSliderChange({ weight: Number(e.target.value) })}
              className="w-full accent-purple-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>0 kg (Empty)</span>
              <span>25 kg</span>
              <span>50 kg (Full Capacity)</span>
            </div>
          </div>
        </div>

        {/* Quick Scenario Preset Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-zinc-500 mr-1">One-Click Presets:</span>
          <button
            onClick={() => applyPreset({ temp: 3.8, humidity: 65, weight: 12.0 })}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-[11px] transition"
          >
            ❄️ Normal Chill (3.8°C)
          </button>
          <button
            onClick={() => applyPreset({ temp: 9.5, humidity: 72, weight: 18.5 })}
            className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-mono text-[11px] transition"
          >
            ⚠️ Door Left Ajar (9.5°C)
          </button>
          <button
            onClick={() => applyPreset({ temp: 16.2, humidity: 82, weight: 28.0 })}
            className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-mono text-[11px] transition"
          >
            🚨 Compressor Failure (16.2°C)
          </button>
          <button
            onClick={() => applyPreset({ temp: 4.2, humidity: 68, weight: 48.5 })}
            className="px-2.5 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 font-mono text-[11px] transition"
          >
            ⚖️ Bin Full (48.5 kg)
          </button>
        </div>
      </div>

      {/* 3. Critical Alert / Interlock Status Banner */}
      {isBreached ? (
        <div className="bg-rose-500/10 border-2 border-rose-500/40 rounded-xl p-4 flex items-start space-x-3 text-rose-300 animate-pulse">
          <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-sm block">CRITICAL SAFETY INTERLOCK ACTIVATED ({currentTemp}°C)</span>
            <span className="text-rose-200/90 block mt-0.5">
              Temperature exceeds FSSAI &lt; 8.0°C limit. The <strong>Safety Judge Agent</strong> will reject new cooked surplus redistribution until cooling stabilizes.
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center space-x-2 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Cold-chain integrity verified stable. Safe for redistribution dispatches.</span>
        </div>
      )}

      {/* 4. Three Minimalist Live Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cold Storage */}
        <div className={`bg-zinc-900/40 border rounded-xl p-5 space-y-3 ${
          isBreached ? "border-rose-500/50 bg-rose-500/5" : "border-zinc-800/80"
        }`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-zinc-300">
              <ThermometerSnowflake className="h-4 w-4 text-zinc-400" />
              <span>Cold Storage Unit 01</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">ESP32-NODE-A</span>
          </div>

          <div className="py-2">
            <span className={`text-4xl font-bold font-mono ${isBreached ? "text-rose-400" : "text-zinc-100"}`}>
              {currentTemp}°C
            </span>
            <span className="text-[11px] text-zinc-500 block font-mono mt-1">
              FSSAI Safe Range: 0.0°C – 8.0°C
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-500">Status:</span>
            <span className={isBreached ? "text-rose-400 font-bold" : "text-emerald-400 font-medium"}>
              {isBreached ? "THERMAL BREACH" : "OPTIMAL"}
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-zinc-300">
              <Droplets className="h-4 w-4 text-zinc-400" />
              <span>Relative Humidity</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">DHT11-HUM</span>
          </div>

          <div className="py-2">
            <span className="text-4xl font-bold font-mono text-zinc-100">
              {currentHumidity}%
            </span>
            <span className="text-[11px] text-zinc-500 block font-mono mt-1">
              Optimal Dry Target: 60% – 75%
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-500">Condensation:</span>
            <span className="text-emerald-400 font-medium">CONTROLLED</span>
          </div>
        </div>

        {/* Smart Bin Load Cell */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-zinc-300">
              <Scale className="h-4 w-4 text-zinc-400" />
              <span>Smart Waste Bin Scale</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">HX711-CELL</span>
          </div>

          <div className="py-2">
            <span className="text-4xl font-bold font-mono text-zinc-100">
              {currentBinWeight} kg
            </span>
            <span className="text-[11px] text-zinc-500 block font-mono mt-1">
              Max Bin Capacity: 50.0 kg
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-500">Capacity Load:</span>
            <span className="text-zinc-300 font-medium">
              {Math.round((currentBinWeight / 50) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
