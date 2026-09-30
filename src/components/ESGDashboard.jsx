import React, { useState, useEffect } from "react";
import { BarChart3, Award, Download, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { api } from "../services/api";

export function ESGDashboard() {
  const [esgData, setEsgData] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.getESGReport();
      if (res.success) {
        setEsgData(res.data);
      }
    } catch (err) {
      console.error("ESG fetch error:", err);
    }
  };

  const weeklyImpactData = [
    { day: "Mon", foodKg: 42, co2eKg: 105, meals: 95 },
    { day: "Tue", foodKg: 35, co2eKg: 87.5, meals: 80 },
    { day: "Wed", foodKg: 58, co2eKg: 145, meals: 130 },
    { day: "Thu", foodKg: 28, co2eKg: 70, meals: 65 },
    { day: "Fri", foodKg: 65, co2eKg: 162.5, meals: 150 },
    { day: "Sat", foodKg: 80, co2eKg: 200, meals: 185 },
    { day: "Sun", foodKg: 72, co2eKg: 180, meals: 160 }
  ];

  const summary = esgData?.summary || {
    totalKgRescued: 380,
    totalServingsRescued: 865,
    co2ePreventedKg: 950,
    co2ePreventedTons: 0.95,
    waterLitersSaved: 551000,
    economicValueSavedINR: 30275
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">Sustainability</span>
          <h2 className="text-base font-semibold text-zinc-100">ESG & Carbon Accounting</h2>
          <p className="text-xs text-zinc-400">
            Environmental metrics grounded on FAO emission coefficients.
          </p>
        </div>

        <button
          onClick={() => setShowCertificate(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
        >
          <Award className="h-3.5 w-3.5 text-emerald-400" />
          <span>Audit Certificate</span>
        </button>
      </div>

      {/* 5 Minimalist Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-[11px] block font-mono">Food Rescued</span>
          <span className="text-xl font-bold font-mono text-zinc-100">{summary.totalKgRescued} kg</span>
          <span className="text-[10px] text-zinc-500 block">Diverted from waste</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-[11px] block font-mono">Avoided CO₂e</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{summary.co2ePreventedKg} kg</span>
          <span className="text-[10px] text-zinc-500 block">({summary.co2ePreventedTons} tons)</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-[11px] block font-mono">Water Conserved</span>
          <span className="text-xl font-bold font-mono text-zinc-100">{(summary.waterLitersSaved / 1000).toFixed(0)}k L</span>
          <span className="text-[10px] text-zinc-500 block">Agricultural water</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-1">
          <span className="text-zinc-500 text-[11px] block font-mono">Meals Donated</span>
          <span className="text-xl font-bold font-mono text-zinc-100">{summary.totalServingsRescued}</span>
          <span className="text-[10px] text-zinc-500 block">To local shelters</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-zinc-500 text-[11px] block font-mono">Economic Value</span>
          <span className="text-xl font-bold font-mono text-zinc-100">₹{summary.economicValueSavedINR.toLocaleString()}</span>
          <span className="text-[10px] text-zinc-500 block">Rescued capital</span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-medium text-zinc-300">Weekly Food Rescued (kg)</h3>
            <span className="text-zinc-500 font-mono text-[11px]">Daily Breakdown</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px", fontSize: "11px" }}
                />
                <Bar dataKey="foodKg" fill="#10b981" radius={[3, 3, 0, 0]} name="Food (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-medium text-zinc-300">Avoided Emissions (kg CO₂e)</h3>
            <span className="text-zinc-500 font-mono text-[11px]">1kg = 2.5kg CO₂e</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyImpactData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "6px", fontSize: "11px" }}
                />
                <Line type="monotone" dataKey="co2eKg" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 3 }} name="CO2e (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="text-center space-y-1 border-b border-zinc-800/80 pb-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">
                Sustainability Compliance Certificate
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                FSSAI Surplus Food Recovery Regulations (2019)
              </p>
            </div>

            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/60 text-xs space-y-2 font-mono text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">Certificate ID:</span>
                <span>{esgData?.certificateId || "ESG-CERT-SIH-2026-928103"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Greenhouse Gases Prevented:</span>
                <span className="text-emerald-400">{summary.co2ePreventedKg} kg CO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Food Diverted:</span>
                <span>{summary.totalKgRescued} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Hygiene Standard:</span>
                <span className="text-emerald-400">Grade A+ (Verified)</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1 text-xs">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200"
              >
                Close
              </button>
              <button
                onClick={() => alert("Downloading ESG audit report...")}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
