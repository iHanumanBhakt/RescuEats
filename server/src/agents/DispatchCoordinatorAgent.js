// Multi-Agent Core: Agent 2 - Autonomous Redistribution Dispatch Agent
// Coordinates spatial matching, shelf-life deadlines, and route prioritization

import { db } from "../models/store.js";

export class DispatchCoordinatorAgent {
  async coordinateDispatch(listing) {
    const { kitchenLocation, quantityKg, estimatedServings, inspection } = listing;
    const [lng, lat] = kitchenLocation || [77.1926, 28.5457];

    console.log(`[DispatchCoordinatorAgent] 🧭 Initiating spatial NGO search around [${lng}, ${lat}]...`);

    // 1. Query verified NGOs within 10 km
    const candidateNgos = db.findNearbyNgos(lng, lat, 10000);

    if (candidateNgos.length === 0) {
      return {
        status: "NO_NEARBY_NGOS_FOUND",
        recommendation: "Divert to secondary circular valorization (Biogas/Composting unit)."
      };
    }

    // 2. Score & prioritize candidate NGOs
    // Scoring criteria: Distance (40%), Capacity match (40%), Shelf-life margin (20%)
    const safeHours = inspection?.safeConsumptionWindowHours || 4;
    const prioritizedMatches = candidateNgos.map((ngo) => {
      const capacityRatio = Math.min(1, ngo.capacityMealsPerDay / estimatedServings);
      const distanceScore = Math.max(0, 1 - ngo.distanceKm / 10);
      const transitSafetyMargin = (safeHours * 60 - ngo.estimatedMinutes) / (safeHours * 60);

      const compositeScore = Math.round((capacityRatio * 0.4 + distanceScore * 0.4 + transitSafetyMargin * 0.2) * 100);

      return {
        ngoId: ngo.id,
        name: ngo.name,
        contactPerson: ngo.contactPerson,
        phone: ngo.phone,
        address: ngo.address,
        distanceKm: ngo.distanceKm,
        estimatedTransitMinutes: ngo.estimatedMinutes,
        capacityMeals: ngo.capacityMealsPerDay,
        priorityScore: compositeScore,
        coordinates: ngo.location.coordinates
      };
    });

    prioritizedMatches.sort((a, b) => b.priorityScore - a.priorityScore);

    const primaryMatch = prioritizedMatches[0];

    return {
      status: "DISPATCH_MATCH_PROPOSED",
      primaryMatch: primaryMatch,
      backupMatches: prioritizedMatches.slice(1, 3),
      totalEligibleNgos: candidateNgos.length,
      estimatedPickupWindowMinutes: Math.max(20, primaryMatch.estimatedTransitMinutes + 15),
      routePolyline: `polyline_encoded_route_${primaryMatch.distanceKm}km`,
      timestamp: new Date().toISOString()
    };
  }
}

export const dispatchAgent = new DispatchCoordinatorAgent();
