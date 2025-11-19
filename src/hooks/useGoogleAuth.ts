import { useEffect, useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { toast } from 'sonner';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export const useGoogleAuth = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('unqtraker_user');
    const savedToken = localStorage.getItem('unqtraker_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (accessToken) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        (window as any).gapi.load('client', async () => {
          await (window as any).gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
          });
          (window as any).gapi.client.setToken({ access_token: accessToken });
        });
      };
      document.body.appendChild(script);
    }
  }, [accessToken]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('unqtraker_token', tokenResponse.access_token);

      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const userData = await response.json();
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('unqtraker_user', JSON.stringify(userData));
        toast.success(`Welcome, ${userData.name}!`);
      } catch (error) {
        toast.error('Failed to fetch user information');
      }
    },
    onError: () => {
      toast.error('Google login failed');
    },
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata'
  });

  const logout = () => {
    googleLogout();
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('unqtraker_user');
    localStorage.removeItem('unqtraker_token');
    toast.success('Logged out successfully');
  };

  return { user, accessToken, isAuthenticated, isLoading, login, logout };
};
