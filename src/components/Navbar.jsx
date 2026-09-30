import React from "react";
import { UtensilsCrossed, ChefHat, Factory, Truck, BarChart3, Radio, Shield } from "lucide-react";

export function Navbar({ activeTab, setActiveTab, isConnected, criticalAlert }) {
  const navItems = [
    { id: "kitchen", label: "Kitchen Ops", icon: UtensilsCrossed },
    { id: "planning", label: "AI Planning", icon: ChefHat },
    { id: "efficiency", label: "Factory Efficiency", icon: Factory },
    { id: "ngo", label: "Redistribution", icon: Truck },
    { id: "esg", label: "ESG Metrics", icon: BarChart3 },
    { id: "iot", label: "IoT Sensors", icon: Radio }
  ];

  return (
    <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Minimal Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-100">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Rescu<span className="text-emerald-400">Eats</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">v1.0</span>
            </div>
          </div>

          {/* Minimal Tab Switcher */}
          <nav className="flex space-x-1 p-1 rounded-lg bg-zinc-900/60 border border-zinc-800/40">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/40"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Minimal Status Indicator */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {criticalAlert && (
              <span className="px-2 py-0.5 rounded text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Temp Alert
              </span>
            )}
            <div className="flex items-center space-x-1.5 text-zinc-400">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isConnected ? "bg-emerald-400" : "bg-zinc-600"
                }`}
              />
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
