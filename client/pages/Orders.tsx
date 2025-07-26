import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  Truck, 
  Check, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Phone,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  total: number;
  supplier: {
    id: string;
    name: string;
    location: string;
    avatar: string;
    rating: number;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    price: number;
    image: string;
  }[];
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 2340,
    supplier: {
      id: 'sup1',
      name: 'Fresh Valley Produce',
      location: 'Dadar, Mumbai',
      avatar: '/placeholder.svg',
      rating: 4.8,
      phone: '+91 98765 43210'
    },
    items: [
      { id: '1', name: 'Fresh Tomatoes', quantity: 10, unit: 'kg', price: 45, image: '/placeholder.svg' },
      { id: '2', name: 'Onions', quantity: 15, unit: 'kg', price: 35, image: '/placeholder.svg' },
      { id: '3', name: 'Green Chilies', quantity: 2, unit: 'kg', price: 80, image: '/placeholder.svg' }
    ],
    trackingNumber: 'TRK123456789'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-18',
    status: 'in_transit',
    total: 1580,
    supplier: {
      id: 'sup2',
      name: 'Spice Master Co.',
      location: 'Crawford Market, Mumbai',
      avatar: '/placeholder.svg',
      rating: 4.6,
      phone: '+91 98765 43211'
    },
    items: [
      { id: '4', name: 'Red Chili Powder', quantity: 2, unit: 'kg', price: 180, image: '/placeholder.svg' },
      { id: '5', name: 'Turmeric Powder', quantity: 3, unit: 'kg', price: 120, image: '/placeholder.svg' },
      { id: '6', name: 'Garam Masala', quantity: 1, unit: 'kg', price: 200, image: '/placeholder.svg' }
    ],
    estimatedDelivery: '2024-01-20',
    trackingNumber: 'TRK123456790'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-01-20',
    status: 'confirmed',
    total: 890,
    supplier: {
      id: 'sup3',
      name: 'Dairy Express',
      location: 'Bandra, Mumbai',
      avatar: '/placeholder.svg',
      rating: 4.7,
      phone: '+91 98765 43212'
    },
    items: [
      { id: '7', name: 'Fresh Milk', quantity: 10, unit: 'liter', price: 55, image: '/placeholder.svg' },
      { id: '8', name: 'Paneer', quantity: 2, unit: 'kg', price: 280, image: '/placeholder.svg' }
    ],
    estimatedDelivery: '2024-01-22'
  }
];

export default function Orders() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [orders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <Check className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const reorderItems = (order: Order) => {
    // Simulate adding items to cart for reordering
    alert(`Added ${order.items.length} items to cart for reordering from ${order.supplier.name}`);
  };

  if (selectedOrder) {
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
              <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Marketplace
              </Link>
              <Link to="/orders" className="text-sm text-foreground font-medium">
                Orders
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Order Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedOrder(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Details</h1>
              <p className="text-muted-foreground">{selectedOrder.orderNumber}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Information</CardTitle>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">₹{selectedOrder.total.toLocaleString()}</p>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="font-medium">{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedOrder.trackingNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-medium font-mono">{selectedOrder.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover bg-muted"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} × ₹{item.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supplier Info & Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedOrder.supplier.avatar} />
                      <AvatarFallback>{selectedOrder.supplier.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{selectedOrder.supplier.name}</h4>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{selectedOrder.supplier.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.supplier.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.supplier.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Supplier
                    </Button>
                    <Button className="w-full" onClick={() => reorderItems(selectedOrder)}>
                      <Package className="mr-2 h-4 w-4" />
                      Reorder Items
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                  {selectedOrder.status === 'in_transit' && (
                    <Button variant="outline" className="w-full">
                      <Truck className="mr-2 h-4 w-4" />
                      Track Delivery
                    </Button>
                  )}
                  {selectedOrder.status === 'delivered' && (
                    <Button variant="outline" className="w-full">
                      <Star className="mr-2 h-4 w-4" />
                      Rate Order
                    </Button>
                  )}
                </CardContent>
              </Card>
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
            <span className="text-xl font-bold text-foreground">StreetSupply</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link to="/orders" className="text-sm text-foreground font-medium">
              Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
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
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>
          <Button>
            <Package className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders or suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No orders found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start shopping to see your orders here'
                  }
                </p>
                <Link to="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} • {order.supplier.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                      </Badge>
                      <span className="font-semibold">₹{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={order.supplier.avatar} />
                      <AvatarFallback>{order.supplier.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{order.supplier.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{order.supplier.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.supplier.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{order.items.length} items</span>
                      {order.estimatedDelivery && (
                        <span>
                          <Calendar className="inline h-3 w-3 mr-1" />
                          Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      {order.status === 'delivered' && (
                        <Button size="sm" onClick={() => reorderItems(order)}>
                          <Package className="mr-2 h-4 w-4" />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
