import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import TrackingPage from "./pages/TrackingPage";
import TrackPage from "./pages/TrackPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { GOOGLE_CONFIG } from './config/google';

const queryClient = new QueryClient();

// Check if Google OAuth is configured
const hasGoogleCredentials = GOOGLE_CONFIG.clientId && GOOGLE_CONFIG.clientId.length > 0;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {hasGoogleCredentials ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<SetupPage />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </>
          )}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
