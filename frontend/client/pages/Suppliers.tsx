import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  ShoppingCart,
  Package,
  Filter,
  Plus,
  ArrowLeft,
  Store,
  Truck,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  businessType: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  verified: boolean;
  avatar: string;
  phone: string;
  email: string;
  description: string;
  specialties: string[];
  priceRange: string;
  deliveryTime: string;
  minOrder: number;
  products: {
    id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    inStock: boolean;
  }[];
  isPartner: boolean;
  lastOrderDate?: string;
  totalOrders: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Fresh Valley Produce",
    businessType: "Wholesale Vegetables",
    rating: 4.8,
    reviews: 245,
    location: "Dadar, Mumbai",
    distance: "2.3 km",
    verified: true,
    avatar: "/placeholder.svg",
    phone: "+91 98765 43210",
    email: "contact@freshvalley.com",
    description:
      "Premium quality fresh vegetables and fruits supplier with 15+ years experience",
    specialties: ["Vegetables", "Fruits", "Herbs", "Organic Produce"],
    priceRange: "₹50-500/kg",
    deliveryTime: "2-4 hours",
    minOrder: 500,
    products: [
      {
        id: "1",
        name: "Fresh Tomatoes",
        category: "Vegetables",
        price: 45,
        unit: "kg",
        inStock: true,
      },
      {
        id: "2",
        name: "Onions",
        category: "Vegetables",
        price: 35,
        unit: "kg",
        inStock: true,
      },
      {
        id: "3",
        name: "Green Chilies",
        category: "Vegetables",
        price: 80,
        unit: "kg",
        inStock: true,
      },
    ],
    isPartner: true,
    lastOrderDate: "2024-01-15",
    totalOrders: 23,
  },
  {
    id: "2",
    name: "Spice Master Co.",
    businessType: "Spice Wholesaler",
    rating: 4.6,
    reviews: 189,
    location: "Crawford Market, Mumbai",
    distance: "3.1 km",
    verified: true,
    avatar: "/placeholder.svg",
    phone: "+91 98765 43211",
    email: "info@spicemaster.com",
    description:
      "Authentic spices and masalas directly from farms across India",
    specialties: ["Spices", "Masalas", "Dry Fruits", "Herbs"],
    priceRange: "₹100-2000/kg",
    deliveryTime: "1-3 hours",
    minOrder: 300,
    products: [
      {
        id: "4",
        name: "Red Chili Powder",
        category: "Spices",
        price: 180,
        unit: "kg",
        inStock: true,
      },
      {
        id: "5",
        name: "Turmeric Powder",
        category: "Spices",
        price: 120,
        unit: "kg",
        inStock: true,
      },
      {
        id: "6",
        name: "Garam Masala",
        category: "Spices",
        price: 200,
        unit: "kg",
        inStock: false,
      },
    ],
    isPartner: true,
    lastOrderDate: "2024-01-18",
    totalOrders: 15,
  },
  {
    id: "3",
    name: "Dairy Express",
    businessType: "Dairy Products",
    rating: 4.7,
    reviews: 156,
    location: "Bandra, Mumbai",
    distance: "4.5 km",
    verified: true,
    avatar: "/placeholder.svg",
    phone: "+91 98765 43212",
    email: "orders@dairyexpress.com",
    description: "Fresh dairy products with daily delivery service",
    specialties: ["Milk", "Cheese", "Butter", "Yogurt", "Paneer"],
    priceRange: "₹30-800/unit",
    deliveryTime: "30 min - 2 hours",
    minOrder: 200,
    products: [
      {
        id: "7",
        name: "Fresh Milk",
        category: "Dairy",
        price: 55,
        unit: "liter",
        inStock: true,
      },
      {
        id: "8",
        name: "Paneer",
        category: "Dairy",
        price: 280,
        unit: "kg",
        inStock: true,
      },
    ],
    isPartner: false,
    lastOrderDate: "2024-01-20",
    totalOrders: 8,
  },
  {
    id: "4",
    name: "Grain & More",
    businessType: "Grains & Pulses",
    rating: 4.5,
    reviews: 98,
    location: "Andheri, Mumbai",
    distance: "5.2 km",
    verified: false,
    avatar: "/placeholder.svg",
    phone: "+91 98765 43213",
    email: "sales@grainmore.com",
    description: "Wholesale grains and pulses at competitive prices",
    specialties: ["Rice", "Wheat", "Pulses", "Flour"],
    priceRange: "₹40-200/kg",
    deliveryTime: "4-6 hours",
    minOrder: 1000,
    products: [
      {
        id: "9",
        name: "Basmati Rice",
        category: "Grains",
        price: 120,
        unit: "kg",
        inStock: true,
      },
      {
        id: "10",
        name: "Wheat Flour",
        category: "Grains",
        price: 45,
        unit: "kg",
        inStock: true,
      },
    ],
    isPartner: false,
    totalOrders: 3,
  },
];

export default function Suppliers() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [favorites, setFavorites] = useState<string[]>(["1", "2"]); // Mock favorite supplier IDs

  if (!isAuthenticated) {
    navigate("/signin");
    return null;
  }

  const categories = [...new Set(mockSuppliers.flatMap((s) => s.specialties))];
  const locations = [...new Set(mockSuppliers.map((s) => s.location))];

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.specialties.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      categoryFilter === "all" || supplier.specialties.includes(categoryFilter);
    const matchesLocation =
      locationFilter === "all" || supplier.location === locationFilter;
    const matchesVerified = !verifiedOnly || supplier.verified;

    return (
      matchesSearch && matchesCategory && matchesLocation && matchesVerified
    );
  });

  const toggleFavorite = (supplierId: string) => {
    setFavorites((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId],
    );

    const action = favorites.includes(supplierId) ? "removed from" : "added to";
    toast({
      title: `Supplier ${action} favorites`,
      description: `${suppliers.find((s) => s.id === supplierId)?.name} has been ${action} your favorites.`,
    });
  };

  const contactSupplier = (supplier: Supplier) => {
    toast({
      title: "Opening contact",
      description: `Redirecting to contact ${supplier.name}...`,
    });
  };

  const viewProducts = (supplier: Supplier) => {
    navigate(`/marketplace?supplier=${supplier.id}`);
  };

  if (selectedSupplier) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                StreetSupply
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/marketplace"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Marketplace
              </Link>
              <Link
                to="/suppliers"
                className="text-sm text-foreground font-medium"
              >
                Suppliers
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Supplier Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSupplier(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Suppliers
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Supplier Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={selectedSupplier.avatar} />
                      <AvatarFallback className="text-lg">
                        {selectedSupplier.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h1 className="text-2xl font-bold">
                          {selectedSupplier.name}
                        </h1>
                        {selectedSupplier.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {selectedSupplier.isPartner && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Partner
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">
                        {selectedSupplier.businessType}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {selectedSupplier.rating}
                          </span>
                          <span className="text-muted-foreground">
                            ({selectedSupplier.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSupplier.location}</span>
                          <span className="text-muted-foreground">
                            • {selectedSupplier.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={
                        favorites.includes(selectedSupplier.id)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleFavorite(selectedSupplier.id)}
                    >
                      <Heart
                        className={`h-4 w-4 mr-2 ${favorites.includes(selectedSupplier.id) ? "fill-current" : ""}`}
                      />
                      {favorites.includes(selectedSupplier.id)
                        ? "Favorited"
                        : "Add to Favorites"}
                    </Button>
                  </div>

                  <p className="mt-4 text-muted-foreground">
                    {selectedSupplier.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedSupplier.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Business Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Price Range
                      </p>
                      <p className="font-medium">
                        {selectedSupplier.priceRange}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Delivery Time
                      </p>
                      <p className="font-medium">
                        {selectedSupplier.deliveryTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Minimum Order
                      </p>
                      <p className="font-medium">
                        ₹{selectedSupplier.minOrder.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Orders
                      </p>
                      <p className="font-medium">
                        {selectedSupplier.totalOrders} orders
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedSupplier.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                          <p className="text-sm font-medium">
                            ₹{product.price}/{product.unit}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={product.inStock ? "default" : "secondary"}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                          {product.inStock && (
                            <Button size="sm">
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => viewProducts(selectedSupplier)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    View All Products in Marketplace
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedSupplier.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedSupplier.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => contactSupplier(selectedSupplier)}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {selectedSupplier.isPartner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Partnership Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Priority delivery</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Bulk discounts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Credit terms available</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Dedicated support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              {selectedSupplier.lastOrderDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last Order:</span>
                        <span>
                          {new Date(
                            selectedSupplier.lastOrderDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Orders:</span>
                        <span>{selectedSupplier.totalOrders}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Order History
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              StreetSupply
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/marketplace"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Marketplace
            </Link>
            <Link
              to="/suppliers"
              className="text-sm text-foreground font-medium"
            >
              Suppliers
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Supplier Directory
            </h1>
            <p className="text-muted-foreground">
              Find and manage your trusted supplier network
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Supplier
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Suppliers</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search suppliers by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full lg:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card
                  key={supplier.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={supplier.avatar} />
                          <AvatarFallback>
                            {supplier.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {supplier.businessType}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(supplier.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.includes(supplier.id) ? "fill-current text-red-500" : ""}`}
                        />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {supplier.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({supplier.reviews})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {supplier.location} • {supplier.distance}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Delivery: {supplier.deliveryTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {supplier.specialties.slice(0, 3).map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {supplier.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{supplier.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      {supplier.verified && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {supplier.isPartner && (
                        <Badge className="bg-purple-100 text-purple-800 text-xs">
                          Partner
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedSupplier(supplier)}
                      >
                        <Store className="mr-1 h-3 w-3" />
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => contactSupplier(supplier)}
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers
                .filter((s) => favorites.includes(s.id))
                .map((supplier) => (
                  <Card
                    key={supplier.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={supplier.avatar} />
                            <AvatarFallback>
                              {supplier.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{supplier.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {supplier.businessType}
                            </p>
                          </div>
                        </div>
                        <Heart className="h-4 w-4 fill-current text-red-500" />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          View Profile
                        </Button>
                        <Button size="sm" className="flex-1">
                          Quick Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="partners">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers
                .filter((s) => s.isPartner)
                .map((supplier) => (
                  <Card
                    key={supplier.id}
                    className="hover:shadow-lg transition-shadow border-purple-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={supplier.avatar} />
                            <AvatarFallback>
                              {supplier.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{supplier.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {supplier.businessType}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          Partner
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          View Profile
                        </Button>
                        <Button size="sm" className="flex-1">
                          Priority Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
