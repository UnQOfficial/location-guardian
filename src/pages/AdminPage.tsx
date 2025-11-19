import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Settings, MapPin, BarChart3, LogOut, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import StatsCards from '@/components/admin/StatsCards';
import LocationTable from '@/components/admin/LocationTable';
import ExportControls from '@/components/admin/ExportControls';
import ConfigurationPanel from '@/components/admin/ConfigurationPanel';
import MapView from '@/components/admin/MapView';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import SyncStatus from '@/components/admin/SyncStatus';
import Footer from '@/components/admin/Footer';

const AdminPage = () => {
  const { user, logout } = useGoogleAuth();
  const [syncStatus, setSyncStatus] = useState({ isSyncing: false, lastSync: null as string | null, error: null as string | null });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        {/* Header with User Profile */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">UnQTraker Admin</h1>
              <p className="text-slate-400">Location Intelligence Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SyncStatus {...syncStatus} />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-slate-800 p-2 rounded-lg transition-colors">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <Avatar>
                    <AvatarImage src={user?.picture} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

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
