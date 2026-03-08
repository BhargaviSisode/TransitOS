import React from 'react';
import { useStore } from '../../store';
import { TrendingUp, Clock, MapPin, Layers, Play, Pause, Calendar, Bus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DemandPredictionView = () => {
  const simulation = useStore((state) => state.simulation);
  const setSimulationParam = useStore((state) => state.setSimulationParam);
  const stations = useStore((state) => state.stations);

  // Generate forecast data based on current simulation time
  const forecastData = Array.from({ length: 12 }, (_, i) => {
    const time = (simulation.timeOfDay + i) % 24;
    return {
      time: `${Math.floor(time)}:00`,
      demand: stations.reduce((acc, s) => acc + s.predicted_demand, 0) * (1 + Math.sin(time / 3) * 0.2), // Simulated fluctuation
      capacity: simulation.fleetSize * 60 // Approx capacity
    };
  });

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full w-full gap-6 p-6 bg-white dark:bg-[#0F1218] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E6EAF0]">Demand Prediction & Simulation</h2>
          <p className="text-sm text-gray-500 dark:text-[#9AA4B2]">AI-Forecasted Passenger Load & City Controls</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-[#1C212C] px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5">
            <Clock size={16} className="text-gray-500 dark:text-[#9AA4B2]" />
            <span className="font-mono font-bold text-gray-900 dark:text-[#E6EAF0]">{formatTime(simulation.timeOfDay)}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-[#1C212C] px-4 py-2 rounded-lg border border-gray-200 dark:border-white/5">
            <Calendar size={16} className="text-gray-500 dark:text-[#9AA4B2]" />
            <span className="font-mono font-bold text-gray-900 dark:text-[#E6EAF0] capitalize">{simulation.dayOfWeek}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Controls Panel */}
        <div className="col-span-1 space-y-6">
          <div className="bg-gray-50 dark:bg-[#1C212C] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-[#E6EAF0] mb-6 flex items-center">
              <Layers size={18} className="mr-2 text-blue-500" />
              City Simulation Controls
            </h3>
            
            <div className="space-y-6">
              {/* Play/Pause */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-[#9AA4B2]">Simulation Status</span>
                <button
                  onClick={() => setSimulationParam('isPlaying', !simulation.isPlaying)}
                  className={`p-2 rounded-lg flex items-center space-x-2 ${
                    simulation.isPlaying 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}
                >
                  {simulation.isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  <span className="text-xs font-bold">{simulation.isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
              </div>

              {/* Time of Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#9AA4B2] mb-2">
                  Time of Day ({formatTime(simulation.timeOfDay)})
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="24" 
                  step="0.1"
                  value={simulation.timeOfDay} 
                  onChange={(e) => setSimulationParam('timeOfDay', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Simulation Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#9AA4B2] mb-2">
                  Simulation Speed ({simulation.simulationSpeed}x)
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5"
                  value={simulation.simulationSpeed} 
                  onChange={(e) => setSimulationParam('simulationSpeed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Fleet Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#9AA4B2] mb-2 flex justify-between">
                  <span>Fleet Size</span>
                  <span className="font-bold text-blue-500">{simulation.fleetSize} Buses</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="1"
                  value={simulation.fleetSize} 
                  onChange={(e) => setSimulationParam('fleetSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Day Toggle */}
              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#141923] rounded-lg border border-gray-200 dark:border-white/5">
                <span className="text-sm text-gray-700 dark:text-[#E6EAF0]">Weekend Mode</span>
                <button 
                  onClick={() => setSimulationParam('dayOfWeek', simulation.dayOfWeek === 'weekday' ? 'weekend' : 'weekday')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    simulation.dayOfWeek === 'weekend' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simulation.dayOfWeek === 'weekend' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1C212C] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-[#E6EAF0] mb-4 flex items-center">
              <MapPin size={18} className="mr-2 text-red-500" />
              High Demand Zones
            </h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {stations
                .sort((a, b) => b.current_demand - a.current_demand)
                .slice(0, 5)
                .map((station, i) => (
                <div key={station.id} className="flex justify-between items-center p-3 bg-white dark:bg-[#141923] rounded-lg border border-gray-200 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-[#E6EAF0]">{station.name}</span>
                    <span className="text-[10px] text-gray-500 capitalize">{station.zone_type.replace('_', ' ')}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    station.current_demand > 150 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    station.current_demand > 80 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {station.current_demand} pax
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="col-span-1 lg:col-span-2 bg-gray-50 dark:bg-[#1C212C] p-6 rounded-xl border border-gray-200 dark:border-white/5 flex flex-col shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-[#E6EAF0] mb-6 flex items-center">
            <TrendingUp size={18} className="mr-2 text-green-500" />
            System-Wide Demand Forecast
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.1} />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Area type="monotone" dataKey="demand" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" name="Predicted Demand" />
                <Area type="monotone" dataKey="capacity" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Fleet Capacity" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-[#9AA4B2]">Predicted Demand</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 dark:text-[#9AA4B2]">Current Capacity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
