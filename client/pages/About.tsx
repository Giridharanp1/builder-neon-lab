import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Award,
  TrendingUp,
  MapPin,
  Mail,
  ArrowLeft,
  Heart,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function About() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">StreetSupply</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
              </>
            )}
            <Link to="/about" className="text-sm text-foreground font-medium">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground">Hi, {user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isAuthenticated && (
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About StreetSupply
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to empower street food vendors by connecting them directly with trusted suppliers, 
            eliminating middlemen and creating a more efficient food supply ecosystem.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To revolutionize the street food supply chain by providing a transparent, efficient, and 
                affordable marketplace that directly connects vendors with suppliers, reducing costs and 
                improving quality for everyone involved.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To create a world where every street food vendor has access to high-quality ingredients 
                at fair prices, enabling them to grow their businesses and serve better food to their communities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground">Active Vendors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">₹2.5Cr+</div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25%</div>
              <div className="text-sm text-muted-foreground">Average Cost Savings</div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Trust & Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We verify all suppliers and maintain transparent pricing to build lasting trust in our marketplace.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize the needs of our vendor and supplier communities, ensuring mutual growth and success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We leverage AI and technology to continuously improve the supply chain experience for all users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Story */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>How StreetSupply came to be</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-4">
              StreetSupply was born from a simple observation: street food vendors were paying too much for 
              ingredients and supplies due to multiple layers of middlemen in the traditional supply chain.
            </p>
            <p className="text-muted-foreground mb-4">
              Our founders, coming from backgrounds in technology and food distribution, realized that a 
              digital marketplace could eliminate these inefficiencies while providing better service to both 
              vendors and suppliers.
            </p>
            <p className="text-muted-foreground mb-4">
              Since our launch in 2023, we've facilitated over ₹2.5 crores in transactions, helping thousands 
              of vendors save money and time while connecting them with reliable suppliers across India.
            </p>
            <p className="text-muted-foreground">
              Today, we continue to innovate with AI-powered recommendations, demand prediction, and features 
              that make procurement simpler and more efficient for the street food ecosystem.
            </p>
          </CardContent>
        </Card>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">RK</span>
                </div>
                <h3 className="font-semibold">Rahul Kumar</h3>
                <p className="text-sm text-muted-foreground mb-2">Co-Founder & CEO</p>
                <p className="text-xs text-muted-foreground">
                  Former tech executive with 12+ years in e-commerce and marketplace development.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">PS</span>
                </div>
                <h3 className="font-semibold">Priya Sharma</h3>
                <p className="text-sm text-muted-foreground mb-2">Co-Founder & CTO</p>
                <p className="text-xs text-muted-foreground">
                  AI and machine learning expert focused on supply chain optimization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">AM</span>
                </div>
                <h3 className="font-semibold">Amit Mehta</h3>
                <p className="text-sm text-muted-foreground mb-2">VP of Operations</p>
                <p className="text-xs text-muted-foreground">
                  20+ years in food distribution and vendor relationship management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're a vendor looking for better suppliers or a supplier wanting to reach more customers, 
              we're here to help you grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup?type=vendor">
                <Button size="lg">Start as Vendor</Button>
              </Link>
              <Link to="/signup?type=supplier">
                <Button size="lg" variant="outline">Join as Supplier</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
