import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Simulation Data & Types ---

interface Bus {
  id: string;
  routeId: string;
  lat: number;
  lng: number;
  speed: number;
  passengers: number;
  capacity: number;
  nextStop: string;
  status: "moving" | "stopped" | "idle";
  heading: number;
}

interface Route {
  id: string;
  name: string;
  color: string;
  path: [number, number][]; // [lng, lat] for Mapbox/GeoJSON
  stops: string[];
}

interface DemandPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
}

interface Recommendation {
  id: string;
  type: "add" | "remove" | "reroute";
  routeId: string;
  amount?: number;
  reason: string;
  confidence: number;
  timestamp: number;
}

interface SystemMetrics {
  activeBuses: number;
  routesActive: number;
  passengersToday: number;
  avgWaitTime: number;
  predictionAccuracy: number;
  serverStatus: "Online" | "Offline" | "Degraded";
  efficiency: {
    waitTimeReduction: number;
    fleetUtilization: number;
    fuelSavings: number;
  };
}

// --- Initial State ---

const CENTER_LAT = 37.7749;
const CENTER_LNG = -122.4194;

const ROUTES: Route[] = [
  {
    id: "R1",
    name: "Route A (Downtown)",
    color: "#5A8DEE", // Soft Blue
    path: [
      [-122.4194, 37.7749],
      [-122.4220, 37.7760],
      [-122.4250, 37.7780],
      [-122.4300, 37.7800],
      [-122.4350, 37.7820],
    ],
    stops: ["Central Station", "Market St", "Civic Center", "Van Ness", "Polk St"],
  },
  {
    id: "R2",
    name: "Route B (University)",
    color: "#7ED6C2", // Soft Mint Dark
    path: [
      [-122.4194, 37.7749],
      [-122.4150, 37.7700],
      [-122.4100, 37.7650],
      [-122.4050, 37.7600],
    ],
    stops: ["Central Station", "Mission St", "16th St", "Potrero Hill"],
  },
  {
    id: "R3",
    name: "Route C (Business Park)",
    color: "#B8A9EE", // Soft Lavender Dark
    path: [
      [-122.4194, 37.7749],
      [-122.4100, 37.7800],
      [-122.4000, 37.7850],
      [-122.3900, 37.7900],
    ],
    stops: ["Central Station", "Financial Dist", "Embarcadero", "Pier 39"],
  },
];

let buses: Bus[] = [];
let demandHeatmap: DemandPoint[] = [];
let recommendations: Recommendation[] = [];
let metrics: SystemMetrics = {
  activeBuses: 48,
  routesActive: 12,
  passengersToday: 18450,
  avgWaitTime: 6.2,
  predictionAccuracy: 87,
  serverStatus: "Online",
  efficiency: {
    waitTimeReduction: 24,
    fleetUtilization: 82,
    fuelSavings: 17,
  },
};

// Initialize Buses
ROUTES.forEach((route) => {
  for (let i = 0; i < 3; i++) {
    const startIdx = Math.floor(Math.random() * (route.path.length - 1));
    const [lng, lat] = route.path[startIdx];
    buses.push({
      id: `B${Math.floor(Math.random() * 1000)}`,
      routeId: route.id,
      lat,
      lng,
      speed: 20 + Math.random() * 20,
      passengers: Math.floor(Math.random() * 50),
      capacity: 60,
      nextStop: route.stops[Math.floor(Math.random() * route.stops.length)],
      status: "moving",
      heading: Math.random() * 360,
    });
  }
});

// Initialize Demand
for (let i = 0; i < 20; i++) {
  demandHeatmap.push({
    lat: CENTER_LAT + (Math.random() - 0.5) * 0.05,
    lng: CENTER_LNG + (Math.random() - 0.5) * 0.05,
    intensity: Math.random(),
  });
}

// --- Simulation Logic ---

function updateSimulation() {
  // Update Bus Positions (Simple jitter for demo)
  buses = buses.map((bus) => {
    const route = ROUTES.find((r) => r.id === bus.routeId);
    if (!route) return bus;

    // Move slightly along the route or random jitter if simple
    // For this demo, we'll just jitter them around their current position to simulate movement
    // A real path follower is complex for a single file demo
    const moveLat = (Math.random() - 0.5) * 0.0005;
    const moveLng = (Math.random() - 0.5) * 0.0005;

    return {
      ...bus,
      lat: bus.lat + moveLat,
      lng: bus.lng + moveLng,
      speed: Math.max(0, Math.min(60, bus.speed + (Math.random() - 0.5) * 5)),
      passengers: Math.max(0, Math.min(bus.capacity, bus.passengers + Math.floor((Math.random() - 0.5) * 5))),
    };
  });

  // Update Demand
  demandHeatmap = demandHeatmap.map((p) => ({
    ...p,
    intensity: Math.max(0, Math.min(1, p.intensity + (Math.random() - 0.5) * 0.1)),
  }));

  // Update Metrics
  metrics.passengersToday += Math.floor(Math.random() * 5);
  metrics.avgWaitTime = Math.max(2, Math.min(15, metrics.avgWaitTime + (Math.random() - 0.5) * 0.1));
  metrics.efficiency.fleetUtilization = Math.max(50, Math.min(100, metrics.efficiency.fleetUtilization + (Math.random() - 0.5) * 2));

  // Generate Recommendations randomly
  if (Math.random() > 0.8) {
    const types: ("add" | "remove" | "reroute")[] = ["add", "remove", "reroute"];
    const type = types[Math.floor(Math.random() * types.length)];
    const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
    
    const newRec: Recommendation = {
      id: Date.now().toString(),
      type,
      routeId: route.id,
      amount: type === "reroute" ? undefined : Math.ceil(Math.random() * 2),
      reason: type === "add" ? "High demand detected" : type === "remove" ? "Low utilization" : "Traffic congestion avoidance",
      confidence: 80 + Math.floor(Math.random() * 19),
      timestamp: Date.now(),
    };
    
    recommendations.unshift(newRec);
    if (recommendations.length > 5) recommendations.pop();
  }
}

// --- Server Setup ---

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", metrics });
  });

  app.get("/api/routes", (req, res) => {
    res.json(ROUTES);
  });

  // Socket.io
  io.on("connection", (socket) => {
    console.log("Client connected");
    
    // Send initial state
    socket.emit("init", {
      buses,
      routes: ROUTES,
      demand: demandHeatmap,
      metrics,
      recommendations,
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Start Simulation Loop
  setInterval(() => {
    updateSimulation();
    io.emit("update", {
      buses,
      demand: demandHeatmap,
      metrics,
      recommendations,
    });
  }, 3000);

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving (if needed, but mainly for dev here)
    app.use(express.static(path.join(__dirname, "dist")));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
