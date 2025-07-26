import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  Bell,
  Settings,
  Search,
  Plus,
  MapPin,
  Star,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems, totalAmount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isVendor = user.type === 'vendor';

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
            <Link to="/dashboard" className="text-sm text-foreground font-medium">
              Dashboard
            </Link>
            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Orders
            </Link>
            {isVendor && (
              <Link to="/suppliers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Suppliers
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            {isVendor && (
              <Link to="/marketplace">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.name}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {isVendor ? 'Manage your orders and find new suppliers' : 'Manage your products and connect with vendors'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={user.verified ? "default" : "secondary"}>
                {user.verified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant="outline">{user.type}</Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isVendor ? 'Active Orders' : 'Total Products'}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isVendor ? '12' : '45'}</div>
              <p className="text-xs text-muted-foreground">
                {isVendor ? '+2 from last week' : '+5 this month'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isVendor ? 'Total Spent' : 'Total Sales'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{isVendor ? '15,240' : '87,450'}</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {isVendor ? 'Suppliers' : 'Vendors'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isVendor ? '8' : '23'}</div>
              <p className="text-xs text-muted-foreground">
                {isVendor ? 'Active suppliers' : 'Active customers'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cart Total</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalItems} items in cart
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/marketplace">
                <Button className="w-full justify-start" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  {isVendor ? 'Find Suppliers' : 'Browse Vendors'}
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                {isVendor ? 'Place New Order' : 'Add Product'}
              </Button>
              
              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Package className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
              </Link>

              <Button variant="outline" className="w-full justify-start" size="lg">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order #12345 delivered</p>
                      <p className="text-xs text-muted-foreground">Fresh vegetables from Dadar Market</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      2 hours ago
                    </div>
                  </div>

                  <div className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New review received</p>
                      <p className="text-xs text-muted-foreground">5 stars from Spice Master Co.</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      1 day ago
                    </div>
                  </div>

                  <div className="p-4 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New supplier nearby</p>
                      <p className="text-xs text-muted-foreground">Fresh Dairy Express - 2.1 km away</p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      2 days ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommended Supplier</CardTitle>
                <CardDescription>Based on your order history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>FV</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">Fresh Valley Produce</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">4.8 • 2.3 km away</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demand Prediction</CardTitle>
                <CardDescription>For next week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tomatoes</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Onions</span>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Spices</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Savings</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹2,340</div>
                  <p className="text-xs text-muted-foreground">18% savings vs market price</p>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
