import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, TrendingUp, Users, Zap, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">StreetSupply</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/vendors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Connecting Street Food Vendors with
              <span className="text-primary"> Trusted Suppliers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover nearby suppliers, compare prices, read verified reviews, and streamline your procurement process with AI-powered recommendations.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search for suppliers, products, or ingredients..." 
                  className="pl-10 h-12 text-base"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Your location" 
                  className="pl-10 h-12 w-full sm:w-40"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Find Suppliers
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span>Popular searches:</span>
              <Badge variant="secondary">Vegetables</Badge>
              <Badge variant="secondary">Spices</Badge>
              <Badge variant="secondary">Dairy</Badge>
              <Badge variant="secondary">Meat</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose StreetSupply?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cut out middlemen, reduce costs, and streamline your supply chain with our smart marketplace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Find Nearby Suppliers</CardTitle>
                <CardDescription>
                  Discover verified suppliers in your area and reduce delivery costs and time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Compare Prices</CardTitle>
                <CardDescription>
                  Get real-time pricing from multiple suppliers and choose the best deals for your business.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Verified Reviews</CardTitle>
                <CardDescription>
                  Read authentic reviews from other vendors to make informed purchasing decisions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Get smart supplier suggestions based on your order history, pricing preferences, and location.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Seamless Ordering</CardTitle>
                <CardDescription>
                  Place orders easily with integrated payment processing and order tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Demand Prediction</CardTitle>
                <CardDescription>
                  AI-powered insights help you predict demand based on seasons, trends, and your purchase history.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
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
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25%</div>
              <div className="text-sm text-muted-foreground">Average Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of street food vendors who are already saving time and money with StreetSupply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Start as Vendor
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Join as Supplier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold">StreetSupply</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting street food vendors with trusted suppliers for a better tomorrow.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/find-suppliers">Find Suppliers</Link></li>
                <li><Link to="/compare-prices">Compare Prices</Link></li>
                <li><Link to="/track-orders">Track Orders</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Suppliers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/list-products">List Products</Link></li>
                <li><Link to="/manage-inventory">Manage Inventory</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 StreetSupply. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
