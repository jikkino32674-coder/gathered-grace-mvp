import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import GatheredGraceDetails from "./pages/GatheredGraceDetails";
import LavenderEyePillowDetails from "./pages/LavenderEyePillowDetails";
import HandmadeBalmDetails from "./pages/HandmadeBalmDetails";
import JournalPenDetails from "./pages/JournalPenDetails";
import RestKitDetails from "./pages/RestKitDetails";
import ReflectKitDetails from "./pages/ReflectKitDetails";
import RestoreKitDetails from "./pages/RestoreKitDetails";
import BuildCustomKit from "./pages/BuildCustomKit";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products/gathered-grace" element={<GatheredGraceDetails />} />
          <Route path="/products/lavender-eye-pillow" element={<LavenderEyePillowDetails />} />
          <Route path="/products/handmade-balm" element={<HandmadeBalmDetails />} />
          <Route path="/products/journal-pen" element={<JournalPenDetails />} />
          <Route path="/products/rest-kit" element={<RestKitDetails />} />
          <Route path="/products/reflect-kit" element={<ReflectKitDetails />} />
          <Route path="/products/restore-kit" element={<RestoreKitDetails />} />
          <Route path="/build-custom" element={<BuildCustomKit />} />
          <Route path="/payment" element={<Payment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
