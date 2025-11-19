import { useEffect, useState } from 'react';
import { ExternalLink, Eye, Trash2, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLocations, deleteLocation } from '@/utils/storage';
import { formatTimestamp, formatCoordinates, getGoogleMapsUrl, getDeviceType, getAccuracyColor } from '@/utils/formatters';
import { LocationData } from '@/types';
import { toast } from 'sonner';
import DetailModal from './DetailModal';

const LocationTable = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const loadLocations = () => {
      const data = getLocations();
      setLocations(data);
    };

    loadLocations();
    const interval = setInterval(loadLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id: string) => {
    try {
      deleteLocation(id);
      setLocations(locations.filter(loc => loc.id !== id));
      toast.success('Location deleted successfully');
    } catch (error) {
      toast.error('Failed to delete location');
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  if (locations.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No location data captured yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Visit the tracking page to start capturing locations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Location History</span>
            <span className="text-sm text-muted-foreground font-normal">
              {locations.length} {locations.length === 1 ? 'entry' : 'entries'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location, index) => {
                  const deviceType = getDeviceType(location.maxTouchPoints, location.innerWidth);
                  const accuracyColor = getAccuracyColor(location.accuracy);

                  return (
                    <TableRow key={location.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatTimestamp(location.timestamp)}
                      </TableCell>
                      <TableCell>
                        <a
                          href={getGoogleMapsUrl(location.latitude, location.longitude)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          {formatCoordinates(location.latitude, location.longitude)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant={accuracyColor as any}>
                          {location.accuracy.toFixed(0)}m
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(deviceType)}
                          <span className="capitalize">{deviceType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {location.browserName} {location.browserVersion}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {location.osName} {location.osVersion}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedLocation(location)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(location.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedLocation && (
        <DetailModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </>
  );
};

export default LocationTable;
