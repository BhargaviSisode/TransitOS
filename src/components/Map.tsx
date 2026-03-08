import React, { useState, useMemo } from 'react';
import Map, { Source, Layer, Marker, Popup, NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '../store';
import { Bus as BusIcon, Navigation, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MAP_STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";
const MAP_STYLE_DARK = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export const CityMap = () => {
  const buses = useStore((state) => state.buses);
  const routes = useStore((state) => state.routes);
  const demand = useStore((state) => state.demand);
  const stations = useStore((state) => state.stations);
  const selectedBus = useStore((state) => state.selectedBus);
  const setSelectedBus = useStore((state) => state.setSelectedBus);
  const darkMode = useStore((state) => state.darkMode);

  const mapSettings = useStore((state) => state.mapSettings);
  const searchQuery = useStore((state) => state.searchQuery);

  const [viewState, setViewState] = useState({
    longitude: 73.8567,
    latitude: 18.5204,
    zoom: 12,
    pitch: 45,
    bearing: 0
  });

  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  // Filter buses based on search
  const filteredBuses = useMemo(() => {
    if (!searchQuery) return buses;
    const lowerQuery = searchQuery.toLowerCase();
    return buses.filter(bus => 
      bus.id.toLowerCase().includes(lowerQuery) || 
      bus.routeId.toLowerCase().includes(lowerQuery) ||
      bus.nextStopId.toLowerCase().includes(lowerQuery)
    );
  }, [buses, searchQuery]);

  // Convert routes to GeoJSON
  const routesGeoJSON = useMemo(() => {
    if (!routes || routes.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: routes.map(route => {
        const busCount = buses.filter(b => b.routeId === route.id).length;
        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.path
          },
          properties: {
            id: route.id,
            color: route.color,
            name: route.name,
            label: `${route.name} • ${busCount} buses`
          }
        };
      })
    };
  }, [routes, buses]);

  // Convert demand to GeoJSON for heatmap
  const demandGeoJSON = useMemo(() => {
    if (!demand || demand.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: demand.map((p, i) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.lng, p.lat]
        },
        properties: {
          intensity: p.intensity
        }
      }))
    };
  }, [demand]);

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-sm border border-gray-100/50 relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapLib={maplibregl as any}
        style={{ width: '100%', height: '100%' }}
        mapStyle={darkMode ? MAP_STYLE_DARK : MAP_STYLE_LIGHT}
        dragRotate={true}
        touchZoomRotate={true}
      >
        <NavigationControl position="top-right" />

        {/* Routes Layer */}
        {mapSettings.showRoutes && routesGeoJSON && (
          <Source key="routes-source" id="routes" type="geojson" data={routesGeoJSON as any}>
            <Layer
              id="route-line"
              type="line"
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
              paint={{
                'line-color': ['get', 'color'],
                'line-width': 5,
                'line-opacity': 0.8
              }}
            />
            <Layer
              id="route-label"
              type="symbol"
              layout={{
                'text-field': ['get', 'label'],
                'text-size': 12,
                'text-offset': [0, 1],
                'symbol-placement': 'line-center',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
              }}
              paint={{
                'text-color': '#ffffff',
                'text-halo-color': '#000000',
                'text-halo-width': 2
              }}
            />
          </Source>
        )}

        {/* Demand Heatmap Layer */}
        {mapSettings.showHeatmap && demandGeoJSON && (
          <Source key="demand-source" id="demand" type="geojson" data={demandGeoJSON as any}>
            <Layer
              id="demand-heat"
              type="heatmap"
              paint={{
                'heatmap-weight': ['get', 'intensity'],
                'heatmap-intensity': 1.5,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 255, 0, 0)',
                  0.2, 'rgba(34, 197, 94, 0.6)', // Green (Low)
                  0.5, 'rgba(234, 179, 8, 0.6)', // Yellow (Medium)
                  0.8, 'rgba(239, 68, 68, 0.7)'  // Red (High)
                ],
                'heatmap-radius': 50,
                'heatmap-opacity': 0.6
              }}
            />
          </Source>
        )}

        {/* Bus Markers */}
        {mapSettings.showBuses && filteredBuses.map(bus => (
          <Marker
            key={bus.id}
            longitude={bus.lng}
            latitude={bus.lat}
            anchor="center"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedBus(bus);
            }}
          >
            <motion.div
              layoutId={`bus-${bus.id}`}
              initial={false}
              animate={{ rotate: bus.heading }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
              className={`cursor-pointer transform hover:scale-110 transition-transform ${
                selectedBus?.id === bus.id ? 'z-50' : 'z-10'
              }`}
            >
              <div 
                className={`w-3 h-3 rounded-full shadow-sm border border-white ${
                  selectedBus?.id === bus.id ? 'bg-blue-600 scale-125' : 'bg-[#10B981]'
                }`}
              />
            </motion.div>
          </Marker>
        ))}

        {/* Stations Markers */}
        {mapSettings.showStations && stations.map(station => (
          <Marker
            key={station.id}
            longitude={station.lng}
            latitude={station.lat}
            anchor="center"
          >
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredStation(station.id)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md ${
                station.current_demand > 150 ? 'bg-red-500' :
                station.current_demand > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              
              {/* Tooltip */}
              {hoveredStation === station.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[150px] z-50">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1">{station.name}</h4>
                  <div className="space-y-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Current Demand:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">{station.current_demand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predicted:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">{station.predicted_demand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone:</span>
                      <span className="capitalize">{station.zone_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Marker>
        ))}

        {/* Selected Bus Popup */}
        <AnimatePresence>
          {selectedBus && (
            <Popup
              longitude={selectedBus.lng}
              latitude={selectedBus.lat}
              anchor="bottom"
              offset={20}
              closeButton={false}
              closeOnClick={false}
              className="z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 min-w-[200px]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">Bus {selectedBus.id}</h3>
                    <p className="text-xs text-gray-500">{routes.find(r => r.id === selectedBus.routeId)?.name}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedBus(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Route Name</span>
                    <span className="font-medium">{routes.find(r => r.id === selectedBus.routeId)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Passengers Onboard</span>
                    <span className="font-medium">{selectedBus.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capacity</span>
                    <span className="font-medium">{selectedBus.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Stop</span>
                    <span className="font-medium text-xs text-right max-w-[100px] truncate">
                      {stations.find(s => s.id === selectedBus.nextStopId)?.name || selectedBus.nextStopId}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedBus.status === 'moving' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {selectedBus.status}
                  </span>
                  <Navigation size={12} className="text-blue-500" />
                </div>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Map>
    </div>
  );
};
