import React from 'react';
import { useStore } from '../../store';
import { Moon, Sun, Bell, Database, Activity, Shield, Globe, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

const SettingSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-[#1C212C] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#141923]">
      <h3 className="font-bold text-gray-900 dark:text-[#E6EAF0]">{title}</h3>
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

const Toggle = ({ label, checked, onChange, icon: Icon }: { label: string, checked: boolean, onChange: () => void, icon: any }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
        <Icon size={18} />
      </div>
      <span className="font-medium text-gray-700 dark:text-[#E6EAF0]">{label}</span>
    </div>
    <button 
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'
      }`}
    >
      <motion.div 
        layout
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm ${
          checked ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  </div>
);

export const SettingsView = () => {
  const darkMode = useStore((state) => state.darkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  return (
    <div className="h-full w-full p-6 bg-white dark:bg-[#0F1218] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#E6EAF0]">Settings</h2>
        <p className="text-sm text-gray-500 dark:text-[#9AA4B2]">Manage your preferences and system configuration</p>
      </div>

      <div className="max-w-3xl">
        <SettingSection title="Appearance">
          <Toggle 
            label="Dark Mode" 
            checked={darkMode} 
            onChange={toggleDarkMode} 
            icon={darkMode ? Moon : Sun} 
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                <Globe size={18} />
              </div>
              <span className="font-medium text-gray-700 dark:text-[#E6EAF0]">Map Theme</span>
            </div>
            <select className="bg-gray-50 dark:bg-[#141923] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Standard</option>
              <option>Satellite</option>
              <option>Dark Matter</option>
            </select>
          </div>
        </SettingSection>

        <SettingSection title="System">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                <Database size={18} />
              </div>
              <span className="font-medium text-gray-700 dark:text-[#E6EAF0]">Data Refresh Interval</span>
            </div>
            <select className="bg-gray-50 dark:bg-[#141923] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-[#E6EAF0] focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Real-time (Live)</option>
              <option>Every 5 seconds</option>
              <option>Every 30 seconds</option>
              <option>Every minute</option>
            </select>
          </div>
          <Toggle 
            label="System Diagnostics" 
            checked={true} 
            onChange={() => {}} 
            icon={Activity} 
          />
        </SettingSection>

        <SettingSection title="Notifications">
          <Toggle 
            label="Push Notifications" 
            checked={true} 
            onChange={() => {}} 
            icon={Smartphone} 
          />
          <Toggle 
            label="Email Alerts" 
            checked={false} 
            onChange={() => {}} 
            icon={Bell} 
          />
          <Toggle 
            label="Security Alerts" 
            checked={true} 
            onChange={() => {}} 
            icon={Shield} 
          />
        </SettingSection>
      </div>
    </div>
  );
};
