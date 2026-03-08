export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  daily_passenger_avg: number;
  zone_type: 'residential' | 'commercial' | 'education' | 'it_hub';
  current_demand: number;
  predicted_demand: number;
}

export interface Bus {
  id: string;
  routeId: string;
  lat: number;
  lng: number;
  speed: number;
  passengers: number;
  capacity: number;
  nextStopId: string;
  status: "moving" | "stopped" | "idle";
  heading: number;
  targetStationId?: string;
  progress: number; // 0 to 1 between stations
}

export interface Route {
  id: string;
  name: string;
  color: string;
  path: [number, number][]; // [lng, lat]
  stops: string[]; // Station IDs
}

export interface DemandPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1
  stationId?: string;
}

export interface Recommendation {
  id: string;
  type: "add" | "remove" | "reroute";
  routeId: string;
  amount?: number;
  reason: string;
  confidence: number;
  timestamp: string | number;
  action?: string;
  impact?: string;
}

export interface SystemMetrics {
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

export interface MapSettings {
  showRoutes: boolean;
  showHeatmap: boolean;
  showBuses: boolean;
  showTraffic: boolean;
  showStations: boolean;
}

export interface SimulationState {
  timeOfDay: number; // 0-24 hours
  dayOfWeek: 'weekday' | 'weekend';
  fleetSize: number;
  simulationSpeed: number;
  isPlaying: boolean;
}

export interface AppState {
  stations: Station[];
  buses: Bus[];
  routes: Route[];
  demand: DemandPoint[];
  recommendations: Recommendation[];
  metrics: SystemMetrics;
  
  // UI State
  currentView: 'dashboard' | 'fleet' | 'demand' | 'optimization' | 'analytics' | 'settings';
  setCurrentView: (view: AppState['currentView']) => void;
  
  mapSettings: MapSettings;
  toggleMapSetting: (setting: keyof MapSettings) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;

  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus | null) => void;
  
  isOptimizing: boolean;
  triggerOptimization: () => void;
  removeRecommendation: (id: string) => void;

  updateData: (data: Partial<AppState>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Simulation
  simulation: SimulationState;
  setSimulationParam: (param: keyof SimulationState, value: any) => void;
  updateSimulation: () => void;
}
