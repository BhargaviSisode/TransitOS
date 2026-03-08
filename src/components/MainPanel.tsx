import React from 'react';
import { CityMap } from './Map';
import { useStore } from '../store';
import { motion } from 'motion/react';
import { 
  Moon,
  Sun,
  Search,
  Layers,
  Zap,
  TrendingUp
} from 'lucide-react';
import { FleetMonitoringView } from './views/FleetMonitoringView';
import { DemandPredictionView } from './views/DemandPredictionView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { AIOptimizationCard } from './AIOptimizationCard';

export const MainPanel = () => {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const mapSettings = useStore((state) => state.mapSettings);
  const toggleMapSetting = useStore((state) => state.toggleMapSetting);
  const isOptimizing = useStore((state) => state.isOptimizing);
  const triggerOptimization = useStore((state) => state.triggerOptimization);
  const currentView = useStore((state) => state.currentView);
  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  // Render different views based on currentView state
  if (currentView === 'fleet') return <div className="flex-1 h-full p-6 bg-white dark:bg-[#0F1218] overflow-hidden"><FleetMonitoringView /></div>;
  if (currentView === 'demand') return <div className="flex-1 h-full p-6 bg-white dark:bg-[#0F1218] overflow-hidden"><DemandPredictionView /></div>;
  if (currentView === 'analytics') return <div className="flex-1 h-full p-6 bg-white dark:bg-[#0F1218] overflow-hidden"><AnalyticsView /></div>;
  if (currentView === 'settings') return <div className="flex-1 h-full p-6 bg-white dark:bg-[#0F1218] overflow-hidden"><SettingsView /></div>;

  return (
    <div className="flex-1 h-full flex flex-col p-6 space-y-6 relative overflow-hidden bg-white dark:bg-[#0F1218] transition-colors duration-500">
      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-[#E6EAF0] tracking-tight">Command Center</h2>
          <p className="text-sm text-gray-500 dark:text-[#9AA4B2] font-medium mt-1">Real-time urban mobility optimization</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-3 rounded-2xl bg-white dark:bg-[#1C212C] border border-white/50 dark:border-white/5 text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 soft-shadow"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative group">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search routes or buses..." 
              className="pl-11 pr-4 py-3 bg-white dark:bg-[#1C212C] border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-72 soft-shadow text-gray-900 dark:text-[#E6EAF0] placeholder-gray-400 transition-all duration-300 group-hover:w-80"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3 transition-colors group-focus-within:text-emerald-500" />
          </div>

          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden border-2 border-white dark:border-gray-600 soft-shadow p-0.5 cursor-pointer hover:scale-105 transition-transform duration-300">
            <img src="https://picsum.photos/seed/operator/200" alt="Operator" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative rounded-[24px] overflow-hidden soft-shadow border border-white/60 dark:border-white/5 bg-white dark:bg-[#141923]">
        <CityMap />
        
        {/* Optimization Trigger */}
        <div className="absolute top-6 left-6 z-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={triggerOptimization}
            disabled={isOptimizing}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl backdrop-blur-md border border-white/20 shadow-lg font-bold text-sm transition-all ${
              isOptimizing 
                ? 'bg-emerald-500/80 text-white cursor-wait' 
                : 'bg-white/90 dark:bg-[#1C212C]/90 text-gray-900 dark:text-[#E6EAF0] hover:bg-white dark:hover:bg-gray-800'
            }`}
          >
            <Zap size={18} className={isOptimizing ? "animate-pulse" : "text-emerald-500"} />
           <span>{isOptimizing ? "AI Optimizing Fleet Routes..." : "Run AI Optimization"}</span>
          </motion.button>
        </div>
        
        {/* Floating Recommendations Overlay */}
        <AIOptimizationCard />
      </div>
    </div>
  );
};
