import { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCurrentLocation } from '@/utils/geolocation';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';
import { saveLocation, getSessionId } from '@/utils/storage';
import { checkGeolocationPermission } from '@/utils/geolocation';
import { LocationData } from '@/types';
import { toast } from 'sonner';

type Status = 'idle' | 'loading' | 'success' | 'error';

const TrackingPage = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLocationCapture = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      // Get permission status
      const permissionStatus = await checkGeolocationPermission();

      // Capture location and device fingerprint in parallel
      const [locationResult, deviceFingerprint] = await Promise.all([
        getCurrentLocation(),
        getDeviceFingerprint(),
      ]);

      // Create location data object
      const locationData: LocationData = {
        id: crypto.randomUUID(),
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        ...locationResult,
        ...deviceFingerprint,
        permissionStatus,
      };

      // Save to localStorage
      saveLocation(locationData);

      setStatus('success');
      toast.success('Location captured successfully!');

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Failed to capture location';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-2xl backdrop-blur-sm">
              <MapPin className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Share Your Location Securely
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Help us understand your location data for analytics and personalized experiences. 
            Your privacy is important to us.
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 backdrop-blur-sm bg-card/50 border-border/50">
          <div className="space-y-6">
            {status === 'idle' && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Click the button below to allow location access
                </p>
                <Button
                  size="lg"
                  onClick={handleLocationCapture}
                  className="w-full md:w-auto gap-2 text-lg py-6 px-8"
                >
                  <MapPin className="w-5 h-5" />
                  Allow Location Access
                </Button>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center space-y-4 py-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                <p className="text-foreground font-medium">Acquiring location data...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few seconds
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4 py-4">
                <CheckCircle className="w-12 h-12 text-success mx-auto" />
                <p className="text-foreground font-medium">Location captured successfully!</p>
                <p className="text-sm text-muted-foreground">
                  Thank you for sharing your location data
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4 py-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                <p className="text-foreground font-medium">Failed to capture location</p>
                <p className="text-sm text-destructive">{errorMessage}</p>
                <Button onClick={handleLocationCapture} variant="outline" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center text-xs text-muted-foreground max-w-xl mx-auto">
          <p>
            By allowing location access, you agree to share your GPS coordinates and device information 
            for analytics purposes. Data is stored locally in your browser and kept for up to 200 most 
            recent entries. You can clear this data anytime from the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
