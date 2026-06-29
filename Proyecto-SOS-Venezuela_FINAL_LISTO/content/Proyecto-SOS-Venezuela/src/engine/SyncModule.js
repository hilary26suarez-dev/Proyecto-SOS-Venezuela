
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://proyecto-sos-venezuela.vercel.app/api/triage';

export const SyncModule = {
  /**
   * Synchronizes local emergency logs with the Vercel backend.
   */
  syncLogs: async () => {
    try {
      const rawLogs = await AsyncStorage.getItem('fs_emergency_log');
      if (!rawLogs) return;

      const logs = JSON.parse(rawLogs);
      if (logs.length === 0) return;

      console.log(`[Sync] Attempting to sync ${logs.length} logs...`);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs, timestamp: new Date().toISOString() }),
      });

      if (response.ok) {
        console.log('[Sync] Success! Clearing local sync queue.');
        // Depending on policy, we might clear or mark as synced. 
        // For high-risk, we usually clear once confirmed by server.
        await AsyncStorage.setItem('fs_emergency_log', JSON.stringify([]));
        return true;
      } else {
        console.warn('[Sync] Server rejected data:', response.status);
        return false;
      }
    } catch (error) {
      console.error('[Sync] Network error or offline:', error);
      return false;
    }
  },

  /**
   * Initializes a background check for connectivity to trigger sync.
   */
  initAutoSync: (intervalMs = 300000) => {
    setInterval(() => {
      SyncModule.syncLogs();
    }, intervalMs); // Default 5 minutes
  }
};
