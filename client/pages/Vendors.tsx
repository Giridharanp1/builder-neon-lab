import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

export default function Vendors() {
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
            <Link to="/vendors" className="text-sm text-foreground font-medium">
              For Vendors
            </Link>
            <Link to="/suppliers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Suppliers
            </Link>
            <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Placeholder Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Vendor Dashboard Coming Soon
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            We're building an amazing experience for street food vendors. This page will include supplier discovery, order management, and AI-powered recommendations.
          </p>
          
          <Card className="text-left">
            <CardHeader>
              <CardTitle>What's Coming:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Find and connect with nearby suppliers</li>
                <li>• Compare prices across multiple vendors</li>
                <li>• Read verified reviews and ratings</li>
                <li>• AI-powered supplier recommendations</li>
                <li>• Demand prediction and inventory planning</li>
                <li>• Seamless order placement and tracking</li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <Button>
              Notify Me When Ready
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
