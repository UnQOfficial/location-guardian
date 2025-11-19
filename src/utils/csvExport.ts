import Papa from 'papaparse';
import { LocationData } from '@/types';

export const exportToCSV = (locations: LocationData[]): void => {
  const csvData = locations.map(loc => ({
    Timestamp: new Date(loc.timestamp).toLocaleString(),
    Latitude: loc.latitude,
    Longitude: loc.longitude,
    Accuracy: loc.accuracy,
    'Device Type': getDeviceType(loc),
    Browser: loc.browserName,
    'Browser Version': loc.browserVersion,
    OS: loc.osName,
    'OS Version': loc.osVersion,
    'Screen Width': loc.screenWidth,
    'Screen Height': loc.screenHeight,
    'Battery Level': loc.batteryLevel !== null ? `${loc.batteryLevel}%` : 'N/A',
    'Battery Charging': loc.batteryCharging !== null ? (loc.batteryCharging ? 'Yes' : 'No') : 'N/A',
    'Connection Type': loc.connectionType,
    'Session ID': loc.sessionId,
    Language: loc.language,
    Timezone: loc.timezone,
    Platform: loc.platform,
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `unqtraker-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getDeviceType = (location: LocationData): string => {
  const isMobile = /Mobile|Android|iPhone/i.test(location.userAgent);
  const isTablet = /Tablet|iPad/i.test(location.userAgent);
  return isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';
};
