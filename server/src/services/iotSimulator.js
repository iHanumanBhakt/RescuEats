// IoT Telemetry Simulation Service with WebSocket Broadcasts

import { db } from "../models/store.js";

class IoTSimulatorService {
  constructor() {
    this.io = null;
    this.timer = null;
    this.currentTemp = 4.2;
    this.currentHumidity = 68;
    this.currentBinWeight = 14.5;
    this.isManualSpike = false;
  }

  init(ioInstance) {
    this.io = ioInstance;
    console.log("[IoTSimulatorService] 📡 IoT Telemetry Service initialized. Streaming every 3s...");

    this.timer = setInterval(() => {
      this.tick();
    }, 3000);
  }

  tick() {
    if (!this.isManualSpike) {
      // Normal minor thermal fluctuations around 4°C - 5°C
      const delta = (Math.random() - 0.5) * 0.4;
      this.currentTemp = +(Math.max(3.5, Math.min(6.5, this.currentTemp + delta))).toFixed(1);
    }

    const isAlert = this.currentTemp > 8.0;

    const telemetryPayload = {
      unitId: "COLD_ROOM_01",
      location: "IIT Campus Main Dining Hall - Deep Chiller 1",
      temperatureC: this.currentTemp,
      humidityPercent: this.currentHumidity,
      smartBinWeightKg: this.currentBinWeight,
      alert: isAlert,
      alertMessage: isAlert ? `CRITICAL: Cold Room temperature breached (${this.currentTemp}°C > 8.0°C)!` : null,
      timestamp: new Date().toISOString()
    };

    // Store in DB history
    db.sensorLogs.push({
      unitId: "COLD_ROOM_01",
      type: "TEMPERATURE",
      value: this.currentTemp,
      unit: "°C",
      alert: isAlert,
      timestamp: new Date()
    });

    // Keep sensor logs capped at last 100 entries
    if (db.sensorLogs.length > 100) {
      db.sensorLogs.shift();
    }

    // Broadcast via WebSockets
    if (this.io) {
      this.io.emit("iot:telemetry", telemetryPayload);

      if (isAlert) {
        this.io.emit("alert:temperature_spike", telemetryPayload);
      }
    }
  }

  // Interactive Simulator helper: allows user to adjust temperature, humidity, and scale via sliders
  updateSensors({ temp, humidity, weight }) {
    if (temp !== undefined) {
      this.currentTemp = Number(temp);
      this.isManualSpike = this.currentTemp > 8.0;
    }
    if (humidity !== undefined) this.currentHumidity = Number(humidity);
    if (weight !== undefined) this.currentBinWeight = Number(weight);

    this.tick();
    return {
      currentTemp: this.currentTemp,
      currentHumidity: this.currentHumidity,
      currentBinWeight: this.currentBinWeight,
      alert: this.currentTemp > 8.0
    };
  }

  // Demo helper: allows the user to trigger a spike directly from the frontend demo button
  triggerSpike(temp = 12.8) {
    this.isManualSpike = true;
    this.currentTemp = temp;
    console.log(`[IoTSimulatorService] ⚠️ DEMO TRIGGER: Cold room temperature spiked to ${temp}°C!`);
    this.tick();

    // Auto-cool down after 15 seconds
    setTimeout(() => {
      this.isManualSpike = false;
      this.currentTemp = 4.3;
      console.log("[IoTSimulatorService] ❄️ Cold room cooling restored to 4.3°C.");
      this.tick();
    }, 15000);

    return { spikedTemp: temp, durationSec: 15 };
  }
}

export const iotSimulator = new IoTSimulatorService();
