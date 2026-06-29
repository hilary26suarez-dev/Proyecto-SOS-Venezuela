import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDatabase } from '../database/db';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [db, setDb] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    getDatabase().then(database => {
      setDb(database);
      setDbReady(true);
    });
  }, []);

  const activateEmergency = () => setEmergencyMode(true);
  const deactivateEmergency = () => setEmergencyMode(false);

  return (
    <AppContext.Provider value={{ db, dbReady, emergencyMode, activateEmergency, deactivateEmergency }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
