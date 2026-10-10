"use client";

import {
  WarningCircle as AlertCircle,
  Camera,
  Lock,
  SignIn as LogIn,
  Envelope as Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "@phosphor-icons/react";
import React, { useState } from "react";

import { useCustomerAuth } from "@/context/CustomerAuthContext";

export const CustomerAuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, loginCustomer, registerCustomer } = useCustomerAuth();

  const [regForm, setRegForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    profilePic: "",
  });

  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [picPreview, setPicPreview] = useState<string>("");

  if (!authModalOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg("Profile picture must be smaller than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPicPreview(base64);
        setRegForm({ ...regForm, profilePic: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await registerCustomer(regForm);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Failed to create account.");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await loginCustomer(loginForm);
    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Invalid credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white text-ink border border-brand-600/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-600/40 flex items-center justify-center text-brand-600">
              {authMode === "register" ? <UserPlus size={18} /> : <LogIn size={18} />}
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-ink">
                {authMode === "register" ? "Customer Registration" : "Customer Sign In"}
              </h3>
              <p className="text-[11px] text-brand-700 font-medium">
                {authMode === "register"
                  ? "Create profile to proceed with cab booking"
                  : "Sign in to access your bookings & profile"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="flex bg-surface-sunken p-1 rounded-2xl border border-hairline">
          <button
            onClick={() => {
              setAuthMode("register");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "register" ? "bg-brand-600 text-white shadow-sm" : "text-ink-subtle hover:text-ink"
            }`}
          >
            Create New Account
          </button>
          <button
            onClick={() => {
              setAuthMode("login");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              authMode === "login" ? "bg-brand-600 text-white shadow-sm" : "text-ink-subtle hover:text-ink"
            }`}
          >
            Sign In
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-center gap-2 font-medium">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* REGISTER FORM */}
        {authMode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Profile Pic Upload (Optional) */}
            <div className="flex flex-col items-center justify-center gap-1.5 py-1">
              <div className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-brand-600 bg-brand-50 flex items-center justify-center overflow-hidden shadow-inner">
                  {picPreview ? (
                    <img src={picPreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={36} className="text-brand-600/60" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-brand-700 transition-colors">
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <span className="text-[11px] text-brand-700 font-semibold">Profile Photo (Optional)</span>
            </div>

            {/* Name */}
            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <User size={12} className="text-brand-600" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                placeholder="e.g. S. Karthik"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <Phone size={12} className="text-brand-600" /> Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink font-mono outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <Mail size={12} className="text-brand-600" /> Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                placeholder="karthik@gmail.com"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
                required
              />
            </div>

            {/* Address (Optional) */}
            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <MapPin size={12} className="text-brand-600" /> Pickup / Residence Address (Optional)
              </label>
              <input
                type="text"
                value={regForm.address}
                onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                placeholder="No. 12, Anna Nagar, Chennai"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <Lock size={12} className="text-brand-600" /> Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                placeholder="Minimum 4 characters"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 rounded-xl transition-all shadow-md mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              {loading ? "Creating Account..." : "Register & Continue Booking"}
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <Mail size={12} className="text-brand-600" /> Email or Phone Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                placeholder="Email or 10-digit mobile"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-3 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                <Lock size={12} className="text-brand-600" /> Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                className="w-full bg-surface-alt border border-hairline rounded-xl px-3.5 py-3 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-sans text-xs uppercase tracking-widest font-bold py-3.5 rounded-xl transition-all shadow-md mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {loading ? "Signing In..." : "Sign In & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
