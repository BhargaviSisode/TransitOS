import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Fuel, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { useStore } from '../store';
import { format } from 'date-fns';

const CircularProgress = ({ value, label, icon: Icon, color }: { value: number, label: string, icon: any, color: string }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#2C313A] rounded-[20px] shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-700"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <Icon className={`absolute ${color}`} size={20} />
      </div>
      <div className="mt-3 text-center">
        <span className="text-2xl font-bold text-[#E4E7EB] tracking-tight">{value}%</span>
        <p className="text-xs text-[#9AA4B2] font-medium mt-1 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
};

const TimelineItem = ({ time, title, type }: { time: string, title: string, type: 'success' | 'warning' | 'info' }) => (
  <div className="flex gap-4 pb-8 last:pb-0 relative group">
    <div className="flex flex-col items-center">
      <div className={`w-2.5 h-2.5 rounded-full z-10 ring-4 ring-[#2C313A] ${
        type === 'success' ? 'bg-emerald-500' : 
        type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
      }`} />
      <div className="w-0.5 h-full bg-gray-700 absolute top-3 group-last:hidden" />
    </div>
    <div className="flex-1 -mt-1.5">
      <p className="text-xs text-[#9AA4B2] font-semibold mb-1 tracking-wide">{time}</p>
      <p className="text-sm text-[#E4E7EB] font-medium leading-relaxed">{title}</p>
    </div>
  </div>
);

export const RightPanel = () => {
  const metrics = useStore((state) => state.metrics);
  const recommendations = useStore((state) => state.recommendations);
  const darkMode = useStore((state) => state.darkMode);
  
  // Mock data for the chart, initializing with some values
  const [chartData, setChartData] = useState([
    { time: '10:00', value: 400 },
    { time: '10:05', value: 300 },
    { time: '10:10', value: 550 },
    { time: '10:15', value: 450 },
    { time: '10:20', value: 600 },
    { time: '10:25', value: 700 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newTime = new Date();
        const timeStr = format(newTime, 'HH:mm');
        const newValue = Math.floor(Math.random() * 300) + 400;
        const newData = [...prev.slice(1), { time: timeStr, value: newValue }];
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-96 h-full flex flex-col p-6 space-y-6 overflow-y-auto bg-white dark:bg-[#141923] transition-colors duration-500 border-l border-gray-200 dark:border-white/5">
      
      {/* Live Demand Trends */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-[#2C313A] rounded-[20px] shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[#E4E7EB] flex items-center tracking-wide uppercase">
            <TrendingUp size={16} className="mr-2 text-emerald-400" />
            Live Demand
          </h3>
          <span className="text-[10px] font-bold px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded-full uppercase tracking-wider animate-pulse border border-emerald-900/50">
            Real-time
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 500 }} 
                interval={1}
                dy={10}
              />
              <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  backgroundColor: '#1F2937',
                  color: '#F3F4F6',
                  padding: '8px 12px'
                }}
                itemStyle={{ color: '#10B981', fontSize: '12px', fontWeight: 600 }}
                cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Fleet Efficiency Metrics */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xs font-bold text-gray-500 dark:text-[#9AA4B2] mb-4 px-1 uppercase tracking-wider">Fleet Efficiency</h3>
        <div className="grid grid-cols-2 gap-4">
          <CircularProgress 
            value={metrics.efficiency.waitTimeReduction} 
            label="Wait Time" 
            icon={Clock} 
            color="text-emerald-400" 
          />
          <CircularProgress 
            value={metrics.efficiency.fleetUtilization} 
            label="Utilization" 
            icon={Zap} 
            color="text-blue-400" 
          />
          <div className="col-span-2 p-5 bg-[#2C313A] rounded-[20px] shadow-lg flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-900/30 rounded-xl">
                <Fuel size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-[#9AA4B2] font-medium uppercase tracking-wide">Fuel Savings</p>
                <p className="text-xl font-bold text-[#E4E7EB] mt-0.5">{metrics.efficiency.fuelSavings}%</p>
              </div>
            </div>
            <div className="h-12 w-32 flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.efficiency.fuelSavings}%` }}
                  transition={{ duration: 1.5 }}
                  className="bg-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Activity Timeline */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 flex-1 bg-[#2C313A] rounded-[20px] shadow-lg"
      >
        <h3 className="text-sm font-bold text-[#E4E7EB] mb-6 flex items-center tracking-wide uppercase">
          <Activity size={16} className="mr-2 text-blue-400" />
          System Activity
        </h3>
        <div className="space-y-1">
          {recommendations.slice(0, 4).map((rec, i) => (
            <TimelineItem 
              key={rec.id || i}
              time={format(new Date(rec.timestamp), 'HH:mm')}
              title={`${rec.type === 'add' ? 'Deployed' : rec.type === 'remove' ? 'Recalled' : 'Rerouted'} buses for ${rec.routeId}`}
              type={rec.type === 'add' ? 'success' : rec.type === 'remove' ? 'warning' : 'info'}
            />
          ))}
          <TimelineItem 
            time="09:45" 
            title="System optimization cycle complete" 
            type="info" 
          />
        </div>
      </motion.div>

    </div>
  );
};
