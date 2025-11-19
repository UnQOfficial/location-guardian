import { LocationData, StatsData } from '@/types';
import { saveLocationsToDrive, loadLocationsFromDrive } from './googleDrive';

const STORAGE_KEY = 'unqtraker_locations';
const MAX_LOCATIONS = 200;
const USE_GOOGLE_DRIVE = true;

export const saveLocation = async (location: LocationData): Promise<void> => {
  try {
    const existing = await getLocations();
    const updated = [location, ...existing].slice(0, MAX_LOCATIONS);
    
    if (USE_GOOGLE_DRIVE) {
      try {
        await saveLocationsToDrive(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (driveError) {
        console.warn('Drive save failed, using localStorage:', driveError);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to save location:', error);
    
    try {
      const existing = await getLocations();
      const reduced = [location, ...existing.slice(0, 50)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
    } catch (retryError) {
      throw new Error('Storage quota exceeded. Please clear old data.');
    }
  }
};

export const getLocations = async (): Promise<LocationData[]> => {
  try {
    if (USE_GOOGLE_DRIVE) {
      try {
        const driveData = await loadLocationsFromDrive();
        if (driveData.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(driveData));
          return driveData;
        }
      } catch (driveError) {
        console.warn('Drive load failed, using localStorage:', driveError);
      }
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load locations:', error);
    return [];
  }
};

export const deleteLocation = async (id: string): Promise<void> => {
  try {
    const existing = await getLocations();
    const filtered = existing.filter(loc => loc.id !== id);
    
    if (USE_GOOGLE_DRIVE) {
      try {
        await saveLocationsToDrive(filtered);
      } catch (driveError) {
        console.warn('Drive delete failed:', driveError);
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete location:', error);
  }
};

export const clearAllLocations = async (): Promise<void> => {
  try {
    if (USE_GOOGLE_DRIVE) {
      try {
        await saveLocationsToDrive([]);
      } catch (driveError) {
        console.warn('Drive clear failed:', driveError);
      }
    }
    
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear locations:', error);
  }
};

export const exportLocations = async (): Promise<void> => {
  try {
    const locations = await getLocations();
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

export const getStats = async (): Promise<StatsData> => {
  const locations = await getLocations();
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
