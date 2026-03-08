import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { LeftSidebar } from './components/LeftSidebar';
import { MainPanel } from './components/MainPanel';
import { RightPanel } from './components/RightPanel';
import { useStore } from './store';

const socket = io(); // Connects to the same host/port by default

export default function App() {
  const updateData = useStore((state) => state.updateData);
  const darkMode = useStore((state) => state.darkMode);
  const currentView = useStore((state) => state.currentView);
  const updateSimulation = useStore((state) => state.updateSimulation);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      updateSimulation();
    }, 100); // 10 FPS simulation
    return () => clearInterval(interval);
  }, [updateSimulation]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('init', (data) => {
      updateData(data);
    });

    socket.on('update', (data) => {
      updateData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('init');
      socket.off('update');
    };
  }, [updateData]);

  <footer style={{textAlign:"center",padding:"10px",opacity:0.6}}>
  Hackathon Prototype – TransitOS
</footer>

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#0F1218] overflow-hidden font-sans text-gray-900 dark:text-[#E6EAF0] antialiased selection:bg-blue-100 selection:text-blue-900">
      <LeftSidebar />
      <MainPanel />
      {currentView === 'dashboard' && <RightPanel />}
    </div>
  );
}
