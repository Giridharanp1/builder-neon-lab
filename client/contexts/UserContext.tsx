import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  type: "vendor" | "supplier";
  location?: string;
  verified: boolean;
}

interface UserContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    type?: "vendor" | "supplier",
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    type: "vendor" | "supplier",
    location?: string,
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("streetSupplyUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    type?: "vendor" | "supplier",
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
        type: type || "vendor",
        location: "Mumbai, Maharashtra",
        verified: true,
      };

      setUser(mockUser);
      localStorage.setItem("streetSupplyUser", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    type: "vendor" | "supplier",
    location?: string,
  ) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        type,
        location: location || "Mumbai, Maharashtra",
        verified: false,
      };

      setUser(mockUser);
      localStorage.setItem("streetSupplyUser", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("streetSupplyUser");
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
