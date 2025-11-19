import { X, Copy, ExternalLink, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LocationData } from '@/types';
import { formatTimestamp, getGoogleMapsUrl } from '@/utils/formatters';
import { toast } from 'sonner';

interface DetailModalProps {
  location: LocationData;
  onClose: () => void;
}

const DetailModal = ({ location, onClose }: DetailModalProps) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const DataRow = ({ label, value }: { label: string; value: string | number | null | boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-border/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium font-mono">{String(value ?? 'N/A')}</span>
        {value && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(String(value), label)}
            className="h-6 w-6 p-0"
          >
            <Copy className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Location Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-4">
            {/* Map Preview */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
              <iframe
                src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                className="w-full h-full"
                loading="lazy"
                title="Location Map"
              />
              <div className="absolute top-4 right-4">
                <Button
                  size="sm"
                  onClick={() => window.open(getGoogleMapsUrl(location.latitude, location.longitude), '_blank')}
                  className="gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Maps
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Detailed Information */}
            <Accordion type="multiple" defaultValue={['location', 'device', 'browser']} className="w-full">
              <AccordionItem value="location">
                <AccordionTrigger>Location Data</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="Latitude" value={location.latitude} />
                    <DataRow label="Longitude" value={location.longitude} />
                    <DataRow label="Accuracy" value={`${location.accuracy.toFixed(2)} meters`} />
                    <DataRow label="Altitude" value={location.altitude ? `${location.altitude.toFixed(2)} meters` : null} />
                    <DataRow label="Altitude Accuracy" value={location.altitudeAccuracy ? `${location.altitudeAccuracy.toFixed(2)} meters` : null} />
                    <DataRow label="Heading" value={location.heading ? `${location.heading.toFixed(2)}°` : null} />
                    <DataRow label="Speed" value={location.speed ? `${location.speed.toFixed(2)} m/s` : null} />
                    <DataRow label="Timestamp" value={formatTimestamp(location.timestamp)} />
                    <DataRow label="Permission Status" value={location.permissionStatus} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="device">
                <AccordionTrigger>Device Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="Platform" value={location.platform} />
                    <DataRow label="Screen Size" value={`${location.screenWidth} × ${location.screenHeight}`} />
                    <DataRow label="Available Screen" value={`${location.availWidth} × ${location.availHeight}`} />
                    <DataRow label="Window Size" value={`${location.innerWidth} × ${location.innerHeight}`} />
                    <DataRow label="Pixel Ratio" value={location.pixelRatio} />
                    <DataRow label="Color Depth" value={`${location.colorDepth} bit`} />
                    <DataRow label="Orientation" value={location.orientation} />
                    <DataRow label="CPU Cores" value={location.cpuCores} />
                    <DataRow label="Device Memory" value={location.deviceMemory ? `${location.deviceMemory} GB` : 'N/A'} />
                    <DataRow label="Touch Points" value={location.maxTouchPoints} />
                    <DataRow label="Battery Level" value={location.batteryLevel ? `${location.batteryLevel}%` : null} />
                    <DataRow label="Battery Charging" value={location.batteryCharging} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="browser">
                <AccordionTrigger>Browser Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="Browser" value={`${location.browserName} ${location.browserVersion}`} />
                    <DataRow label="OS" value={`${location.osName} ${location.osVersion}`} />
                    <DataRow label="User Agent" value={location.userAgent} />
                    <DataRow label="Language" value={location.language} />
                    <DataRow label="Languages" value={location.languages.join(', ')} />
                    <DataRow label="Timezone" value={location.timezone} />
                    <DataRow label="Timezone Offset" value={`${location.timezoneOffset} minutes`} />
                    <DataRow label="Cookies Enabled" value={location.cookieEnabled} />
                    <DataRow label="Do Not Track" value={location.doNotTrack} />
                    <DataRow label="Online Status" value={location.online} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="graphics">
                <AccordionTrigger>Graphics & Canvas</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="WebGL Vendor" value={location.webGLVendor} />
                    <DataRow label="WebGL Renderer" value={location.webGLRenderer} />
                    <DataRow label="Canvas Fingerprint" value={location.canvasFingerprint} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="network">
                <AccordionTrigger>Network Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="Connection Type" value={location.connectionType} />
                    <DataRow label="Downlink Speed" value={location.connectionDownlink ? `${location.connectionDownlink} Mbps` : null} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="storage">
                <AccordionTrigger>Storage Capabilities</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="Local Storage" value={location.localStorageAvailable} />
                    <DataRow label="Session Storage" value={location.sessionStorageAvailable} />
                    <DataRow label="IndexedDB" value={location.indexedDBAvailable} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="session">
                <AccordionTrigger>Session Data</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    <DataRow label="Session ID" value={location.sessionId} />
                    <DataRow label="Location ID" value={location.id} />
                    <DataRow label="Referrer" value={location.referrer || 'Direct'} />
                    <DataRow label="Current URL" value={location.currentURL} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
