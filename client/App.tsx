import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
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
              <Route
                path="/suppliers"
                element={
                  <PlaceholderPage
                    title="Supplier Directory"
                    description="Browse and manage your trusted supplier network"
                    feature="Advanced Supplier Management"
                  />
                }
              />
              <Route
                path="/orders"
                element={
                  <PlaceholderPage
                    title="Order Management"
                    description="Track and manage all your orders in one place"
                    feature="Live Order Tracking & Management"
                  />
                }
              />
              <Route
                path="/support"
                element={
                  <PlaceholderPage
                    title="AI Support Center"
                    description="Get help in Tamil, Hindi, and English"
                    feature="Multilingual AI Chatbot Support"
                  />
                }
              />
              <Route
                path="/help"
                element={
                  <PlaceholderPage
                    title="Help Center"
                    description="Find answers to common questions and tutorials"
                    feature="Comprehensive Help Documentation"
                  />
                }
              />
              <Route
                path="/contact"
                element={
                  <PlaceholderPage
                    title="Contact Us"
                    description="Get in touch with our support team"
                    feature="Multi-channel Customer Support"
                  />
                }
              />
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
                path="/about"
                element={
                  <PlaceholderPage
                    title="About StreetSupply"
                    description="Learn about our mission to empower street food vendors"
                    feature="Company Information & Mission"
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
              <Route
                path="/settings"
                element={
                  <PlaceholderPage
                    title="Account Settings"
                    description="Manage your account preferences and settings"
                    feature="Comprehensive Settings Management"
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

createRoot(document.getElementById("root")!).render(<App />);
