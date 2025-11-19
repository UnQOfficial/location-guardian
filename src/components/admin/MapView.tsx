import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLocations } from '@/utils/storage';
import { LocationData } from '@/types';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    setLocations(getLocations());
  }, []);

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Map View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No location data to display
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get center point (first location)
  const center: [number, number] = [locations[0].latitude, locations[0].longitude];

  // Group by session for path lines
  const sessions = locations.reduce((acc, loc) => {
    if (!acc[loc.sessionId]) {
      acc[loc.sessionId] = [];
    }
    acc[loc.sessionId].push(loc);
    return acc;
  }, {} as Record<string, LocationData[]>);

  const getMarkerColor = (accuracy: number): string => {
    if (accuracy < 20) return '#10b981'; // green
    if (accuracy < 50) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Map View
          <Badge variant="secondary">{locations.length} locations</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Markers */}
            {locations.map((loc) => (
              <Marker
                key={loc.id}
                position={[loc.latitude, loc.longitude]}
              >
                <Popup>
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {new Date(loc.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Accuracy: {loc.accuracy.toFixed(0)}m
                    </p>
                    <p className="text-sm">
                      Device: {loc.browserName} on {loc.osName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Path lines for each session */}
            {Object.values(sessions).map((sessionLocs, idx) => {
              if (sessionLocs.length < 2) return null;
              const positions: [number, number][] = sessionLocs.map(loc => [
                loc.latitude,
                loc.longitude,
              ]);
              return (
                <Polyline
                  key={idx}
                  positions={positions}
                  color="#3b82f6"
                  weight={2}
                  opacity={0.6}
                />
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
