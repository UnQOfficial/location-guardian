import { LocationData, StatsData } from '@/types';

const STORAGE_KEY = 'unqtraker_locations';
const MAX_LOCATIONS = 200;

export const saveLocation = (location: LocationData): void => {
  try {
    const existing = getLocations();
    const updated = [location, ...existing].slice(0, MAX_LOCATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save location:', error);
    
    // Try to clear old data and retry
    try {
      const existing = getLocations();
      const reduced = [location, ...existing.slice(0, 50)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
    } catch (retryError) {
      throw new Error('Storage quota exceeded. Please clear old data.');
    }
  }
};

export const getLocations = (): LocationData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load locations:', error);
    return [];
  }
};

export const deleteLocation = (id: string): void => {
  try {
    const existing = getLocations();
    const filtered = existing.filter(loc => loc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete location:', error);
  }
};

export const clearAllLocations = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear locations:', error);
  }
};

export const exportLocations = (): void => {
  try {
    const locations = getLocations();
    const blob = new Blob([JSON.stringify(locations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unqtraker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export locations:', error);
    throw error;
  }
};

export const getStats = (): StatsData => {
  const locations = getLocations();
  const uniqueSessions = new Set(locations.map(loc => loc.sessionId)).size;
  const storageUsed = new Blob([localStorage.getItem(STORAGE_KEY) || '']).size;
  const storageUsageKB = (storageUsed / 1024).toFixed(2);
  
  return {
    totalLocations: locations.length,
    uniqueSessions,
    latestCapture: locations[0]?.timestamp || 'Never',
    storageUsage: `${storageUsageKB} KB`,
  };
};

export const getSessionId = (): string => {
  const SESSION_KEY = 'unqtraker_session';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};
