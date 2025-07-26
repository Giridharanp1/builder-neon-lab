import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Support from "./pages/Support";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/support" element={<Support />} />
              <Route path="/help" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/chat"
                element={
                  <PlaceholderPage
                    title="Live Chat"
                    description="Chat with suppliers and support in real-time"
                    feature="Real-time Messaging System"
                  />
                }
              />
              <Route
                path="/guides"
                element={
                  <PlaceholderPage
                    title="User Guides"
                    description="Learn how to make the most of StreetSupply"
                    feature="Interactive User Tutorials"
                  />
                }
              />
              <Route
                path="/careers"
                element={
                  <PlaceholderPage
                    title="Careers"
                    description="Join our team and help transform street food procurement"
                    feature="Job Listings & Career Opportunities"
                  />
                }
              />
              <Route
                path="/privacy"
                element={
                  <PlaceholderPage
                    title="Privacy Policy"
                    description="How we protect and use your information"
                    feature="Privacy & Data Protection Policy"
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <PlaceholderPage
                    title="Terms of Service"
                    description="Terms and conditions for using StreetSupply"
                    feature="Legal Terms & Conditions"
                  />
                }
              />
              <Route
                path="/pricing"
                element={
                  <PlaceholderPage
                    title="Pricing Plans"
                    description="Choose the right plan for your business"
                    feature="Flexible Pricing & Subscription Plans"
                  />
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
if (!(container as any)._reactRootContainer) {
  const root = createRoot(container);
  (container as any)._reactRootContainer = root;
  root.render(<App />);
} else {
  (container as any)._reactRootContainer.render(<App />);
}
