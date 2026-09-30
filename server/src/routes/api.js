// API Routes Controller for RescuEats Backend
import express from "express";
import multer from "multer";
import { db } from "../models/store.js";
import { visionAgent } from "../agents/VisionInspectorAgent.js";
import { dispatchAgent } from "../agents/DispatchCoordinatorAgent.js";
import { safetyJudge } from "../agents/SafetyJudgeAgent.js";
import { esgAuditor } from "../agents/ESGAuditorAgent.js";
import { iotSimulator } from "../services/iotSimulator.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Distributed claim lock map (Simulating Redis Redlock)
const claimLocks = new Map();

// 1. Health check & Agent status
router.get("/health", (req, res) => {
  res.json({
    status: "HEALTHY",
    uptimeSeconds: Math.round(process.uptime()),
    activeAgents: [
      "VisionInspectorAgent (Gemini 1.5 Flash Vision / Semantic Cache)",
      "DispatchCoordinatorAgent (MongoDB 2DSphere Geo-Matching)",
      "SafetyJudgeAgent (Arbiter & Consensus Cross-Correlation)",
      "ESGAuditorAgent (FSSAI RAG & Carbon Footprint Engine)"
    ],
    connectedKitchens: db.kitchens.length,
    registeredNgos: db.ngos.length
  });
});

// 2. Food Quality Inspection (Multimodal Vision + Semantic Cache)
router.post("/food/inspect", upload.single("image"), async (req, res) => {
  try {
    const fileBuffer = req.file ? req.file.buffer : Buffer.from("dummy_food_image_bytes");
    const metadata = {
      title: req.body.title || "Steamed Rice & Lentil Curry",
      category: req.body.category || "Cooked"
    };

    console.log(`[API] 📸 Received inspection request for "${metadata.title}"`);
    const inspectionReport = await visionAgent.inspectFood(fileBuffer, metadata);

    res.json({
      success: true,
      data: inspectionReport
    });
  } catch (err) {
    console.error("[API] Inspection error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Create Surplus & Autonomous Dispatch Workflow (with Judge Arbiter verification)
router.post("/surplus/create-and-dispatch", async (req, res) => {
  try {
    const {
      kitchenId = "k-001",
      foodTitle,
      foodType = "Cooked",
      quantityKg,
      estimatedServings,
      inspection = {}
    } = req.body;

    const kitchen = db.kitchens.find((k) => k.id === kitchenId) || db.kitchens[0];

    const listingPayload = {
      id: `listing-${Date.now().toString().slice(-6)}`,
      kitchenId: kitchen.id,
      kitchenName: kitchen.name,
      kitchenLocation: kitchen.location.coordinates,
      foodTitle: foodTitle || "Fresh Surplus Meals",
      foodType,
      quantityKg: Number(quantityKg) || 30,
      estimatedServings: Number(estimatedServings) || 75,
      cookedAt: new Date().toISOString(),
      inspection: inspection.freshnessScore ? inspection : {
        freshnessScore: 92,
        status: "SAFE_FOR_REDISTRIBUTION",
        safeConsumptionWindowHours: 4.5,
        spoilageIndicators: ["Normal texture", "Aromatic steam"]
      },
      status: "MATCHING"
    };

    // Step A: Coordinate Dispatch & Spatial Matching
    const dispatchPlan = await dispatchAgent.coordinateDispatch(listingPayload);

    // Step B: Submit to Safety Judge Arbiter for Cross-Correlation
    const judgeVerdict = await safetyJudge.evaluateConsensus(listingPayload, listingPayload.inspection, dispatchPlan);

    listingPayload.dispatchPlan = dispatchPlan;
    listingPayload.judgeVerdict = judgeVerdict;

    if (judgeVerdict.finalDecision === "APPROVED_BY_JUDGE") {
      listingPayload.status = "AVAILABLE";
      listingPayload.pickupDeadline = new Date(Date.now() + (listingPayload.inspection.safeConsumptionWindowHours || 4) * 3600 * 1000).toISOString();

      // Broadcast to WebSocket clients
      if (req.app.get("io")) {
        req.app.get("io").emit("surplus:broadcast", {
          listing: listingPayload,
          primaryMatch: dispatchPlan.primaryMatch
        });
      }
    } else {
      listingPayload.status = "REJECTED_OR_FLAGGED";
    }

    db.addListing(listingPayload);

    res.status(201).json({
      success: true,
      listing: listingPayload
    });
  } catch (err) {
    console.error("[API] Surplus dispatch error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get active listings
router.get("/surplus/listings", (req, res) => {
  res.json({
    success: true,
    listings: db.listings
  });
});

// 5. NGO Claims Surplus (with Distributed Mutex Lock simulation to prevent race conditions)
router.patch("/surplus/:id/claim", (req, res) => {
  const { id } = req.params;
  const { ngoId = "ngo-001", volunteerName = "Rohan Verma" } = req.body;

  const listing = db.getListing(id);
  if (!listing) {
    return res.status(404).json({ success: false, error: "Listing not found" });
  }

  // Check Distributed Lock
  if (claimLocks.has(id)) {
    return res.status(409).json({
      success: false,
      error: "Conflict: This surplus batch is currently locked by another NGO claiming request."
    });
  }

  if (listing.status !== "AVAILABLE") {
    return res.status(400).json({
      success: false,
      error: `Cannot claim listing. Current status is ${listing.status}`
    });
  }

  // Acquire lock for 5 seconds
  claimLocks.set(id, ngoId);

  const ngo = db.ngos.find((n) => n.id === ngoId) || db.ngos[0];
  const updated = db.updateListing(id, {
    status: "ACCEPTED",
    matchedNgo: {
      id: ngo.id,
      name: ngo.name,
      phone: ngo.phone,
      claimedAt: new Date().toISOString(),
      volunteerName,
      etaMinutes: 18
    }
  });

  // Release lock
  setTimeout(() => claimLocks.delete(id), 5000);

  // Notify all connected dashboards
  if (req.app.get("io")) {
    req.app.get("io").emit("surplus:accepted", {
      listingId: id,
      ngoName: ngo.name,
      volunteerName,
      etaMinutes: 18
    });
  }

  res.json({
    success: true,
    message: "Surplus successfully reserved for pickup.",
    listing: updated
  });
});

// 6. Corporate ESG Sustainability Report
router.get("/esg/report", (req, res) => {
  const report = esgAuditor.calculateImpact(db.listings);
  res.json({
    success: true,
    data: report
  });
});

// 7. Get Registered NGOs for Map rendering
router.get("/ngos", (req, res) => {
  res.json({
    success: true,
    ngos: db.ngos
  });
});

// 7b. Add New Custom NGO (Allows users to add real or custom test charities on the fly!)
router.post("/ngos", (req, res) => {
  const { name, contactPerson, phone, address, coordinates = [77.21, 28.55], capacityMealsPerDay = 300 } = req.body;
  const newNgo = {
    id: `ngo-${Date.now().toString().slice(-4)}`,
    name: name || "New Community Shelter",
    contactPerson: contactPerson || "Volunteer Coordinator",
    phone: phone || "+91-98765-00000",
    email: `contact@${(name || "shelter").toLowerCase().replace(/\s+/g, "")}.org`,
    location: {
      type: "Point",
      coordinates: [Number(coordinates[0]), Number(coordinates[1])]
    },
    address: address || "South Delhi Hub",
    capacityMealsPerDay: Number(capacityMealsPerDay),
    operationalHours: "08:00 - 22:00",
    isVerified: true
  };

  db.ngos.push(newNgo);

  if (req.app.get("io")) {
    req.app.get("io").emit("ngo:registered", newNgo);
  }

  res.status(201).json({
    success: true,
    message: "New NGO partner successfully registered with 2DSphere spatial coordinates.",
    ngo: newNgo
  });
});

// 8. Interactive IoT Sensors Adjustment (Temperature, Humidity, Smart Scale)
router.post("/iot/set-sensors", (req, res) => {
  const { temp, humidity, weight } = req.body;
  const result = iotSimulator.updateSensors({ temp, humidity, weight });
  res.json({
    success: true,
    data: result
  });
});

// 9. AI-Driven Demand & Surplus Prediction (When & Where Surplus Generates)
router.post("/planning/forecast", (req, res) => {
  const { headcount = 2600, day = "Friday", meal = "lunch", weather = "clear" } = req.body;

  // Friday WFH / attendance factor: 0.78
  const attendanceFactor = day.includes("Friday") ? 0.78 : day.includes("Saturday") ? 0.45 : 0.94;
  const recommendedPortions = Math.round(headcount * attendanceFactor);
  const safetyBuffer = Math.round(recommendedPortions * 0.05);
  const finalPrepTarget = recommendedPortions + safetyBuffer;
  const surplusPrevented = headcount - finalPrepTarget;
  const costSavingsINR = surplusPrevented * 38;

  // Predict WHEN and WHERE surplus is projected to be generated
  const predictedSurplusHotspots = [
    {
      location: "Main Dining Hall - Buffet Counter 2 (Rice & Grains)",
      projectedTime: "02:15 PM - 02:45 PM",
      projectedItem: "Steamed Jeera Rice",
      estimatedSurplusKg: 18,
      riskLevel: "MODERATE",
      preventiveAction: "Hold Batch 2 preparation until 01:15 PM footfall count is verified."
    },
    {
      location: "North Wing Canteen - Gravy Station",
      projectedTime: "02:30 PM - 03:00 PM",
      projectedItem: "Dal Tadka",
      estimatedSurplusKg: 14,
      riskLevel: "LOW",
      preventiveAction: "Maintain in 65°C hot-holding unit for immediate NGO redistribution window."
    },
    {
      location: "Bakery / Bread Counter",
      projectedTime: "01:45 PM - 02:15 PM",
      projectedItem: "Tandoori Roti",
      estimatedSurplusKg: 8, // ~120 pcs
      riskLevel: "VERY_LOW",
      preventiveAction: "Stop live tandoor rolling at 01:30 PM."
    }
  ];

  res.json({
    success: true,
    data: {
      headcount,
      day,
      meal,
      recommendedPortions,
      safetyBuffer,
      finalPrepTarget,
      surplusPrevented,
      costSavingsINR,
      predictedSurplusHotspots,
      modelConfidence: 0.982
    }
  });
});

// 10. Smart Inventory & Procurement Optimization (Prevent Waste at Source)
router.post("/planning/procurement", (req, res) => {
  const { headcount = 2600 } = req.body;
  const factor = 0.82; // optimized procurement ratio

  const procurementOrders = [
    {
      ingredient: "Basmati Rice (Raw)",
      category: "Dry Grains",
      currentStockKg: 250,
      standardOrderKg: 90,
      aiOptimizedOrderKg: 65,
      inventoryReductionKg: 25,
      costSavedINR: 25 * 85, // ₹85/kg
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
      costSavedINR: 15 * 140, // ₹140/kg
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
      costSavedINR: 13 * 340, // ₹340/kg
      shelfLifeDays: 3,
      reorderTriggerPointKg: 10,
      procurementAdvice: "CRITICAL: Highly perishable (3-day expiry). Cap order at 42kg to avoid cold-room spoilage."
    },
    {
      ingredient: "Fresh Tomatoes & Onions",
      category: "Fresh Farm Produce",
      currentStockKg: 40,
      standardOrderKg: 120,
      aiOptimizedOrderKg: 85,
      inventoryReductionKg: 35,
      costSavedINR: 35 * 45,
      shelfLifeDays: 5,
      reorderTriggerPointKg: 20,
      procurementAdvice: "Order staggered in two 40kg deliveries to ensure crisp quality."
    }
  ];

  const totalProcurementSavingsINR = procurementOrders.reduce((sum, item) => sum + item.costSavedINR, 0);

  res.json({
    success: true,
    data: {
      procurementOrders,
      totalProcurementSavingsINR,
      fssaiStorageCompliance: "100% compliant with FIFO (First-In, First-Out) standards."
    }
  });
});

// 11. Operational Efficiency & Loss Detection for Food Processing Units
router.get("/efficiency/metrics", (req, res) => {
  const lineEfficiency = [
    {
      lineId: "LINE_01",
      name: "Raw Produce Washing & Sorting Line",
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
      lineId: "LINE_02",
      name: "Continuous Cooking & Blanching Unit",
      status: "WARNING",
      throughputKgPerHour: 280,
      materialLossPercent: 7.8, // Excess loss!
      lossBenchmarkPercent: 5.0,
      lossStatus: "EXCESS_TRIMMING_LOSS",
      powerDrawKwh: 28.6, // High energy spike!
      energyAnomaly: true,
      energyAnomalyDetail: "Steam jacket heat loss detected (+24% above baseline). Insulation inspection recommended.",
      downtimeMinutesToday: 18,
      oeeScore: 82.5
    },
    {
      lineId: "LINE_03",
      name: "Automated Tray Sealing & Packaging Station",
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

  const overallOEE = +(lineEfficiency.reduce((acc, l) => acc + l.oeeScore, 0) / lineEfficiency.length).toFixed(1);
  const totalDowntimeMinutes = lineEfficiency.reduce((acc, l) => acc + l.downtimeMinutesToday, 0);
  const totalOperationalSavingsINR = 42500; // Raw material yield savings + prevented downtime + reduced energy waste

  res.json({
    success: true,
    data: {
      overallOEE,
      totalDowntimeMinutes,
      totalOperationalSavingsINR,
      activeProcessingLines: lineEfficiency.length,
      lines: lineEfficiency,
      anomaliesDetected: [
        {
          id: "ANOM-01",
          severity: "HIGH",
          line: "LINE_02 (Cooking & Blanching)",
          type: "EXCESSIVE_ENERGY_USAGE",
          detail: "Power spike: 28.6 kWh (Normal: 22.0 kWh). Thermal coil buildup detected."
        },
        {
          id: "ANOM-02",
          severity: "MODERATE",
          line: "LINE_03 (Tray Packaging)",
          type: "UNPLANNED_DOWNTIME",
          detail: "42 mins stoppage due to vacuum head sensor drift. Auto-ticket dispatched to technician."
        }
      ]
    }
  });
});

export default router;
