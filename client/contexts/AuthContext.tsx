import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  type: "vendor" | "supplier";
  location?: string;
  verified: boolean;
  avatar?: string;
  phone?: string;
  businessName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: "vendor" | "supplier";
  location?: string;
  businessName?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("streetSupplyUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("streetSupplyUser");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (email === "test@test.com" && password === "password") {
        throw new Error("Invalid email or password");
      }

      // Mock user data based on email
      const userType = email.includes("supplier") ? "supplier" : "vendor";
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email
          .split("@")[0]
          .replace(/[^a-zA-Z]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        type: userType,
        location: "Mumbai, Maharashtra",
        verified: true,
        avatar: "/placeholder.svg",
        phone: "+91 98765 43210",
        businessName:
          userType === "vendor"
            ? "Mumbai Street Kitchen"
            : "Fresh Supplies Co.",
      };

      setUser(mockUser);
      localStorage.setItem("streetSupplyUser", JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if email already exists (mock)
      if (data.email === "existing@test.com") {
        throw new Error("Email already exists");
      }

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.name,
        type: data.type,
        location: data.location || "Mumbai, Maharashtra",
        verified: false,
        avatar: "/placeholder.svg",
        phone: data.phone,
        businessName: data.businessName,
      };

      setUser(mockUser);
      localStorage.setItem("streetSupplyUser", JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("streetSupplyUser");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
