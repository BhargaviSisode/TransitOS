import React from 'react';
import { useStore } from '../../store';
import { BarChart3, TrendingUp, Zap, Clock, Fuel } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const AnalyticsView = () => {
  const metrics = useStore((state) => state.metrics);

  const mockData = [
    { name: 'Mon', demand: 4000, utilization: 2400, waitTime: 12 },
    { name: 'Tue', demand: 3000, utilization: 1398, waitTime: 10 },
    { name: 'Wed', demand: 2000, utilization: 9800, waitTime: 8 },
    { name: 'Thu', demand: 2780, utilization: 3908, waitTime: 9 },
    { name: 'Fri', demand: 1890, utilization: 4800, waitTime: 11 },
    { name: 'Sat', demand: 2390, utilization: 3800, waitTime: 14 },
    { name: 'Sun', demand: 3490, utilization: 4300, waitTime: 15 },
  ];

  return (
    <div className="flex flex-col h-full w-full gap-6 p-6 bg-white dark:bg-[#0F1218] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E6EAF0]">System Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-[#9AA4B2]">Performance & Efficiency Metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Passengers', value: metrics.passengersToday.toLocaleString(), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Fleet Utilization', value: `${metrics.efficiency.fleetUtilization}%`, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Avg Wait Time', value: `${metrics.avgWaitTime} min`, icon: Clock, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Fuel Savings', value: `${metrics.efficiency.fuelSavings}%`, icon: Fuel, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((kpi, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 bg-white dark:bg-[#1C212C] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${kpi.bg}`}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
              <span className="text-xs font-medium text-gray-400 dark:text-[#9AA4B2] uppercase tracking-wider">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#E6EAF0]">{kpi.value}</h3>
            <p className="text-sm text-gray-500 dark:text-[#9AA4B2] mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        <div className="bg-white dark:bg-[#1C212C] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E6EAF0] mb-6">Passenger Demand Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="demand" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="utilization" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C212C] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#E6EAF0] mb-6">Wait Time Reduction</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.1} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="waitTime" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
