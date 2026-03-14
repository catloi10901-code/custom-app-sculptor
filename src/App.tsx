import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import PrayPage from "./pages/PrayPage";
import ImpactPage from "./pages/ImpactPage";
import WordPage from "./pages/WordPage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";
import GivePage from "./pages/GivePage";
import BlogPostPage from "./pages/BlogPostPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPrayers from "./pages/admin/AdminPrayers";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLiveStats from "./pages/admin/AdminLiveStats";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminSiteContent from "./pages/admin/AdminSiteContent";
import AdminLiveSessions from "./pages/admin/AdminLiveSessions";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/pray" element={<PrayPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/word" element={<WordPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/word/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* <Route path="/give" element={<GivePage />} /> */}
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="live-stats" element={<AdminLiveStats />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="prayers" element={<AdminPrayers />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="campaigns" element={<AdminCampaigns />} />
              <Route path="site-content" element={<AdminSiteContent />} />
              <Route path="live-sessions" element={<AdminLiveSessions />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
