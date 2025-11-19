import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Shield, CloudUpload, AlertTriangle } from 'lucide-react';
import { GOOGLE_CONFIG } from '@/config/google';

const LoginPage = () => {
  const { isAuthenticated, isLoading, login } = useGoogleAuth();
  const navigate = useNavigate();
  const hasCredentials = GOOGLE_CONFIG.clientId && GOOGLE_CONFIG.clientId.length > 0;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Redirect to setup if no credentials
    if (!hasCredentials) {
      navigate('/setup');
    }
  }, [hasCredentials, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-slate-900/50 backdrop-blur-xl border-slate-800">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">
            Welcome to UnQTraker
          </h1>
          
          <p className="text-slate-400">
            Sign in with your Google account to access your location intelligence dashboard
          </p>
        </div>

        {!hasCredentials && (
          <Alert className="border-yellow-500/50 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Google OAuth is not configured. Redirecting to setup...
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button 
            onClick={() => login()} 
            className="w-full gap-2 h-12 text-base"
            size="lg"
            disabled={!hasCredentials}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <Shield className="h-6 w-6 mx-auto text-secondary" />
              <p className="text-xs text-slate-400">Secure OAuth 2.0</p>
            </div>
            <div className="text-center space-y-2">
              <CloudUpload className="h-6 w-6 mx-auto text-secondary" />
              <p className="text-xs text-slate-400">Cloud Storage</p>
            </div>
            <div className="text-center space-y-2">
              <MapPin className="h-6 w-6 mx-auto text-secondary" />
              <p className="text-xs text-slate-400">Location Tracking</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          By signing in, you agree to store location data in your Google Drive
        </div>
      </Card>
      
      <footer className="fixed bottom-4 left-0 right-0 text-center text-sm text-slate-500">
        Built with ❤️ by Sandeep Gaddam
      </footer>
    </div>
  );
};

export default LoginPage;
