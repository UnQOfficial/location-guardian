import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Settings, MapPin, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsCards from '@/components/admin/StatsCards';
import LocationTable from '@/components/admin/LocationTable';
import ExportControls from '@/components/admin/ExportControls';
import ConfigurationPanel from '@/components/admin/ConfigurationPanel';
import MapView from '@/components/admin/MapView';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import Footer from '@/components/admin/Footer';

const AdminPage = () => {
  const [isLocalhost, setIsLocalhost] = useState(true);

  useEffect(() => {
    const hostname = window.location.hostname;
    setIsLocalhost(
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname === '[::1]' ||
      hostname.endsWith('.lovableproject.com')
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">UnQTraker Admin</h1>
              <p className="text-muted-foreground">Location Intelligence Dashboard</p>
            </div>
          </div>
        </div>

        {/* Localhost Warning */}
        {!isLocalhost && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Admin dashboard is restricted to localhost only. 
              You are currently accessing from a remote location. Some features may be restricted.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <StatsCards />

        {/* Controls */}
        <ExportControls />

        {/* Tabs */}
        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="locations" className="gap-2">
              <Shield className="w-4 h-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations">
            <LocationTable />
          </TabsContent>

          <TabsContent value="map">
            <MapView />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCharts />
          </TabsContent>

          <TabsContent value="config">
            <ConfigurationPanel />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminPage;
