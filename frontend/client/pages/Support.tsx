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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Video,
  HelpCircle,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Headphones,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account on StreetSupply?",
        a: "To create an account, click the 'Sign Up' button on the homepage. Choose whether you're a vendor or supplier, fill in your details, and verify your email address.",
      },
      {
        q: "What's the difference between vendor and supplier accounts?",
        a: "Vendor accounts are for street food sellers who buy ingredients and supplies. Supplier accounts are for businesses that sell ingredients to vendors.",
      },
      {
        q: "Is StreetSupply free to use?",
        a: "Yes, basic features are free. We also offer premium plans with advanced features like unlimited orders and AI insights.",
      },
    ],
  },
  {
    category: "Orders & Payments",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse the marketplace, add items to your cart, review your order, and proceed to checkout. You can pay using various methods including UPI, cards, and cash on delivery.",
      },
      {
        q: "Can I cancel or modify my order?",
        a: "You can cancel or modify orders within 30 minutes of placement, provided the supplier hasn't confirmed it yet.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI, debit/credit cards, net banking, digital wallets, and cash on delivery for eligible orders.",
      },
    ],
  },
  {
    category: "Suppliers",
    questions: [
      {
        q: "How are suppliers verified?",
        a: "Suppliers undergo document verification, quality checks, and business legitimacy verification before being approved on our platform.",
      },
      {
        q: "How do I become a partner supplier?",
        a: "Partner suppliers enjoy benefits like priority listing and bulk discounts. Contact our supplier team to learn about partnership requirements.",
      },
      {
        q: "What if I have issues with a supplier?",
        a: "Report any issues through our support system. We investigate all complaints and take appropriate action to maintain quality standards.",
      },
    ],
  },
];

export default function Support() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!isAuthenticated) {
    navigate("/signin");
    return null;
  }

  const filteredFAQs = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          searchQuery === "" ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter(
      (category) =>
        selectedCategory === "all" ||
        category.category
          .toLowerCase()
          .includes(selectedCategory.toLowerCase()) ||
        category.questions.length > 0,
    );

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
            <Link to="/support" className="text-sm text-foreground font-medium">
              Support
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
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Support Center
            </h1>
            <p className="text-muted-foreground">
              Get help in Hindi, Tamil, and English
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant help from our support team
              </p>
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Call us for immediate assistance
              </p>
              <p className="font-mono text-sm">+91 1800-STREET-1</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn with step-by-step guides
              </p>
              <Badge variant="outline">Available in 3 languages</Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-6">
                  {filteredFAQs.map((category, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-lg mb-4">
                        {category.category}
                      </h3>
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-2"
                      >
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`item-${index}-${faqIndex}`}
                          >
                            <AccordionTrigger className="text-left">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-5 w-5" />
                    Vendor Guides
                  </CardTitle>
                  <CardDescription>
                    Learn how to use StreetSupply as a vendor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        Getting Started as a Vendor
                      </p>
                      <p className="text-xs text-muted-foreground">
                        5 min read
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        How to Find Reliable Suppliers
                      </p>
                      <p className="text-xs text-muted-foreground">
                        8 min read
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        Managing Orders Efficiently
                      </p>
                      <p className="text-xs text-muted-foreground">
                        6 min read
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-5 w-5" />
                    Supplier Guides
                  </CardTitle>
                  <CardDescription>
                    Learn how to use StreetSupply as a supplier
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        Setting Up Your Supplier Profile
                      </p>
                      <p className="text-xs text-muted-foreground">
                        7 min read
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        Managing Inventory & Pricing
                      </p>
                      <p className="text-xs text-muted-foreground">
                        10 min read
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded hover:bg-muted/50 cursor-pointer">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">
                        Becoming a Partner Supplier
                      </p>
                      <p className="text-xs text-muted-foreground">
                        4 min read
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">
                        +91 1800-STREET-1 (24/7)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">
                        support@streetsupply.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">
                        Available 9 AM - 9 PM IST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Languages</p>
                      <p className="text-sm text-muted-foreground">
                        Hindi, Tamil, English
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                  <CardDescription>
                    Expected response times for different channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Live Chat</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Under 2 minutes
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Immediate
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">
                      Within 4 hours
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
                <CardDescription>All systems operational</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Marketplace</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Payment Processing</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Order Management</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Notifications</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
