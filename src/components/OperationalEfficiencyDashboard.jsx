import React, { useState } from "react";
import { 
  Factory, Zap, AlertTriangle, CheckCircle2, Clock, 
  TrendingDown, ShieldCheck, Wrench, IndianRupee, Activity 
} from "lucide-react";

export function OperationalEfficiencyDashboard() {
  const [selectedLine, setSelectedLine] = useState("ALL");

  const lines = [
    {
      id: "LINE_01",
      name: "Line 1: Raw Produce Sorting & Washing",
      type: "Pre-Processing",
      status: "OPTIMAL",
      throughputKgPerHour: 420,
      materialLossPercent: 3.2,
      lossBenchmarkPercent: 4.0,
      lossStatus: "WITHIN_TOLERANCE",
      powerDrawKwh: 12.4,
      energyAnomaly: false,
      downtimeMinutesToday: 0,
      oeeScore: 94.2
    },
    {
      id: "LINE_02",
      name: "Line 2: Continuous Cooking & Blanching",
      type: "Thermal Processing",
      status: "WARNING",
      throughputKgPerHour: 280,
      materialLossPercent: 7.8,
      lossBenchmarkPercent: 5.0,
      lossStatus: "EXCESS_TRIMMING_LOSS",
      powerDrawKwh: 28.6,
      energyAnomaly: true,
      energyAnomalyDetail: "Steam jacket heat loss detected (+24% above baseline).",
      downtimeMinutesToday: 18,
      oeeScore: 82.5
    },
    {
      id: "LINE_03",
      name: "Line 3: Automated Tray Sealing & Packaging",
      type: "Packaging & Dispatch",
      status: "MAINTENANCE_REQUIRED",
      throughputKgPerHour: 350,
      materialLossPercent: 2.1,
      lossBenchmarkPercent: 2.5,
      lossStatus: "OPTIMAL",
      powerDrawKwh: 8.5,
      energyAnomaly: false,
      downtimeMinutesToday: 42,
      downtimeCause: "Vacuum sealer thermal sensor calibration drift.",
      downtimeLossINR: 5880,
      oeeScore: 76.8
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Factory className="h-4 w-4" />
            <span>SIH Pillar 4: Operational Efficiency & Loss Detection</span>
          </div>
          <h2 className="text-base font-semibold text-zinc-100">Processing Unit & Factory Inefficiency Monitor</h2>
          <p className="text-xs text-zinc-400">
            Real-time loss detection tracking raw material trimming waste, excessive energy spikes, and machine downtime.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-800">
          <span className="text-zinc-500">Overall Plant OEE:</span>
          <span className="text-emerald-400 font-bold text-sm">84.5%</span>
        </div>
      </div>

      {/* 2. Key Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>Plant OEE Index</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-zinc-100 block mt-1">84.5%</span>
          <span className="text-[10px] text-zinc-500 block">World-class benchmark &gt; 80%</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>Raw Material Loss Rate</span>
            <TrendingDown className="h-4 w-4 text-teal-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-teal-300 block mt-1">4.4%</span>
          <span className="text-[10px] text-zinc-500 block">Tolerance standard: 5.0%</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>Unplanned Downtime</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-amber-300 block mt-1">60 mins</span>
          <span className="text-[10px] text-zinc-500 block">2 minor line stoppages today</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span>Total Cost Reduction</span>
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400 block mt-1">₹42,500</span>
          <span className="text-[10px] text-zinc-500 block">Yield + Energy + Inventory savings</span>
        </div>
      </div>

      {/* 3. Real-Time Inefficiency & Anomaly Warnings */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="font-medium text-zinc-200">Active Factory Anomalies & Root Causes</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Auto-Detected by Agent Core</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Energy Spike Warning */}
          <div className="bg-zinc-950/80 border border-amber-500/20 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                EXCESSIVE ENERGY USAGE
              </span>
              <span className="font-mono text-zinc-400 text-[11px]">Line 2: Cooking Unit</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              Power draw spiked to <strong>28.6 kWh</strong> (Normal: 22.0 kWh). Thermal coil insulation degradation detected causing heat leakage.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-zinc-800/60">
              Action: Auto-dispatched thermal recalibration task to maintenance engineer.
            </div>
          </div>

          {/* Unplanned Downtime Warning */}
          <div className="bg-zinc-950/80 border border-rose-500/20 rounded-lg p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                MACHINE DOWNTIME ALERT
              </span>
              <span className="font-mono text-zinc-400 text-[11px]">Line 3: Tray Sealer</span>
            </div>
            <p className="text-zinc-300 text-[11px]">
              <strong>42 minutes unplanned stoppage</strong> due to vacuum head thermal drift. Cost impact: ₹5,880 in delayed production.
            </p>
            <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-zinc-800/60">
              Action: Stoppage resolved; sensor recalibrated at 11:45 AM.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Processing Line Performance Matrix Table */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-medium text-zinc-200">Processing Line Live Telemetry & Loss Ledger</h3>
          <span className="text-[11px] font-mono text-zinc-500">3 Processing Lines Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-[11px] text-zinc-500 border-b border-zinc-800/80">
              <tr>
                <th className="py-2.5 px-3">Line & Function</th>
                <th className="py-2.5 px-3">Throughput</th>
                <th className="py-2.5 px-3">Raw Material Loss</th>
                <th className="py-2.5 px-3">Power Draw</th>
                <th className="py-2.5 px-3">Downtime</th>
                <th className="py-2.5 px-3">Line OEE</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {lines.map((l) => (
                <tr key={l.id} className="hover:bg-zinc-800/20 transition">
                  <td className="py-3 px-3">
                    <span className="text-zinc-200 font-medium font-sans block">{l.name}</span>
                    <span className="text-[10px] text-zinc-500">{l.type}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">
                    {l.throughputKgPerHour} kg/h
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${
                      l.materialLossPercent > l.lossBenchmarkPercent ? "text-amber-400" : "text-zinc-300"
                    }`}>
                      {l.materialLossPercent}%
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Benchmark {l.lossBenchmarkPercent}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold ${l.energyAnomaly ? "text-amber-400" : "text-zinc-300"}`}>
                      {l.powerDrawKwh} kWh
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">
                    {l.downtimeMinutesToday} mins
                  </td>
                  <td className="py-3 px-3 font-bold text-zinc-100">
                    {l.oeeScore}%
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      l.status === "OPTIMAL"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : l.status === "WARNING"
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Supply Chain Cost Reduction Breakdown */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Financial Impact & Supply Chain Cost Reduction Ledger
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/60">
            <span className="text-zinc-500 text-[10px] block">Raw Material Yield Savings</span>
            <span className="text-sm font-bold text-zinc-100">₹18,400</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Reduced cutting & trim waste</span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/60">
            <span className="text-zinc-500 text-[10px] block">Procurement Optimization</span>
            <span className="text-sm font-bold text-zinc-100">₹10,220</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Just-in-time perishables</span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/60">
            <span className="text-zinc-500 text-[10px] block">Avoided Machine Downtime</span>
            <span className="text-sm font-bold text-zinc-100">₹8,500</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">Predictive IoT maintenance</span>
          </div>

          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/60">
            <span className="text-zinc-500 text-[10px] block">Zero Landfill Dumping Fees</span>
            <span className="text-sm font-bold text-emerald-400">₹5,380</span>
            <span className="text-[10px] text-zinc-500 block mt-0.5">100% circular diversion</span>
          </div>
        </div>
      </div>
    </div>
  );
}
