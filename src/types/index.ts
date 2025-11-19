export interface LocationData {
  id: string;
  sessionId: string;
  timestamp: string;
  
  // Geolocation data
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  
  // Device fingerprint
  userAgent: string;
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  platform: string;
  language: string;
  languages: string[];
  timezone: string;
  timezoneOffset: number;
  
  // Display
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  innerWidth: number;
  innerHeight: number;
  pixelRatio: number;
  colorDepth: number;
  orientation: string;
  
  // Hardware
  cpuCores: number;
  deviceMemory: number | undefined;
  maxTouchPoints: number;
  
  // Battery
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  
  // Connection
  connectionType: string;
  connectionDownlink: number | null;
  
  // Browser features
  cookieEnabled: boolean;
  doNotTrack: string | null;
  online: boolean;
  webGLVendor: string;
  webGLRenderer: string;
  canvasFingerprint: string;
  
  // Storage
  localStorageAvailable: boolean;
  sessionStorageAvailable: boolean;
  indexedDBAvailable: boolean;
  
  // Additional
  referrer: string;
  currentURL: string;
  permissionStatus: string;
}

export interface StatsData {
  totalLocations: number;
  uniqueSessions: number;
  latestCapture: string;
  storageUsage: string;
}
