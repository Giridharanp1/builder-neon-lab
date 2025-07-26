import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Search,
  MapPin,
  Star,
  ShoppingCart,
  Filter,
  Plus,
  Minus,
  Bell,
  Heart,
  Clock,
  Truck
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import CartSidebar from "@/components/CartSidebar";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  supplier: {
    id: string;
    name: string;
    location: string;
    rating: number;
    verified: boolean;
    distance: string;
  };
  inStock: boolean;
  minOrder: number;
  description: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 45,
    unit: 'kg',
    image: '/placeholder.svg',
    supplier: {
      id: 'sup1',
      name: 'Fresh Valley Produce',
      location: 'Dadar, Mumbai',
      rating: 4.8,
      verified: true,
      distance: '2.3 km'
    },
    inStock: true,
    minOrder: 5,
    description: 'Premium quality fresh tomatoes, perfect for cooking'
  },
  {
    id: '2',
    name: 'Red Chili Powder',
    category: 'Spices',
    price: 180,
    unit: 'kg',
    image: '/placeholder.svg',
    supplier: {
      id: 'sup2',
      name: 'Spice Master Co.',
      location: 'Crawford Market, Mumbai',
      rating: 4.6,
      verified: true,
      distance: '3.1 km'
    },
    inStock: true,
    minOrder: 1,
    description: 'Authentic red chili powder with perfect heat and color'
  },
  {
    id: '3',
    name: 'Fresh Milk',
    category: 'Dairy',
    price: 55,
    unit: 'liter',
    image: '/placeholder.svg',
    supplier: {
      id: 'sup3',
      name: 'Dairy Express',
      location: 'Bandra, Mumbai',
      rating: 4.7,
      verified: true,
      distance: '4.5 km'
    },
    inStock: true,
    minOrder: 10,
    description: 'Fresh cow milk, delivered daily'
  },
  {
    id: '4',
    name: 'Basmati Rice',
    category: 'Grains',
    price: 120,
    unit: 'kg',
    image: '/placeholder.svg',
    supplier: {
      id: 'sup4',
      name: 'Grain & More',
      location: 'Andheri, Mumbai',
      rating: 4.5,
      verified: false,
      distance: '5.2 km'
    },
    inStock: true,
    minOrder: 10,
    description: 'Premium basmati rice, aged for perfect aroma'
  },
  {
    id: '5',
    name: 'Fresh Chicken',
    category: 'Meat',
    price: 280,
    unit: 'kg',
    image: '/placeholder.svg',
    supplier: {
      id: 'sup5',
      name: 'Meat Junction',
      location: 'Kurla, Mumbai',
      rating: 4.4,
      verified: true,
      distance: '6.1 km'
    },
    inStock: false,
    minOrder: 2,
    description: 'Fresh chicken, cleaned and ready to cook'
  }
];

export default function Marketplace() {
  const { user, isAuthenticated, logout } = useAuth();
  const { addItem, isInCart, totalItems } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize search from URL parameters
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // Filter products based on search criteria
    let filtered = mockProducts;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (showVerifiedOnly) {
      filtered = filtered.filter(product => product.supplier.verified);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.supplier.rating - a.supplier.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.supplier.distance) - parseFloat(b.supplier.distance));
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, showVerifiedOnly, sortBy, isAuthenticated, navigate]);

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || product.minOrder;
    addItem({
      id: product.id,
      supplierId: product.supplier.id,
      supplierName: product.supplier.name,
      productName: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.image,
      minOrder: product.minOrder,
      quantity
    });

    toast({
      title: "Added to cart",
      description: `${quantity} ${product.unit} of ${product.name} added to your cart.`,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const categories = [...new Set(mockProducts.map(p => p.category))];

  if (!user) {
    return null;
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
            <span className="text-xl font-bold text-foreground">StreetSupply</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/marketplace" className="text-sm text-foreground font-medium">
              Marketplace
            </Link>
            <Link to="/orders" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label>Search Products</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products, suppliers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label>Price Range (₹)</Label>
                  <div className="mt-4 px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Only */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="verified-only"
                    checked={showVerifiedOnly}
                    onCheckedChange={setShowVerifiedOnly}
                  />
                  <Label htmlFor="verified-only">Verified suppliers only</Label>
                </div>

                {/* Sort By */}
                <div>
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                Marketplace ({filteredProducts.length} products)
              </h1>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const quantity = quantities[product.id] || product.minOrder;
                const inCart = isInCart(product.id);

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive">Out of Stock</Badge>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                            <CardDescription className="text-xs">
                              {product.description}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {product.supplier.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {product.supplier.name}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                {product.supplier.rating}
                              </div>
                              <span>•</span>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {product.supplier.distance}
                              </div>
                              {product.supplier.verified && (
                                <>
                                  <span>•</span>
                                  <Badge variant="default" className="text-xs px-1">
                                    Verified
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold">
                            ₹{product.price}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{product.unit}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Min order: {product.minOrder} {product.unit}
                          </p>
                        </div>
                      </div>

                      {product.inStock ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, Math.max(product.minOrder, quantity - 1))}
                              disabled={quantity <= product.minOrder}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="flex-1 text-center text-sm font-medium">
                              {quantity} {product.unit}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            className="w-full"
                            onClick={() => handleAddToCart(product)}
                            disabled={inCart}
                          >
                            {inCart ? (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Added to Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart (₹{(product.price * quantity).toLocaleString()})
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full" disabled>
                            <Clock className="mr-2 h-4 w-4" />
                            Out of Stock
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full">
                            <Bell className="mr-2 h-3 w-3" />
                            Notify when available
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 500]);
                  setShowVerifiedOnly(false);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
