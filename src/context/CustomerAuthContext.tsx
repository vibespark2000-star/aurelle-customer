"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch, CUSTOMER_TOKEN_KEY, CUSTOMER_USER_KEY } from "@/lib/apiClient";

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  profilePic?: string;
  role: string;
}

interface CustomerAuthContextType {
  user: CustomerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  accountModalOpen: boolean;
  setAccountModalOpen: (open: boolean) => void;
  userBookings: any[];
  loadingBookings: boolean;
  fetchUserBookings: () => Promise<void>;
  loginCustomer: (credentials: {
    identifier: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    profilePic?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateCustomerProfile: (data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    profilePic?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logoutCustomer: () => void;
  openAuthForBooking: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Load user session from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);
      const storedUser = localStorage.getItem(CUSTOMER_USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse stored auth session", e);
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setUserBookings([]);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_USER_KEY);
  }, []);

  const fetchUserBookings = useCallback(async () => {
    if (!token) return;
    setLoadingBookings(true);
    try {
      const res = await apiFetch("/api/auth/customer/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Expired or invalid session: sign the customer out so they can log in again.
      if (res.status === 401) {
        clearSession();
        return;
      }

      const data = await res.json();
      if (data.success && data.bookings) setUserBookings(data.bookings);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  }, [token, clearSession]);

  useEffect(() => {
    if (token) fetchUserBookings();
  }, [token, fetchUserBookings]);

  /** Calls a login/register endpoint and stores the returned session on success. */
  const authenticate = async (endpoint: string, payload: object, fallbackError: string) => {
    try {
      const res = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      const data = await res.json();

      if (!data.success || !data.user || !data.token) {
        return { success: false, error: data.error || fallbackError };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(data.user));
      setAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const loginCustomer = (credentials: { identifier: string; password: string }) =>
    authenticate("/api/auth/customer/login", credentials, "Login failed");

  const registerCustomer = (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    profilePic?: string;
    address?: string;
  }) => authenticate("/api/auth/customer/register", data, "Registration failed");

  const updateCustomerProfile = async (data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    profilePic?: string;
  }) => {
    if (!user) return { success: false, error: "Not logged in" };
    try {
      const res = await apiFetch("/api/auth/customer/me", { method: "PUT", body: JSON.stringify(data) });
      const resData = await res.json();

      if (!resData.success || !resData.user) {
        return { success: false, error: resData.error || "Update failed" };
      }

      setUser(resData.user);
      localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(resData.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logoutCustomer = () => {
    clearSession();
    setAccountModalOpen(false);
  };

  const openAuthForBooking = () => {
    setAuthMode("register");
    setAuthModalOpen(true);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        accountModalOpen,
        setAccountModalOpen,
        userBookings,
        loadingBookings,
        fetchUserBookings,
        loginCustomer,
        registerCustomer,
        updateCustomerProfile,
        logoutCustomer,
        openAuthForBooking,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
};
