import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

const RecommendationCard = ({ rec }: { rec: any }) => {
  const routes = useStore((state) => state.routes);
  const removeRecommendation = useStore((state) => state.removeRecommendation);
  const routeName = routes.find(r => r.id === rec.routeId)?.name || rec.routeId;
  const [status, setStatus] = useState<'pending' | 'approved' | 'dismissed'>('pending');

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('approved');
    setTimeout(() => {
      removeRecommendation(rec.id);
    }, 500);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus('dismissed');
    setTimeout(() => {
      removeRecommendation(rec.id);
    }, 500);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: status === 'approved' ? 1.02 : 1,
        borderColor: status === 'approved' ? 'rgba(72, 187, 120, 0.6)' : status === 'dismissed' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: status === 'approved' ? '0 0 15px rgba(72, 187, 120, 0.4)' : status === 'dismissed' ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
      }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className="p-5 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300 bg-[#2C313A] rounded-xl border min-w-0"
      style={{
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <div className={`p-3 rounded-2xl shrink-0 ${
        rec.type === 'add' ? 'bg-emerald-900/30 text-emerald-400' : 
        rec.type === 'remove' ? 'bg-amber-900/30 text-amber-400' : 
        'bg-blue-900/30 text-blue-400'
      }`}>
        {rec.type === 'add' ? <CheckCircle size={22} /> : 
         rec.type === 'remove' ? <AlertTriangle size={22} /> : 
         <ArrowRight size={22} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-[#E6EAF0] tracking-tight truncate pr-2">
            {rec.type === 'add' ? `Add ${rec.amount} Buses` : 
             rec.type === 'remove' ? `Remove ${rec.amount} Buses` : 
             'Reroute Traffic'}
          </h4>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap ${
            rec.confidence > 90 ? 'bg-emerald-900/50 text-emerald-300' : 'bg-blue-900/50 text-blue-300'
          }`}>
            {rec.confidence}% Conf.
          </span>
        </div>
        <p className="text-xs text-[#9AA4B2] mt-1.5 font-medium truncate">
          {routeName} • {rec.reason}
        </p>
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={handleApprove}
            className="flex-1 bg-white text-gray-900 text-xs font-bold py-2 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Approve
          </button>
          <button 
            onClick={handleDismiss}
            className="px-4 py-2 text-xs font-bold text-[#9AA4B2] hover:text-white transition-colors bg-gray-800 rounded-xl hover:bg-gray-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const AIOptimizationCard = () => {
  const recommendations = useStore((state) => state.recommendations);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedRecommendations = isExpanded ? recommendations : recommendations.slice(0, 2);

  return (
    <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
      <div className="flex flex-col items-center space-y-4 pointer-events-auto">
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            backgroundColor: 'rgba(40, 48, 62, 0.88)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: '20px',
            overflow: 'hidden'
          }}
          className="shadow-2xl border w-full max-w-4xl cursor-pointer"
        >
          <motion.div layout className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center tracking-wide uppercase">
              <Sparkles size={16} className="mr-2 text-emerald-500" />
              AI Optimization Engine
            </h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-400">
                Live Updates {isExpanded ? '(all visible)' : recommendations.length > 2 ? `(${recommendations.length - 2} more)` : ''}
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {displayedRecommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
