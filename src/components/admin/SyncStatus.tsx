import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SyncStatusProps {
  isSyncing: boolean;
  lastSync: string | null;
  error: string | null;
}

const SyncStatus = ({ isSyncing, lastSync, error }: SyncStatusProps) => {
  if (error) {
    return (
      <Badge variant="destructive" className="gap-2">
        <CloudOff className="h-3 w-3" />
        Sync Failed
      </Badge>
    );
  }

  if (isSyncing) {
    return (
      <Badge variant="secondary" className="gap-2">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Syncing...
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-2">
      <Cloud className="h-3 w-3" />
      {lastSync ? `Synced ${lastSync}` : 'Synced'}
    </Badge>
  );
};

export default SyncStatus;
