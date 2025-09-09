import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FoodProvider } from "@/contexts/FoodContext";
import { FastProvider } from "@/contexts/FastContext";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FoodSelection from "./pages/FoodSelection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FoodProvider>
      <FastProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route 
                path="/auth" 
                element={
                  <AuthGuard requireAuth={false}>
                    <Auth />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/home" 
                element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/insights" 
                element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/fast" 
                element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/food-selection" 
                element={
                  <AuthGuard>
                    <FoodSelection />
                  </AuthGuard>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FastProvider>
    </FoodProvider>
  </QueryClientProvider>
);

export default App;
