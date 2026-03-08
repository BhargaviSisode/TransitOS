import React from 'react';
import { 
  LayoutDashboard, 
  Bus, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Users, 
  Clock, 
  Activity, 
  Server, 
  Radio 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { AppState } from '../types';

const NavItem = ({ icon: Icon, label, view, active }: { icon: any, label: string, view: AppState['currentView'], active: boolean }) => {
  const setCurrentView = useStore((state) => state.setCurrentView);
  
  return (
    <motion.div 
      onClick={() => setCurrentView(view)}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-[16px] cursor-pointer transition-all duration-300 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-500 dark:text-[#9AA4B2] hover:text-gray-900 dark:hover:text-[#E6EAF0] hover:bg-gray-100 dark:hover:bg-[#1C212C]'
      }`}
    >
      <Icon size={20} className={active ? "text-white" : "text-gray-400 dark:text-[#9AA4B2]"} />
      <span className="font-medium text-sm tracking-wide">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </motion.div>
  );
};

const MetricRow = ({ icon: Icon, label, value, color = "text-[#E4E7EB]" }: { icon: any, label: string, value: string | number, color?: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-[#353B46] rounded-xl">
        <Icon size={16} className="text-gray-400" />
      </div>
      <span className="text-sm text-gray-400 font-medium">{label}</span>
    </div>
    <span className={`font-semibold text-sm ${color}`}>{value}</span>
  </div>
);

export const LeftSidebar = () => {
  const metrics = useStore((state) => state.metrics);
  const currentView = useStore((state) => state.currentView);

  return (
    <div className="w-80 h-full flex flex-col p-6 space-y-8 overflow-y-auto bg-white dark:bg-[#141923] transition-colors duration-500 border-r border-gray-200 dark:border-white/5">
      {/* Logo */}
      <div className="pl-2">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bus className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-[#E6EAF0] tracking-tight">TransitOS</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-[#9AA4B2] font-medium ml-14 tracking-wide">AI Urban Mobility Control</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" active={currentView === 'dashboard'} />
        <NavItem icon={Bus} label="Fleet Monitoring" view="fleet" active={currentView === 'fleet'} />
        <NavItem icon={TrendingUp} label="Demand Prediction" view="demand" active={currentView === 'demand'} />
        <NavItem icon={BarChart3} label="Analytics" view="analytics" active={currentView === 'analytics'} />
        <NavItem icon={Settings} label="Settings" view="settings" active={currentView === 'settings'} />
      </nav>

      {/* Fleet Overview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-[#2C313A] rounded-[20px] shadow-lg"
      >
        <h3 className="text-sm font-semibold text-[#E4E7EB] mb-5 flex items-center">
          <Activity size={16} className="mr-2 text-blue-400" />
          Fleet Overview
        </h3>
        <div className="space-y-1">
          <MetricRow icon={Bus} label="Active Buses" value={metrics.activeBuses} />
          <MetricRow icon={Radio} label="Routes Active" value={metrics.routesActive} />
          <MetricRow icon={Users} label="Passengers" value={metrics.passengersToday.toLocaleString()} />
          <MetricRow icon={Clock} label="Avg Wait Time" value={`${metrics.avgWaitTime.toFixed(1)} min`} />
        </div>
      </motion.div>

      {/* System Health Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-[#2C313A] rounded-[20px] shadow-lg"
      >
        <h3 className="text-sm font-semibold text-[#E4E7EB] mb-5 flex items-center">
          <Server size={16} className="mr-2 text-green-400" />
          System Health
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">AI Accuracy</span>
            <span className="font-bold text-green-400">{metrics.predictionAccuracy}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${metrics.predictionAccuracy}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-green-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
            />
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
            <span className="text-xs text-gray-400 font-medium">Server Status</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-green-900/30 text-green-400 rounded-full flex items-center ring-1 ring-green-900/50">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              {metrics.serverStatus}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
