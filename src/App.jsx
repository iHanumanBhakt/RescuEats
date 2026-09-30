import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { KitchenDashboard } from "./components/KitchenDashboard";
import { PrepPlanningDashboard } from "./components/PrepPlanningDashboard";
import { OperationalEfficiencyDashboard } from "./components/OperationalEfficiencyDashboard";
import { NGODashboard } from "./components/NGODashboard";
import { ESGDashboard } from "./components/ESGDashboard";
import { IoTTelemetryPanel } from "./components/IoTTelemetryPanel";
import { socket, api } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("planning"); // Default to detailed planning view for user
  const [isConnected, setIsConnected] = useState(false);
  const [listings, setListings] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [iotData, setIotData] = useState(null);
  const [criticalAlert, setCriticalAlert] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchInitialData();

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("iot:telemetry", (data) => {
      setIotData(data);
      setCriticalAlert(Boolean(data.alert));
    });

    socket.on("surplus:broadcast", ({ listing, primaryMatch }) => {
      setListings((prev) => [listing, ...prev.filter((l) => l.id !== listing.id)]);
      showNotification(`Surplus batch (${listing.quantityKg}kg) dispatched to ${primaryMatch?.name || "nearby shelters"}.`);
    });

    socket.on("surplus:accepted", ({ listingId, ngoName, volunteerName, etaMinutes }) => {
      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId
            ? { ...l, status: "ACCEPTED", matchedNgo: { name: ngoName, volunteerName, etaMinutes } }
            : l
        )
      );
      showNotification(`Pickup confirmed by ${ngoName} (ETA ~${etaMinutes}m).`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("iot:telemetry");
      socket.off("surplus:broadcast");
      socket.off("surplus:accepted");
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [listingsRes, ngosRes] = await Promise.all([
        api.getListings(),
        api.getNgos()
      ]);
      if (listingsRes.success) setListings(listingsRes.listings);
      if (ngosRes.success) setNgos(ngosRes.ngos);
    } catch (err) {
      console.warn("Using offline fallback:", err);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSurplusCreated = (newListing) => {
    setListings((prev) => [newListing, ...prev.filter((l) => l.id !== newListing.id)]);
    showNotification(`Surplus batch validated by Safety Judge and published.`);
  };

  const handleListingClaimed = (updatedListing) => {
    setListings((prev) =>
      prev.map((l) => (l.id === updatedListing.id ? updatedListing : l))
    );
    showNotification(`Pickup confirmed for ${updatedListing.matchedNgo?.name}.`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isConnected={isConnected}
        criticalAlert={criticalAlert}
      />

      {/* Minimal Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "planning" && <PrepPlanningDashboard />}

        {activeTab === "efficiency" && <OperationalEfficiencyDashboard />}

        {activeTab === "kitchen" && (
          <KitchenDashboard
            listings={listings}
            onSurplusCreated={handleSurplusCreated}
            iotData={iotData}
          />
        )}

        {activeTab === "ngo" && (
          <NGODashboard
            listings={listings}
            onListingClaimed={handleListingClaimed}
            ngos={ngos}
          />
        )}

        {activeTab === "esg" && <ESGDashboard />}

        {activeTab === "iot" && (
          <IoTTelemetryPanel
            iotData={iotData}
            criticalAlert={criticalAlert}
          />
        )}
      </main>

      <footer className="border-t border-zinc-900 py-4 text-center text-[11px] text-zinc-600 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <span>RescuEats • SIH 2026</span>
          <span>MERN + Multimodal Vision + Multi-Agent Consensus</span>
        </div>
      </footer>
    </div>
  );
}
