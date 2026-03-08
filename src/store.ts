import { create } from 'zustand';
import { AppState, Station, Bus, Route, DemandPoint, SimulationState } from './types';

// Pune Stations Data
const STATIONS: Station[] = [
  { id: 's1', name: 'Pune Railway Station', lat: 18.5284, lng: 73.8739, daily_passenger_avg: 5000, zone_type: 'commercial', current_demand: 0, predicted_demand: 0 },
  { id: 's2', name: 'Shivajinagar Bus Stand', lat: 18.5314, lng: 73.8446, daily_passenger_avg: 4500, zone_type: 'commercial', current_demand: 0, predicted_demand: 0 },
  { id: 's3', name: 'Swargate Bus Depot', lat: 18.5018, lng: 73.8636, daily_passenger_avg: 4800, zone_type: 'commercial', current_demand: 0, predicted_demand: 0 },
  { id: 's4', name: 'Deccan Gymkhana', lat: 18.5158, lng: 73.8422, daily_passenger_avg: 3500, zone_type: 'commercial', current_demand: 0, predicted_demand: 0 },
  { id: 's5', name: 'Katraj', lat: 18.4575, lng: 73.8584, daily_passenger_avg: 3000, zone_type: 'residential', current_demand: 0, predicted_demand: 0 },
  { id: 's6', name: 'Hadapsar', lat: 18.5089, lng: 73.9259, daily_passenger_avg: 3200, zone_type: 'residential', current_demand: 0, predicted_demand: 0 },
  { id: 's7', name: 'Viman Nagar', lat: 18.5679, lng: 73.9143, daily_passenger_avg: 2800, zone_type: 'it_hub', current_demand: 0, predicted_demand: 0 },
  { id: 's8', name: 'Kothrud Depot', lat: 18.5039, lng: 73.8076, daily_passenger_avg: 2500, zone_type: 'residential', current_demand: 0, predicted_demand: 0 },
  { id: 's9', name: 'Baner', lat: 18.5590, lng: 73.7868, daily_passenger_avg: 2200, zone_type: 'residential', current_demand: 0, predicted_demand: 0 },
  { id: 's10', name: 'Wakad', lat: 18.5987, lng: 73.7658, daily_passenger_avg: 2000, zone_type: 'residential', current_demand: 0, predicted_demand: 0 },
  { id: 's11', name: 'Aundh', lat: 18.5635, lng: 73.8072, daily_passenger_avg: 2400, zone_type: 'residential', current_demand: 0, predicted_demand: 0 },
  { id: 's12', name: 'Hinjewadi Phase 1', lat: 18.5913, lng: 73.7389, daily_passenger_avg: 6000, zone_type: 'it_hub', current_demand: 0, predicted_demand: 0 },
  { id: 's13', name: 'Hinjewadi Phase 2', lat: 18.5808, lng: 73.7156, daily_passenger_avg: 5500, zone_type: 'it_hub', current_demand: 0, predicted_demand: 0 },
  { id: 's14', name: 'Magarpatta City', lat: 18.5184, lng: 73.9348, daily_passenger_avg: 4000, zone_type: 'it_hub', current_demand: 0, predicted_demand: 0 },
  { id: 's15', name: 'FC Road', lat: 18.5222, lng: 73.8415, daily_passenger_avg: 3800, zone_type: 'education', current_demand: 0, predicted_demand: 0 },
];

// Helper to create routes
const createRoute = (id: string, name: string, color: string, stationIds: string[]): Route => {
  const stops = stationIds.map(sid => STATIONS.find(s => s.id === sid)).filter(Boolean) as Station[];
  const path: [number, number][] = stops.map(s => [s.lng, s.lat]);
  return { id, name, color, path, stops: stationIds };
};

const ROUTES: Route[] = [
  createRoute('r1', 'Swargate → Shivajinagar → Pune Station → Viman Nagar', '#22C55E', ['s3', 's2', 's1', 's7']),
  createRoute('r2', 'Katraj → Deccan → FC Road → Baner', '#3B82F6', ['s5', 's4', 's15', 's9']),
  createRoute('r3', 'Hadapsar → Magarpatta → Pune Station → Shivajinagar', '#F59E0B', ['s6', 's14', 's1', 's2']),
  createRoute('r4', 'Kothrud → Deccan → Pune Station', '#EC4899', ['s8', 's4', 's1']),
  createRoute('r5', 'Hinjewadi → Wakad → Aundh → Shivajinagar', '#8B5CF6', ['s13', 's12', 's10', 's11', 's2']),
  createRoute('r6', 'Warje → Kothrud → Deccan → Swargate', '#EF4444', ['s8', 's4', 's3']), // Assuming Warje is near Kothrud for now/using existing stations
  createRoute('r7', 'Nigdi → Chinchwad → Aundh → Pune Station', '#14B8A6', ['s10', 's11', 's2', 's1']), // Using Wakad/Aundh as proxy
];

// Initial Buses
const INITIAL_BUSES: Bus[] = Array.from({ length: 25 }, (_, i) => {
  const route = ROUTES[i % ROUTES.length];
  const startStation = STATIONS.find(s => s.id === route.stops[0])!;
  return {
    id: `B${100 + i}`,
    routeId: route.id,
    lat: startStation.lat,
    lng: startStation.lng,
    speed: 0,
    passengers: Math.floor(Math.random() * 30),
    capacity: 60,
    nextStopId: route.stops[1],
    status: 'moving',
    heading: 0,
    targetStationId: route.stops[1],
    progress: 0
  };
});

// Initial Demand
const INITIAL_DEMAND: DemandPoint[] = STATIONS.map(s => ({
  lat: s.lat,
  lng: s.lng,
  intensity: 0.3 + Math.random() * 0.5, // Ensure visible start intensity
  stationId: s.id
}));

export const useStore = create<AppState>((set, get) => ({
  stations: STATIONS,
  buses: INITIAL_BUSES,
  routes: ROUTES,
  demand: INITIAL_DEMAND,
  recommendations: [],
  metrics: {
    activeBuses: 25,
    routesActive: 7,
    passengersToday: 12450,
    avgWaitTime: 12.5,
    predictionAccuracy: 87,
    serverStatus: "Online",
    efficiency: {
      waitTimeReduction: 15,
      fleetUtilization: 78,
      fuelSavings: 12,
    },
  },

  // UI State Initial Values
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),

  mapSettings: {
    showRoutes: true,
    showHeatmap: true,
    showBuses: true,
    showTraffic: false,
    showStations: true,
  },
  toggleMapSetting: (setting) => set((state) => ({
    mapSettings: { ...state.mapSettings, [setting]: !state.mapSettings[setting] }
  })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedRouteId: null,
  setSelectedRouteId: (id) => set({ selectedRouteId: id }),

  selectedBus: null,
  setSelectedBus: (bus) => set({ selectedBus: bus }),

  isOptimizing: false,
  triggerOptimization: () => {
    set({ isOptimizing: true });
    setTimeout(() => {
      set((state) => ({
        isOptimizing: false,
        recommendations: [
          {
            id: Math.random().toString(36).substr(2, 9),
            type: Math.random() > 0.5 ? 'add' : 'reroute',
            routeId: `r${Math.floor(Math.random() * 3) + 1}`,
            action: 'Optimize Frequency',
            reason: 'Projected demand spike in IT Hub',
            confidence: Math.floor(Math.random() * 10) + 90,
            impact: 'High',
            timestamp: new Date().toISOString(),
            amount: Math.floor(Math.random() * 3) + 1
          },
          ...state.recommendations.slice(0, 4)
        ],
        metrics: {
          ...state.metrics,
          predictionAccuracy: Math.min(99, state.metrics.predictionAccuracy + 0.5),
          efficiency: {
            ...state.metrics.efficiency,
            fleetUtilization: Math.min(100, state.metrics.efficiency.fleetUtilization + 1.2)
          }
        }
      }));
    }, 2000); 
  },

  removeRecommendation: (id: string) => set((state) => ({
    recommendations: state.recommendations.filter(r => r.id !== id)
  })),

  updateData: (data) => set((state) => ({ ...state, ...data })),
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Simulation State
  simulation: {
    timeOfDay: 8, // 8 AM start
    dayOfWeek: 'weekday',
    fleetSize: 15,
    simulationSpeed: 1,
    isPlaying: true,
  },
  setSimulationParam: (param, value) => set((state) => ({
    simulation: { ...state.simulation, [param]: value }
  })),

  updateSimulation: () => {
    const state = get();
    if (!state.simulation.isPlaying) return;

    // 1. Advance Time
    let newTime = state.simulation.timeOfDay + (0.05 * state.simulation.simulationSpeed); // Advance by ~3 mins per tick
    if (newTime >= 24) newTime = 0;

    // 2. Update Demand based on Time & Zone
    const updatedStations = state.stations.map(station => {
      let demandMultiplier = 0.2; // Base demand

      // Morning Peak (7-10 AM)
      if (newTime >= 7 && newTime <= 10) {
        if (station.zone_type === 'it_hub' || station.zone_type === 'commercial') demandMultiplier = 1.5; // High arrivals
        if (station.zone_type === 'residential') demandMultiplier = 1.2; // High departures
      }
      // Evening Peak (5-8 PM)
      else if (newTime >= 17 && newTime <= 20) {
        if (station.zone_type === 'it_hub' || station.zone_type === 'commercial') demandMultiplier = 1.2; // High departures
        if (station.zone_type === 'residential') demandMultiplier = 1.5; // High arrivals
      }
      // Weekend Adjustment
      if (state.simulation.dayOfWeek === 'weekend') {
        if (station.zone_type === 'it_hub') demandMultiplier *= 0.3;
        if (station.zone_type === 'commercial') demandMultiplier *= 1.2; // Leisure
      }

      const currentDemand = Math.floor(station.daily_passenger_avg / 24 * demandMultiplier * (0.8 + Math.random() * 0.4));
      return { ...station, current_demand: currentDemand, predicted_demand: Math.floor(currentDemand * 1.1) };
    });

    // 3. Update Buses (Movement)
    const updatedBuses = state.buses.map(bus => {
      if (bus.status === 'idle') return bus;

      const route = state.routes.find(r => r.id === bus.routeId)!;
      const currentStationIndex = route.stops.indexOf(bus.targetStationId || route.stops[0]);
      const prevStationId = route.stops[currentStationIndex - 1] || route.stops[route.stops.length - 1]; // Loop or bounce? Let's loop for simplicity
      // Actually, let's find the segment.
      // If progress is 0, we are at prevStationId.
      // If progress is 1, we are at targetStationId.
      
      let newProgress = bus.progress + (0.01 * state.simulation.simulationSpeed); // Speed factor
      let newTargetId = bus.targetStationId;
      let newLat = bus.lat;
      let newLng = bus.lng;
      let newHeading = bus.heading;
      let newStatus = bus.status;

      if (newProgress >= 1) {
        // Arrived at station
        newProgress = 0;
        const currentIndex = route.stops.indexOf(bus.targetStationId!);
        const nextIndex = (currentIndex + 1) % route.stops.length;
        newTargetId = route.stops[nextIndex];
        // Simulate stop
        // In a real loop we might pause, but for smooth viz we just continue for now
      }

      // Calculate position
      // We need coordinates of "from" and "to"
      const targetStation = state.stations.find(s => s.id === newTargetId);
      
      if (!targetStation) {
        return bus;
      }

      // Find "from" station. It's the one before target in the route list.
      const targetIndex = route.stops.indexOf(newTargetId!);
      const fromIndex = (targetIndex - 1 + route.stops.length) % route.stops.length;
      const fromStation = state.stations.find(s => s.id === route.stops[fromIndex]);

      if (!fromStation) {
        return bus;
      }

      // Interpolate
      newLat = fromStation.lat + (targetStation.lat - fromStation.lat) * newProgress;
      newLng = fromStation.lng + (targetStation.lng - fromStation.lng) * newProgress;

      // Calculate Heading
      const y = Math.sin(targetStation.lng - fromStation.lng) * Math.cos(targetStation.lat);
      const x = Math.cos(fromStation.lat) * Math.sin(targetStation.lat) -
                Math.sin(fromStation.lat) * Math.cos(targetStation.lat) * Math.cos(targetStation.lng - fromStation.lng);
      newHeading = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360; 

      return {
        ...bus,
        lat: newLat,
        lng: newLng,
        heading: newHeading,
        progress: newProgress,
        targetStationId: newTargetId,
        nextStopId: newTargetId!,
        passengers: Math.min(bus.capacity, bus.passengers + Math.floor(Math.random() * 5) - Math.floor(Math.random() * 3)), // Random flux
        speed: 30 + Math.random() * 10
      };
    });

    // 4. Update Demand Heatmap Points
    const newDemandPoints: DemandPoint[] = updatedStations.map(s => ({
      lat: s.lat,
      lng: s.lng,
      intensity: Math.min(1, s.current_demand / 200), // Normalize
      stationId: s.id
    }));

    set(state => ({
      simulation: { ...state.simulation, timeOfDay: newTime },
      stations: updatedStations,
      buses: updatedBuses,
      demand: newDemandPoints,
      metrics: {
        ...state.metrics,
        passengersToday: state.metrics.passengersToday + Math.floor(Math.random() * 10),
        activeBuses: state.simulation.fleetSize
      }
    }));
  }
}));
