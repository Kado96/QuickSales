import React, { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

import Index from "./pages/Index";
import FlashInfo from "./components/FlashInfo";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useApi";

// Lazy-loaded routes for better performance
const Diocese = lazy(() => import("./pages/Diocese"));
const Historique = lazy(() => import("./pages/Historique"));
const VisionMission = lazy(() => import("./pages/VisionMission"));
const Leadership = lazy(() => import("./pages/Leadership"));
const Paroisses = lazy(() => import("./pages/Paroisses"));
const Ministeres = lazy(() => import("./pages/Ministeres"));
const Actualites = lazy(() => import("./pages/Actualites"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Ressources = lazy(() => import("./pages/Ressources"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminSermons = lazy(() => import("./pages/admin/Sermons"));
const AdminAnnouncements = lazy(() => import("./pages/admin/Announcements"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminParishes = lazy(() => import("./pages/admin/Parishes"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminDiocese = lazy(() => import("./pages/admin/Diocese"));
const AdminMinistries = lazy(() => import("./pages/admin/Ministries"));
const AdminHomepage = lazy(() => import("./pages/admin/Homepage"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminAddUser = lazy(() => import("./pages/admin/AddUser"));
const AdminDocumentation = lazy(() => import("./pages/admin/Documentation"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const AdminMediaManager = lazy(() => import("./pages/admin/MediaManager"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-slate-500 font-medium">Chargement...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const hexToHsl = (hex: string) => {
  // Remove the hash
  hex = hex.replace('#', '');
  
  // Parse r, g, b
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { data: siteSettings } = useSiteSettings();

  // Apply dynamic colors from settings
  useEffect(() => {
    if (siteSettings) {
      const root = document.documentElement;
      if (siteSettings.primary_color) {
        try {
          root.style.setProperty('--primary', hexToHsl(siteSettings.primary_color));
          root.style.setProperty('--ring', hexToHsl(siteSettings.primary_color));
        } catch (e) { console.error("Invalid primary color", e); }
      }
      if (siteSettings.secondary_color) {
        try {
          root.style.setProperty('--secondary', hexToHsl(siteSettings.secondary_color));
        } catch (e) { console.error("Invalid secondary color", e); }
      }
      if (siteSettings.accent_color) {
        try {
          root.style.setProperty('--accent', hexToHsl(siteSettings.accent_color));
        } catch (e) { console.error("Invalid accent color", e); }
      }
    }
  }, [siteSettings]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-propos" element={<Diocese />} />
          <Route path="/a-propos/historique" element={<Historique />} />
          <Route path="/a-propos/vision-mission" element={<VisionMission />} />
          <Route path="/a-propos/leadership" element={<Leadership />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:id" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/add" element={<AdminAddUser />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/a-propos" element={<AdminDiocese />} />
          <Route path="/admin/homepage" element={<AdminHomepage />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/documentation" element={<AdminDocumentation />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/media" element={<AdminMediaManager />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <FlashInfo />}
    </>
  );
};

export default App;
