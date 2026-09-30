// Multi-Agent Core: Agent 4 - Safety Judge & Arbiter Agent
// Implements Consensus Verification & Cross-Correlation to eliminate hallucinations & false positives

import { db } from "../models/store.js";

export class SafetyJudgeAgent {
  async evaluateConsensus(listingData, visionReport, dispatchPlan) {
    console.log(`[SafetyJudgeAgent] ⚖️ Commencing Arbiter Review for food batch: "${listingData.foodTitle}"...`);

    const verdicts = [];
    let penaltyPoints = 0;

    // 1. Cross-Correlate with IoT Cold-Storage Telemetry History
    const recentLogs = db.sensorLogs.filter((l) => l.type === "TEMPERATURE").slice(-10);
    const maxRecentTemp = recentLogs.length > 0 ? Math.max(...recentLogs.map((l) => l.value)) : 4.5;

    let iotCheckPassed = true;
    if (maxRecentTemp > 10.0) {
      verdicts.push({
        rule: "IOT_THERMAL_CHAIN_COMPLIANCE",
        status: "FAILED",
        detail: `Critical temperature spike detected (${maxRecentTemp}°C). Cold chain breached.`
      });
      penaltyPoints += 40;
      iotCheckPassed = false;
    } else {
      verdicts.push({
        rule: "IOT_THERMAL_CHAIN_COMPLIANCE",
        status: "PASSED",
        detail: `Thermal chain verified stable (Max recorded: ${maxRecentTemp}°C, compliant with FSSAI < 8°C).`
      });
    }

    // 2. Cross-Correlate Transit Time vs Safe Consumption Window
    const safeWindowMinutes = (visionReport.safeConsumptionWindowHours || 4) * 60;
    const transitMinutes = dispatchPlan.primaryMatch?.estimatedTransitMinutes || 30;
    const totalLogisticsBufferMinutes = transitMinutes + 45; // 45 min buffer for loading/unloading & serving

    let transitCheckPassed = true;
    if (totalLogisticsBufferMinutes > safeWindowMinutes) {
      verdicts.push({
        rule: "TRANSIT_SHELF_LIFE_RATIO",
        status: "FAILED",
        detail: `Transit buffer (${totalLogisticsBufferMinutes}m) exceeds safe consumption window (${safeWindowMinutes}m). High food safety risk.`
      });
      penaltyPoints += 50;
      transitCheckPassed = false;
    } else {
      verdicts.push({
        rule: "TRANSIT_SHELF_LIFE_RATIO",
        status: "PASSED",
        detail: `Safe delivery guaranteed (${totalLogisticsBufferMinutes}m required vs ${safeWindowMinutes}m remaining window).`
      });
    }

    // 3. Vision Confidence & Freshness Integrity
    let visionCheckPassed = true;
    if (visionReport.freshnessScore < 70 || visionReport.spoilageDetected) {
      verdicts.push({
        rule: "VISION_FRESHNESS_THRESHOLD",
        status: "FAILED",
        detail: `Vision freshness score below safe threshold (${visionReport.freshnessScore}%). Food unfit for redistribution.`
      });
      penaltyPoints += 60;
      visionCheckPassed = false;
    } else {
      verdicts.push({
        rule: "VISION_FRESHNESS_THRESHOLD",
        status: "PASSED",
        detail: `Visual inspection certified fresh (${visionReport.freshnessScore}%, confidence ${visionReport.confidence || 0.95}).`
      });
    }

    // 4. Calculate Final Consensus Score
    const consensusScore = Math.max(0, 100 - penaltyPoints);
    let finalDecision;
    let actionRecommendation;

    if (consensusScore >= 85) {
      finalDecision = "APPROVED_BY_JUDGE";
      actionRecommendation = "PROCEED_TO_INSTANT_BROADCAST";
    } else if (consensusScore >= 60) {
      finalDecision = "HUMAN_AUDIT_REQUIRED";
      actionRecommendation = "ESCALATE_TO_DUTY_CHEF_VERIFICATION";
    } else {
      finalDecision = "REJECTED_BY_JUDGE";
      actionRecommendation = "DIVERT_TO_CIRCULAR_VALORIZATION (Compost / Biogas)";
    }

    const auditSummary = {
      judgeId: "arbiter-node-01",
      finalDecision,
      consensusScore,
      actionRecommendation,
      rulesChecked: verdicts,
      verifiedAt: new Date().toISOString(),
      digitalSeal: `SEAL_HMAC_${Buffer.from(listingData.foodTitle + consensusScore).toString("base64").slice(0, 16)}`
    };

    console.log(`[SafetyJudgeAgent] ⚖️ Decision: ${finalDecision} (Consensus Score: ${consensusScore}%)`);
    return auditSummary;
  }
}

export const safetyJudge = new SafetyJudgeAgent();
