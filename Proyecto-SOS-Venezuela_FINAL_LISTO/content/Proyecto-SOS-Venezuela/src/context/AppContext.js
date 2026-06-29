import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDatabase } from '../database/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [db, setDb] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  
  // Saturation Logic States
  const [criticalCaseCount, setCriticalCaseCount] = useState(0);
  const [isSaturated, setIsSaturated] = useState(false);

  useEffect(() => {
    getDatabase().then(database => {
      setDb(database);
      setDbReady(true);
    });
  }, []);

  const activateEmergency = () => setEmergencyMode(true);
  const deactivateEmergency = () => setEmergencyMode(false);

  const reportCriticalCase = () => {
    setCriticalCaseCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) setIsSaturated(true);
      return newCount;
    });
    // Reset counter every hour to track 'cases per hour'
    setTimeout(() => {
      setCriticalCaseCount(prev => Math.max(0, prev - 1));
    }, 3600000);
  };

  const resetSaturation = () => {
    setCriticalCaseCount(0);
    setIsSaturated(false);
  };

  return (
    <AppContext.Provider value={{ 
      db, dbReady, emergencyMode, activateEmergency, deactivateEmergency, 
      isSaturated, reportCriticalCase, resetSaturation 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
