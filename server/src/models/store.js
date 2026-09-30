// In-memory & Persistent Geo-Spatial Data Store with MongoDB-compatible Query semantics

class DataStore {
  constructor() {
    this.kitchens = [];
    this.ngos = [];
    this.listings = [];
    this.sensorLogs = [];
    this.initSeedData();
  }

  initSeedData() {
    // Seed Kitchens (Institutional canteens & processing units)
    this.kitchens = [
      {
        id: "k-001",
        name: "IIT Campus Main Dining Hall",
        type: "Institutional Kitchen",
        manager: "Chef Rajesh Sharma",
        phone: "+91-98112-34567",
        location: {
          type: "Point",
          coordinates: [77.1926, 28.5457] // Hauz Khas, New Delhi [lng, lat]
        },
        address: "Hauz Khas, New Delhi, Delhi 110016",
        dailyAvgHeadcount: 2400,
        coldStorageCapacityKg: 1200,
        activeStorageTempC: 4.2
      },
      {
        id: "k-002",
        name: "CyberTech Hub Mega Cafeteria",
        type: "Corporate Canteen",
        manager: "Sunita Verma",
        phone: "+91-98765-43210",
        location: {
          type: "Point",
          coordinates: [77.0878, 28.4952] // DLF Cyber City, Gurugram
        },
        address: "Cyber City, DLF Phase 2, Gurugram, Haryana 122002",
        dailyAvgHeadcount: 4500,
        coldStorageCapacityKg: 2000,
        activeStorageTempC: 5.1
      }
    ];

    // Seed Verified NGOs and Shelters with 2DSphere Geo-coordinates
    this.ngos = [
      {
        id: "ngo-001",
        name: "Robin Hood Army - South Delhi Chapter",
        contactPerson: "Aarav Kapoor",
        phone: "+91-99887-11223",
        email: "southdelhi@robinhoodarmy.com",
        location: {
          type: "Point",
          coordinates: [77.2065, 28.5355] // Saket, New Delhi (~2.5 km from IIT)
        },
        address: "Community Center, Saket, New Delhi",
        capacityMealsPerDay: 400,
        operationalHours: "08:00 - 23:00",
        isVerified: true
      },
      {
        id: "ngo-002",
        name: "Goonj Community Food Rescue Base",
        contactPerson: "Priya Menon",
        phone: "+91-98101-55443",
        email: "food@goonj.org",
        location: {
          type: "Point",
          coordinates: [77.1650, 28.5240] // Mehrauli (~4.2 km from IIT)
        },
        address: "Madanpur Khadar Extension / Sarita Vihar, New Delhi",
        capacityMealsPerDay: 600,
        operationalHours: "07:00 - 22:00",
        isVerified: true
      },
      {
        id: "ngo-003",
        name: "Feeding India by Zomato - Hub 4",
        contactPerson: "Vikram Das",
        phone: "+91-97112-99881",
        email: "hub4@feedingindia.org",
        location: {
          type: "Point",
          coordinates: [77.2280, 28.5680] // Lajpat Nagar (~5.8 km from IIT)
        },
        address: "Lajpat Nagar IV, New Delhi",
        capacityMealsPerDay: 850,
        operationalHours: "09:00 - 23:30",
        isVerified: true
      },
      {
        id: "ngo-004",
        name: "Hope Foundation Shelter & Langar",
        contactPerson: "Harpreet Singh",
        phone: "+91-98114-66772",
        email: "hope@foundationdelhi.org",
        location: {
          type: "Point",
          coordinates: [77.2410, 28.5920] // Nizamuddin (~7.5 km from IIT)
        },
        address: "Near Lodhi Road, New Delhi",
        capacityMealsPerDay: 350,
        operationalHours: "08:00 - 21:00",
        isVerified: true
      }
    ];

    // Seed initial active food listings
    this.listings = [
      {
        id: "listing-001",
        kitchenId: "k-001",
        kitchenName: "IIT Campus Main Dining Hall",
        kitchenLocation: [77.1926, 28.5457],
        foodTitle: "Steamed Basmati Rice & Dal Tadka",
        foodType: "Cooked",
        quantityKg: 45,
        estimatedServings: 110,
        cookedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        inspection: {
          freshnessScore: 94,
          status: "SAFE_FOR_REDISTRIBUTION",
          spoilageDetected: false,
          safeConsumptionWindowHours: 4.5,
          spoilageIndicators: ["Optimal aroma", "Normal texture", "No thermal abuse detected"],
          inspectedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        judgeVerdict: {
          status: "APPROVED_BY_JUDGE",
          consensusScore: 98,
          iotTempCheck: "PASSED (Cold Room avg 4.2°C)",
          transitSafetyCheck: "PASSED (Max transit 25 mins < 4.5h shelf-life)",
          timestamp: new Date().toISOString()
        },
        status: "AVAILABLE", // AVAILABLE, MATCHING, ACCEPTED, PICKED_UP, DELIVERED
        matchedNgo: null,
        pickupDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Initial sensor readings
    this.sensorLogs = [
      { unitId: "COLD_ROOM_01", type: "TEMPERATURE", value: 4.2, unit: "°C", alert: false, timestamp: new Date() },
      { unitId: "COLD_ROOM_01", type: "HUMIDITY", value: 68, unit: "%", alert: false, timestamp: new Date() },
      { unitId: "SMART_BIN_01", type: "BIN_SCALE", value: 12.4, unit: "kg", alert: false, timestamp: new Date() }
    ];
  }

  // Haversine formula to simulate MongoDB 2DSphere $near query with high accuracy
  findNearbyNgos(longitude, latitude, maxDistanceMeters = 8000) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters

    const matches = this.ngos.map((ngo) => {
      const [ngoLng, ngoLat] = ngo.location.coordinates;
      const dLat = toRad(ngoLat - latitude);
      const dLon = toRad(ngoLng - longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(latitude)) * Math.cos(toRad(ngoLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceMeters = R * c;

      return {
        ...ngo,
        distanceMeters: Math.round(distanceMeters),
        distanceKm: +(distanceMeters / 1000).toFixed(2),
        estimatedMinutes: Math.round((distanceMeters / 1000) * 4.5) // ~25 km/h urban city transit
      };
    });

    return matches
      .filter((n) => n.distanceMeters <= maxDistanceMeters && n.isVerified)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  addListing(listing) {
    this.listings.unshift(listing);
    return listing;
  }

  getListing(id) {
    return this.listings.find((l) => l.id === id);
  }

  updateListing(id, updates) {
    const index = this.listings.findIndex((l) => l.id === id);
    if (index !== -1) {
      this.listings[index] = { ...this.listings[index], ...updates };
      return this.listings[index];
    }
    return null;
  }
}

export const db = new DataStore();
