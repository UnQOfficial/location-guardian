export interface TrackingLink {
  id: string;
  targetUrl: string;
  createdAt: string;
  clicks: number;
  captures: number;
  active: boolean;
}

export interface AppConfig {
  defaultTargetUrl: string;
  trackingLinks: TrackingLink[];
  theme: 'light' | 'dark' | 'auto';
  autoRefresh: boolean;
  refreshInterval: number;
}

const CONFIG_KEY = 'unqtraker_config';
const DEFAULT_CONFIG: AppConfig = {
  defaultTargetUrl: 'https://facebook.com',
  trackingLinks: [],
  theme: 'dark',
  autoRefresh: false,
  refreshInterval: 30000,
};

export const getConfig = (): AppConfig => {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
  } catch (error) {
    console.error('Failed to load config:', error);
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config: Partial<AppConfig>): void => {
  try {
    const current = getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
};

export const generateTrackingLink = (targetUrl?: string): TrackingLink => {
  const config = getConfig();
  const link: TrackingLink = {
    id: crypto.randomUUID().slice(0, 8),
    targetUrl: targetUrl || config.defaultTargetUrl,
    createdAt: new Date().toISOString(),
    clicks: 0,
    captures: 0,
    active: true,
  };
  
  const links = [...config.trackingLinks, link];
  saveConfig({ trackingLinks: links });
  
  return link;
};

export const updateTrackingLink = (id: string, updates: Partial<TrackingLink>): void => {
  const config = getConfig();
  const links = config.trackingLinks.map(link => 
    link.id === id ? { ...link, ...updates } : link
  );
  saveConfig({ trackingLinks: links });
};

export const deleteTrackingLink = (id: string): void => {
  const config = getConfig();
  const links = config.trackingLinks.filter(link => link.id !== id);
  saveConfig({ trackingLinks: links });
};

export const incrementLinkClick = (id: string): void => {
  const config = getConfig();
  const links = config.trackingLinks.map(link => 
    link.id === id ? { ...link, clicks: link.clicks + 1 } : link
  );
  saveConfig({ trackingLinks: links });
};

export const incrementLinkCapture = (id: string): void => {
  const config = getConfig();
  const links = config.trackingLinks.map(link => 
    link.id === id ? { ...link, captures: link.captures + 1 } : link
  );
  saveConfig({ trackingLinks: links });
};
