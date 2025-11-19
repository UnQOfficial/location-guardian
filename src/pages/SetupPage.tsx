import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertTriangle, ExternalLink, Code, Key } from 'lucide-react';

const SetupPage = () => {
  const handleSkipSetup = () => {
    // For testing purposes, create a mock user
    const mockUser = {
      email: 'demo@unqtraker.local',
      name: 'Demo User',
      picture: '',
      sub: 'demo-123'
    };
    localStorage.setItem('unqtraker_user', JSON.stringify(mockUser));
    localStorage.setItem('unqtraker_token', 'demo-token');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <Card className="p-8 space-y-6 bg-slate-900/50 backdrop-blur-xl border-slate-800">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white">
              UnQTraker Setup Required
            </h1>
            
            <p className="text-slate-400 text-lg">
              Google OAuth credentials are not configured yet
            </p>
          </div>

          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              To use Google OAuth and Drive integration, you need to configure your Google Cloud credentials.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Key className="h-5 w-5" />
              Quick Setup Steps
            </h2>
            
            <div className="space-y-3 text-slate-300">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="font-medium text-white">Create Google Cloud Project</p>
                  <p className="text-sm text-slate-400">Go to Google Cloud Console and create a new project</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="font-medium text-white">Enable APIs</p>
                  <p className="text-sm text-slate-400">Enable Google Drive API and Google+ API</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="font-medium text-white">Create OAuth Credentials</p>
                  <p className="text-sm text-slate-400">Create OAuth 2.0 Client ID and API Key</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="font-medium text-white">Set Environment Variables</p>
                  <div className="mt-2 p-3 bg-slate-950 rounded-lg font-mono text-xs text-slate-300">
                    <div>VITE_GOOGLE_CLIENT_ID=your_client_id</div>
                    <div>VITE_GOOGLE_API_KEY=your_api_key</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
              className="flex-1 gap-2"
              variant="default"
            >
              <ExternalLink className="h-4 w-4" />
              Open Google Cloud Console
            </Button>
            
            <Button
              onClick={() => window.open('/GOOGLE_SETUP.md', '_blank')}
              className="flex-1 gap-2"
              variant="outline"
            >
              <Code className="h-4 w-4" />
              View Setup Guide
            </Button>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-slate-400">
                Want to test the app without setting up Google OAuth?
              </p>
              <Button
                onClick={handleSkipSetup}
                variant="secondary"
                className="gap-2"
              >
                Continue with Demo Mode
              </Button>
              <p className="text-xs text-slate-500">
                (Data will only be stored locally, no cloud sync)
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center text-sm text-slate-500">
          Built with ❤️ by Sandeep Gaddam
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
