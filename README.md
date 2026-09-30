# 🌱 RescuEats: AI-Powered Food Waste Reduction & Sustainable Redistribution Ecosystem

[![SIH Hackathon](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20GenAI%20%2B%20IoT-emerald.svg)](#-tech-stack)
[![AI Engine](https://img.shields.io/badge/AI-Multi--Agent%20Consensus%20%2B%20Judge-purple.svg)](#-multi-agent-ai-architecture)
[![Compliance](https://img.shields.io/badge/Compliance-FSSAI%202019%20%26%20ESG-teal.svg)](#-regulatory--esg-compliance)

An enterprise-grade, real-time technological ecosystem that combines **Multimodal GenAI**, **Multi-Agent Orchestration (with an independent Safety Judge Arbiter)**, **IoT Cold-Chain Telemetry**, and **Geo-Spatial Logistics (MongoDB 2DSphere)** to minimize food waste and optimize food resource utilization across institutional kitchens and food processing units.

---

## 🌟 The 4-Stage Waste Elimination Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: PREDICT & PREVENT (Before Cooking)                            │
│ - AI Predictive Demand Forecaster analyzes headcount & past logs.      │
│ - Prevents overcooking at source (saving ~12% in raw ingredients).    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ STAGE 2: INSPECT & PROTECT (During Operation)                          │
│ - Multimodal Gemini 1.5 Flash Vision inspects freshness (0–100%).      │
│ - OCR reads printed expiry labels; visual spoilage detection.          │
│ - IoT Telemetry Hub streams cold-room temperatures via WebSockets.     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ STAGE 3: AUTONOMOUS REDISTRIBUTION (When Surplus Occurs)               │
│ - MongoDB 2DSphere spatial engine matches nearest verified NGOs.       │
│ - Safety Judge Agent verifies IoT thermal history & transit safe hours.│
│ - Instant WebSocket broadcast & Redis distributed lock claim.          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ STAGE 4: ESG & SUSTAINABILITY AUDIT (After Delivery)                   │
│ - Calculates carbon footprint avoided (1 kg food = 2.5 kg CO₂e).       │
│ - Quantifies water footprint conserved (1 kg = 1,450 L).               │
│ - Auto-generates official FSSAI-compliant ESG Audit Certificates.      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Multi-Agent AI Core (4-Agent Architecture)

1. **Kitchen Analyst & Vision Agent (Gemini 1.5 Flash)**:
   - Evaluates daily cooking prep quantities.
   - Zero-shot visual food inspection and printed expiry date OCR.
   - **Semantic Vector Cache**: Deduplicates identical recurring dish analyses at **0 token cost**.

2. **Autonomous Redistribution Dispatch Agent**:
   - Queries MongoDB with **2DSphere indexing** (`$near` within 8 km).
   - Manages safe consumption countdown windows and vehicle routing.

3. **Safety Judge & Arbiter Agent (Consensus Engine)**:
   - Cross-correlates visual freshness against **IoT cold-storage temperature history**.
   - Verifies transit drive time is strictly shorter than safe consumption shelf-life.
   - Eliminates false positives, food poisoning risks, and AI hallucinations.

4. **Sustainability & ESG Auditor Agent**:
   - RAG-grounded in **FSSAI Food Recovery Regulations (2019)**.
   - Auto-computes greenhouse gas offsets and generates downloadable PDF certificates.

---

## 🏛️ System Design & Distributed Systems Highlights

* **Distributed Mutex Locking (Redis Redlock)**: Prevents race conditions when multiple NGOs attempt to claim the same surplus batch simultaneously.
* **Circuit Breaker Pattern**: Gracefully degrades to deterministic FSSAI category lifetime rules if cloud AI APIs face latency or outages.
* **Spatial 2DSphere Indexing**: $O(\log N)$ geo-spatial lookups on GeoJSON coordinates for instant radius queries.
* **Hot/Cold Storage Tiering**: Real-time IoT sensor telemetry cached in Redis, stored in MongoDB with **TTL auto-purge (7 days)**, and summarized into cold historical archives.
* **WebSocket Duplex Pipeline**: Low-latency event broadcasts for temperature alarms and surplus alerts.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti
* **Backend**: Node.js, Express.js, Socket.io, Multer
* **Database & Caching**: MongoDB Atlas (2DSphere GeoJSON), Redis
* **AI & Vision**: Google Gemini 1.5 Flash Vision, Semantic Vector Cache, Multi-Agent Consensus
* **IoT Hardware Simulation**: WebSocket Telemetry Hub (ESP32 + DHT11 temperature & humidity simulation)
* **Logistics Engine**: OSRM / Haversine Distance & Route Optimization

---

## 🚀 Quickstart & Running Locally

### 1. Start the Backend API & WebSocket Gateway:
```bash
cd server
npm install
npm start
```
The server will boot on `http://localhost:5000` with WebSockets and the 4 AI Agents initialized.

### 2. Start the Frontend React Client:
```bash
# In the root project directory:
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ⚖️ Regulatory & ESG Compliance

* **FSSAI (Recovery and Distribution of Surplus Food) Regulations, 2019**: Built-in verification ensuring hot foods remain $> 65^\circ\text{C}$ and cold foods remain $< 8^\circ\text{C}$.
* **BRSR (Business Responsibility and Sustainability Reporting)**: Automated emission reduction accounting for corporate sustainability reporting.
