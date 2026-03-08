import React, { useState } from 'react';
import { useStore } from '../../store';
import { Bus as BusIcon, Clock, Users, AlertCircle, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { CityMap } from '../Map';

export const FleetMonitoringView = () => {
  const buses = useStore((state) => state.buses);
  const stations = useStore((state) => state.stations);
  const routes = useStore((state) => state.routes);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const selectedBus = useStore((state) => state.selectedBus);
  const setSelectedBus = useStore((state) => state.setSelectedBus);

  const getStationName = (id: string) => stations.find(s => s.id === id)?.name || id;
  const getRouteName = (id: string) => routes.find(r => r.id === id)?.name || id;

  const filteredBuses = buses.filter(bus => 
    bus.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.routeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full gap-6">
      {/* Bus List Panel */}
      <div className="w-1/3 flex flex-col space-y-4 h-full">
        <div className="bg-white dark:bg-[#1C212C] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-white/5 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search bus or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#141923] border border-gray-200 dark:border-white/5 rounded-lg text-sm text-gray-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {filteredBuses.map((bus) => (
            <motion.div
              key={bus.id}
              onClick={() => setSelectedBus(bus)}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                selectedBus?.id === bus.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
                  : 'bg-white dark:bg-[#1C212C] border-gray-200 dark:border-white/5 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BusIcon size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-[#E6EAF0]">{bus.id}</h3>
                    <p className="text-xs text-gray-500 dark:text-[#9AA4B2]">{getRouteName(bus.routeId)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bus.status === 'moving' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  bus.status === 'stopped' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-[#9AA4B2]">
                  <Users size={14} />
                  <span>{bus.passengers}/{bus.capacity} Pax</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-[#9AA4B2]">
                  <Clock size={14} />
                  <span className="truncate max-w-[100px]" title={getStationName(bus.nextStopId)}>Next: {getStationName(bus.nextStopId)}</span>
                </div>
              </div>
              
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    bus.passengers / bus.capacity > 0.8 ? 'bg-red-500' : 
                    bus.passengers / bus.capacity > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 bg-white dark:bg-[#1C212C] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm relative">
        <CityMap />
        
        {selectedBus && (
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-[#1C212C]/90 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-lg z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-[#E6EAF0]">Selected Bus: {selectedBus.id}</h3>
                <p className="text-sm text-gray-500 dark:text-[#9AA4B2]">Next Stop: {getStationName(selectedBus.nextStopId)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-[#9AA4B2]">Speed</p>
                <p className="font-mono font-bold text-gray-900 dark:text-[#E6EAF0]">{selectedBus.speed.toFixed(1)} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
