// API and WebSocket Client for RescuEats Frontend
import { io } from "socket.io-client";

const API_BASE_URL = "http://localhost:5000/api/v1";

// Initialize singleton Socket.io client
export const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 10,
  reconnectionDelay: 2000
});

export const api = {
  // Health & System status
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  // Inspect food tray image with Multimodal Gemini Vision
  async inspectFood(formData) {
    const res = await fetch(`${API_BASE_URL}/food/inspect`, {
      method: "POST",
      body: formData
    });
    return res.json();
  },

  // Create surplus listing and trigger Autonomous Multi-Agent Dispatch
  async createAndDispatchSurplus(payload) {
    const res = await fetch(`${API_BASE_URL}/surplus/create-and-dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Fetch all active surplus listings
  async getListings() {
    const res = await fetch(`${API_BASE_URL}/surplus/listings`);
    return res.json();
  },

  // Claim surplus with distributed lock
  async claimListing(listingId, ngoId = "ngo-001", volunteerName = "Rohan Verma") {
    const res = await fetch(`${API_BASE_URL}/surplus/${listingId}/claim`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ngoId, volunteerName })
    });
    return res.json();
  },

  // Fetch ESG sustainability report
  async getESGReport() {
    const res = await fetch(`${API_BASE_URL}/esg/report`);
    return res.json();
  },

  // Fetch registered NGOs for Leaflet map
  async getNgos() {
    const res = await fetch(`${API_BASE_URL}/ngos`);
    return res.json();
  },

  // Add new custom NGO
  async addNgo(ngoPayload) {
    const res = await fetch(`${API_BASE_URL}/ngos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ngoPayload)
    });
    return res.json();
  },

  // Interactive IoT sensor control (sliders and presets)
  async setIoTSensors(payload) {
    const res = await fetch(`${API_BASE_URL}/iot/set-sensors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Demo trigger for temperature spike
  async triggerTemperatureSpike(temp = 12.8) {
    const res = await fetch(`${API_BASE_URL}/iot/simulate-spike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temp })
    });
    return res.json();
  }
};
