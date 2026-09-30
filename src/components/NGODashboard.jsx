import React, { useState, useEffect } from "react";
import { 
  Truck, MapPin, CheckCircle2, Clock, Lock, PlusCircle, 
  Play, Navigation, Check, ShieldCheck, X 
} from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../services/api";

export function NGODashboard({ listings, onListingClaimed, ngos }) {
  const [selectedNgoId, setSelectedNgoId] = useState("ngo-001");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);

  // Distribution Mission Simulation State
  const [activeSimulation, setActiveSimulation] = useState(null);
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Dispatched, 2: Loaded, 3: In Transit, 4: Delivered
  const [simProgress, setSimProgress] = useState(0);

  // Add NGO Modal State
  const [showAddNgoModal, setShowAddNgoModal] = useState(false);
  const [newNgoName, setNewNgoName] = useState("");
  const [newNgoContact, setNewNgoContact] = useState("");
  const [newNgoPhone, setNewNgoPhone] = useState("+91-98765-43210");
  const [newNgoAddress, setNewNgoAddress] = useState("");
  const [newNgoCapacity, setNewNgoCapacity] = useState("450");
  const [newNgoLng, setNewNgoLng] = useState("77.2150");
  const [newNgoLat, setNewNgoLat] = useState("28.5300");

  const availableListings = listings.filter((l) => l.status === "AVAILABLE");
  const acceptedListings = listings.filter((l) => l.status === "ACCEPTED");

  // Handle claiming surplus
  const handleClaim = async (listingId) => {
    setIsClaiming(true);
    setClaimError(null);

    try {
      const res = await api.claimListing(listingId, selectedNgoId, "Volunteer Driver #DL-04");
      if (res.success) {
        onListingClaimed(res.listing);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } else {
        setClaimError(res.error || "Failed to claim listing.");
      }
    } catch (err) {
      setClaimError("Network error during claim.");
    } finally {
      setIsClaiming(false);
    }
  };

  // Run Distribution Mission Simulator
  const startDistributionSimulation = (listing) => {
    setActiveSimulation(listing);
    setSimStep(1);
    setSimProgress(15);

    // Step 2: Driver arriving & loading (after 2s)
    setTimeout(() => {
      setSimStep(2);
      setSimProgress(45);
    }, 2500);

    // Step 3: Out for delivery / in transit (after 5s)
    setTimeout(() => {
      setSimStep(3);
      setSimProgress(75);
    }, 5000);

    // Step 4: Successfully delivered & verified (after 8s)
    setTimeout(() => {
      setSimStep(4);
      setSimProgress(100);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 8000);
  };

  // Handle adding custom NGO
  const handleAddNgo = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newNgoName || "Pratham Community Kitchen",
        contactPerson: newNgoContact || "Neha Sharma",
        phone: newNgoPhone,
        address: newNgoAddress || "Green Park Extension, New Delhi",
        coordinates: [Number(newNgoLng), Number(newNgoLat)],
        capacityMealsPerDay: Number(newNgoCapacity)
      };

      const res = await api.addNgo(payload);
      if (res.success) {
        setShowAddNgoModal(false);
        setNewNgoName("");
        setNewNgoAddress("");
        alert(`Registered: ${payload.name} added to live geo-spatial map!`);
        window.location.reload(); // Refresh to populate in list
      }
    } catch (err) {
      console.error("Add NGO error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with "Add NGO" Action */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-1">
            <Truck className="h-4 w-4" />
            <span>Redistribution & Logistics Command</span>
          </div>
          <h2 className="text-base font-semibold text-zinc-100">Surplus Food Dispatch & Mission Simulator</h2>
          <p className="text-xs text-zinc-400">
            Real-time surplus claims protected by Redis Mutex Locking with live delivery simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 font-mono">Viewing As:</span>
            <select
              value={selectedNgoId}
              onChange={(e) => setSelectedNgoId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
            >
              {ngos.map((ngo) => (
                <option key={ngo.id} value={ngo.id}>
                  {ngo.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddNgoModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span>+ Add NGO Partner</span>
          </button>
        </div>
      </div>

      {claimError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono">
          {claimError}
        </div>
      )}

      {/* 2. Interactive Live Delivery Mission Simulator (NEW!) */}
      <div className="bg-zinc-900/60 border border-zinc-700/80 rounded-xl p-5 space-y-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Navigation className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Interactive Distribution Mission Simulator</h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {activeSimulation ? "Mission In-Progress" : "Ready to Simulate"}
          </span>
        </div>

        {/* Stepper Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-700 ease-out"
              style={{ width: `${simProgress}%` }}
            />
          </div>

          {/* Stepper Labels */}
          <div className="grid grid-cols-4 text-center text-[10px] font-mono pt-1">
            <div className={`space-y-0.5 ${simStep >= 1 ? "text-emerald-400 font-bold" : "text-zinc-600"}`}>
              <span>1. Dispatched</span>
              <span className="block text-[9px] text-zinc-500 font-normal">Van #DL-04 Leaves Base</span>
            </div>
            <div className={`space-y-0.5 ${simStep >= 2 ? "text-emerald-400 font-bold" : "text-zinc-600"}`}>
              <span>2. Arrived & Loaded</span>
              <span className="block text-[9px] text-zinc-500 font-normal">Temp Checked (4.8°C)</span>
            </div>
            <div className={`space-y-0.5 ${simStep >= 3 ? "text-cyan-400 font-bold" : "text-zinc-600"}`}>
              <span>3. Out for Delivery</span>
              <span className="block text-[9px] text-zinc-500 font-normal">Live GPS Transit (18m)</span>
            </div>
            <div className={`space-y-0.5 ${simStep >= 4 ? "text-emerald-400 font-bold" : "text-zinc-600"}`}>
              <span>4. Delivered & Served</span>
              <span className="block text-[9px] text-zinc-500 font-normal">Verified by Shelter</span>
            </div>
          </div>
        </div>

        {/* Simulation Details & Trigger Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 text-xs">
          <div className="text-zinc-300">
            {activeSimulation ? (
              <span className="font-mono">
                Simulating: <strong>{activeSimulation.foodTitle}</strong> ({activeSimulation.quantityKg}kg) $\rightarrow$ {activeSimulation.matchedNgo?.name || "Local Shelter"}
              </span>
            ) : (
              <span className="text-zinc-400 font-mono text-[11px]">
                Select a claimed batch below or click run to simulate full pickup-to-delivery lifecycle.
              </span>
            )}
          </div>

          <button
            onClick={() => startDistributionSimulation(acceptedListings[0] || listings[0])}
            disabled={simStep > 0 && simStep < 4}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold text-xs font-mono transition self-start sm:self-auto disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            <span>{simStep === 4 ? "Restart Mission Simulation" : "Run Live Transit Simulation"}</span>
          </button>
        </div>
      </div>

      {/* 3. Grid: Available Batches & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feed */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <h3 className="font-medium text-zinc-300">Available Batches ({availableListings.length})</h3>
            <span className="text-zinc-500 font-mono text-[11px]">WebSocket Live Feed</span>
          </div>

          {availableListings.length === 0 ? (
            <div className="bg-zinc-900/20 border border-zinc-800/60 rounded-xl p-8 text-center text-xs text-zinc-500">
              No unclaimed surplus batches available currently.
            </div>
          ) : (
            availableListings.map((l) => (
              <div
                key={l.id}
                className="bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-4 space-y-3 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide">
                      {l.foodType}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-100">{l.foodTitle}</h4>
                    <p className="text-xs text-zinc-500">{l.kitchenName}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-bold text-zinc-100 block">{l.quantityKg} kg</span>
                    <span className="text-[11px] text-zinc-500">~{l.estimatedServings} meals</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/40">
                  <div className="text-zinc-400">
                    Freshness: <span className="text-emerald-400">{l.inspection?.freshnessScore}%</span>
                  </div>
                  <div className="text-zinc-400">
                    Safe Window: <span className="text-zinc-200">{l.inspection?.safeConsumptionWindowHours}h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1 text-[11px] text-zinc-500 font-mono">
                    <Lock className="h-3 w-3 text-zinc-600" />
                    <span>Mutex Protected</span>
                  </div>

                  <button
                    onClick={() => handleClaim(l.id)}
                    disabled={isClaiming}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium text-xs transition"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>Claim Batch</span>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Active Pickups */}
          {acceptedListings.length > 0 && (
            <div className="pt-3 space-y-2">
              <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Claimed Pickups ({acceptedListings.length})
              </h3>
              {acceptedListings.map((l) => (
                <div key={l.id} className="bg-zinc-900/30 border border-zinc-800/60 rounded-lg p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-200 font-medium block">{l.foodTitle}</span>
                    <span className="text-zinc-500 text-[11px]">{l.matchedNgo?.name}</span>
                  </div>
                  <button
                    onClick={() => startDistributionSimulation(l)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-mono text-[11px] transition"
                  >
                    <Play className="h-3 w-3" />
                    <span>Simulate Delivery</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Proximity Map Overview */}
        <div className="lg:col-span-6 bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-medium text-zinc-200">Registered NGO Hubs & Spatial Radius</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">MongoDB 2DSphere</span>
          </div>

          <div className="bg-zinc-950/60 rounded-lg border border-zinc-800/60 p-3 space-y-2">
            <div className="text-[11px] text-zinc-500 pb-1 border-b border-zinc-800/40 flex justify-between">
              <span>Center: IIT Campus Dining Hall (Source)</span>
              <span className="text-emerald-400 font-mono">8 km Active Geofence</span>
            </div>

            {ngos.map((ngo, idx) => (
              <div
                key={ngo.id}
                className="flex items-center justify-between p-2 rounded bg-zinc-900/40 hover:bg-zinc-900/80 text-xs transition"
              >
                <div>
                  <span className="text-zinc-200 font-medium block">{ngo.name}</span>
                  <span className="text-zinc-500 text-[10px]">{ngo.address}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 text-xs block">{(idx + 1) * 2.2} km</span>
                  <span className="text-zinc-600 text-[10px]">~{(idx + 1) * 7} mins transit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Add New NGO Partner Modal (NEW!) */}
      {showAddNgoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <PlusCircle className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Register New NGO Partner</h3>
              </div>
              <button onClick={() => setShowAddNgoModal(false)} className="text-zinc-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddNgo} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Organization / Shelter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hope Child Care Foundation"
                  value={newNgoName}
                  onChange={(e) => setNewNgoName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Contact Coordinator Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Patel"
                  value={newNgoContact}
                  onChange={(e) => setNewNgoContact(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Address / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vasant Kunj Sector C, New Delhi"
                  value={newNgoAddress}
                  onChange={(e) => setNewNgoAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1">Daily Meal Capacity</label>
                  <input
                    type="number"
                    value={newNgoCapacity}
                    onChange={(e) => setNewNgoCapacity(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newNgoPhone}
                    onChange={(e) => setNewNgoPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <label className="text-zinc-500 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newNgoLng}
                    onChange={(e) => setNewNgoLng(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newNgoLat}
                    onChange={(e) => setNewNgoLat(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-zinc-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddNgoModal(false)}
                  className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold"
                >
                  Save & Index Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
