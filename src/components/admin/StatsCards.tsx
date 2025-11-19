import { useEffect, useState } from 'react';
import { MapPin, Users, Clock, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getStats } from '@/utils/storage';
import { formatTimestamp } from '@/utils/formatters';
import { StatsData } from '@/types';

const StatsCards = () => {
  const [stats, setStats] = useState<StatsData>({
    totalLocations: 0,
    uniqueSessions: 0,
    latestCapture: 'Never',
    storageUsage: '0 KB',
  });

  useEffect(() => {
    const updateStats = async () => {
      const newStats = await getStats();
      setStats(newStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: 'Total Locations',
      value: stats.totalLocations.toLocaleString(),
      icon: MapPin,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Unique Sessions',
      value: stats.uniqueSessions.toLocaleString(),
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Latest Capture',
      value: stats.latestCapture !== 'Never' ? formatTimestamp(stats.latestCapture) : 'Never',
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      small: true,
    },
    {
      title: 'Storage Usage',
      value: stats.storageUsage,
      icon: Database,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="backdrop-blur-sm bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={`${card.small ? 'text-lg' : 'text-2xl'} font-bold text-foreground`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
