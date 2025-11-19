import { UAParser } from 'ua-parser-js';

export interface DeviceFingerprint {
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
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  innerWidth: number;
  innerHeight: number;
  pixelRatio: number;
  colorDepth: number;
  orientation: string;
  cpuCores: number;
  deviceMemory: number | undefined;
  maxTouchPoints: number;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  connectionType: string;
  connectionDownlink: number | null;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  online: boolean;
  webGLVendor: string;
  webGLRenderer: string;
  canvasFingerprint: string;
  localStorageAvailable: boolean;
  sessionStorageAvailable: boolean;
  indexedDBAvailable: boolean;
  referrer: string;
  currentURL: string;
}

const getWebGLInfo = (): { vendor: string; renderer: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl && 'getParameter' in gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        return {
          vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown',
          renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown',
        };
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  return { vendor: 'Unknown', renderer: 'Unknown' };
};

const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const text = 'UnQTraker Canvas Fingerprint';
      ctx.textBaseline = 'top';
      ctx.font = '16px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(0, 0, 200, 50);
      ctx.fillStyle = '#3498db';
      ctx.fillText(text, 2, 15);
      ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
      ctx.fillText(text, 4, 17);
      
      return canvas.toDataURL().slice(-50);
    }
  } catch (e) {
    // Ignore errors
  }
  
  return 'unavailable';
};

const getBatteryInfo = async (): Promise<{ level: number | null; charging: boolean | null }> => {
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
      };
    }
  } catch (e) {
    // Ignore errors
  }
  
  return { level: null, charging: null };
};

const getConnectionInfo = (): { type: string; downlink: number | null } => {
  try {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        type: connection.effectiveType || 'unknown',
        downlink: connection.downlink || null,
      };
    }
  } catch (e) {
    // Ignore errors
  }
  
  return { type: 'unknown', downlink: null };
};

const checkStorageAvailability = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const checkIndexedDBAvailability = (): boolean => {
  try {
    return !!window.indexedDB;
  } catch (e) {
    return false;
  }
};

export const getDeviceFingerprint = async (): Promise<DeviceFingerprint> => {
  const parser = new UAParser();
  const result = parser.getResult();
  
  const webGLInfo = getWebGLInfo();
  const batteryInfo = await getBatteryInfo();
  const connectionInfo = getConnectionInfo();
  
  return {
    userAgent: navigator.userAgent,
    browserName: result.browser.name || 'Unknown',
    browserVersion: result.browser.version || 'Unknown',
    osName: result.os.name || 'Unknown',
    osVersion: result.os.version || 'Unknown',
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    orientation: window.screen.orientation?.type || 'unknown',
    cpuCores: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    batteryLevel: batteryInfo.level,
    batteryCharging: batteryInfo.charging,
    connectionType: connectionInfo.type,
    connectionDownlink: connectionInfo.downlink,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    online: navigator.onLine,
    webGLVendor: webGLInfo.vendor,
    webGLRenderer: webGLInfo.renderer,
    canvasFingerprint: getCanvasFingerprint(),
    localStorageAvailable: checkStorageAvailability('localStorage'),
    sessionStorageAvailable: checkStorageAvailability('sessionStorage'),
    indexedDBAvailable: checkIndexedDBAvailability(),
    referrer: document.referrer,
    currentURL: window.location.href,
  };
};
