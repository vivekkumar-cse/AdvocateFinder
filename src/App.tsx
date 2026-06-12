import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Advocates from "./pages/Advocates";
import About from "./pages/About";
import Auth from "./pages/Auth";
import RegisterAdvocate from "./pages/RegisterAdvocate";
import MyConsultations from "./pages/MyConsultations";
import AdvocateDashboard from "./pages/AdvocateDashboard";
import NotFound from "./pages/NotFound";
import SavedAdvocates from "./pages/SavedAdvocates";
import UserDashboard from "./pages/UserDashboard";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/advocates" element={<Advocates />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register-advocate" element={<RegisterAdvocate />} />
            <Route path="/my-consultations" element={<MyConsultations />} />
            <Route path="/advocate-dashboard" element={<AdvocateDashboard />} />
            <Route path="/saved-advocates" element={<SavedAdvocates />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/messages" element={<Messages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
