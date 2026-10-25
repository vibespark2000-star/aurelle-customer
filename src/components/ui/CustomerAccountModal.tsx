"use client";
import {
  Prohibit as Ban,
  Calendar,
  Camera,
  Car,
  CheckCircle as CheckCircle2,
  CaretRight as ChevronRight,
  Clock,
  ClockCounterClockwise as History,
  Lock,
  SignOut as LogOut,
  Envelope as Mail,
  MapPin,
  Phone,
  PhoneCall,
  ShieldCheck,
  User,
  X,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useBooking } from "@/context/BookingContext";

export const CustomerAccountModal: React.FC = () => {
  const {
    user,
    accountModalOpen,
    setAccountModalOpen,
    logoutCustomer,
    userBookings,
    loadingBookings,
    fetchUserBookings,
    updateCustomerProfile,
  } = useCustomerAuth();

  const { setBookingDrawerOpen } = useBooking();

  const [activeTab, setActiveTab] = useState<"history" | "profile">("history");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    address: "",
    profilePic: "",
  });
  const [picPreview, setPicPreview] = useState<string>("");
  const [updateMsg, setUpdateMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        address: user.address || "",
        profilePic: user.profilePic || "",
      });
      setPicPreview(user.profilePic || "");
    }
  }, [user?.id, user?.name, user?.address, user?.profilePic]);

  if (!user) return null;

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(`Are you sure you want to cancel booking reference ${bookingId}?`)) return;
    setCancellingBookingId(bookingId);
    try {
      const res = await apiFetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "Cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        if (selectedBooking) {
          setSelectedBooking((prev: any) => (prev ? { ...prev, status: "Cancelled" } : null));
        }
        fetchUserBookings();
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("Profile picture must be smaller than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPicPreview(base64);
        setProfileForm((prev) => ({ ...prev, profilePic: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg("");
    setLoading(true);

    // Only send editable fields (name, address, profilePic)
    const res = await updateCustomerProfile({
      name: profileForm.name,
      address: profileForm.address,
      profilePic: profileForm.profilePic,
    });

    setLoading(false);

    if (res.success) {
      setUpdateMsg("Profile updated successfully!");
      setTimeout(() => setUpdateMsg(""), 4000);
    } else {
      setUpdateMsg(res.error || "Failed to update profile");
    }
  };

  return (
    <AnimatePresence>
      {accountModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAccountModalOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />

          {/* Rightside Slide-over Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
            className="relative flex h-full w-full max-w-lg flex-col bg-white text-ink shadow-2xl border-l border-brand-600/40"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4 bg-surface-alt">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-50 border-2 border-brand-600/50 flex items-center justify-center text-brand-600 overflow-hidden shrink-0 shadow-sm">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={22} />
                  )}
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-ink leading-tight">{user.name}</h3>
                  <p className="text-[11px] text-brand-700 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>{user.phone}</span> &bull; <span>{user.email}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={logoutCustomer}
                  className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-[11px] uppercase font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <LogOut size={13} /> Sign Out
                </button>
                <button
                  onClick={() => setAccountModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pt-4 pb-2 bg-white">
              <div className="flex bg-surface-sunken p-1 rounded-2xl border border-hairline">
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === "history" ? "bg-brand-600 text-white shadow-sm" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  <History size={14} /> My Rides ({userBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === "profile" ? "bg-brand-600 text-white shadow-sm" : "text-ink-subtle hover:text-ink"
                  }`}
                >
                  <User size={14} /> Account Profile
                </button>
              </div>
            </div>

            {updateMsg && (
              <div className="mx-6 my-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{updateMsg}</span>
              </div>
            )}

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
              {/* TAB 1: RIDE HISTORY */}
              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-brand-700">
                      Your Cab Bookings History
                    </span>
                    <button
                      onClick={fetchUserBookings}
                      className="text-[11px] text-brand-600 hover:underline font-bold"
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingBookings ? (
                    <div className="text-center py-10 text-xs text-gray-500 font-medium">
                      Loading your ride history...
                    </div>
                  ) : userBookings.length === 0 ? (
                    <div className="text-center py-12 bg-surface-alt rounded-2xl border border-dashed border-hairline space-y-3 px-4">
                      <Car size={36} className="mx-auto text-brand-600/60" />
                      <div>
                        <p className="text-xs font-bold text-ink">No cab bookings found yet.</p>
                        <p className="text-[11px] text-ink-subtle mt-0.5">
                          Book a pristine white cab to view your trip details and live driver tracking here.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAccountModalOpen(false);
                          setBookingDrawerOpen(true);
                        }}
                        className="bg-brand-600 hover:opacity-90 text-white font-extrabold text-[13px] px-4 py-2.5 rounded-full shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Car size={14} /> Book A White Cab Now
                      </button>
                    </div>
                  ) : (
                    userBookings.map((b) => (
                      <div
                        key={b._id || b.bookingId}
                        onClick={() => setSelectedBooking(b)}
                        className="bg-surface-alt border border-hairline hover:border-brand-600 rounded-2xl p-4 space-y-3 transition-all shadow-xs hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex justify-between items-start border-b border-hairline pb-2.5">
                          <div>
                            <span className="font-mono text-xs font-bold text-brand-600 block flex items-center gap-1">
                              {b.bookingId}{" "}
                              <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            <h4 className="font-sans text-sm font-bold text-ink">
                              {b.pickupCity} &rarr; {b.dropCity}
                            </h4>
                          </div>
                          <span
                            className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                              b.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : b.status === "Completed"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : b.status === "Cancelled"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : "bg-brand-50 text-brand-600 border-brand-200"
                            }`}
                          >
                            {b.status || "Pending"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-white p-2 rounded-xl border border-gray-100">
                            <span className="text-[11px] uppercase text-gray-400 font-bold block flex items-center gap-1">
                              <Calendar size={10} className="text-brand-600" /> Date &amp; Time
                            </span>
                            <span className="font-bold text-ink">
                              {b.pickupDate} at {b.pickupTime}
                            </span>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-gray-100">
                            <span className="text-[11px] uppercase text-gray-400 font-bold block flex items-center gap-1">
                              <Car size={10} className="text-brand-600" /> Class / Fare
                            </span>
                            <span className="font-bold text-ink">
                              {b.vehicleName} &bull;{" "}
                              <span className="text-brand-600">₹{b.totalFare?.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium pt-1">
                          <span>
                            Passenger: <strong className="text-gray-800">{b.customerName}</strong>
                          </span>
                          <span className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                            View Full Details &rarr;
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: MY PROFILE EDIT */}
              {activeTab === "profile" && (
                <form onSubmit={handleUpdate} className="space-y-4">
                  {/* Photo Upload & Header */}
                  <div className="bg-brand-50 p-4 rounded-2xl border border-brand-600/40 flex items-center gap-4">
                    <div className="relative group cursor-pointer shrink-0">
                      <div className="w-16 h-16 rounded-full border-2 border-brand-600 bg-white overflow-hidden flex items-center justify-center shadow-inner">
                        {picPreview ? (
                          <img src={picPreview} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={30} className="text-brand-600/60" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-brand-700 transition-colors">
                        <Camera size={12} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-ink">{user.name}</h4>
                      <p className="text-xs text-brand-700 font-medium">{user.email}</p>
                      <span className="text-[11px] uppercase font-bold bg-white text-brand-600 px-2 py-0.5 rounded border border-brand-600/30 mt-1 inline-block">
                        Customer Profile
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Full Name (Editable) */}
                    <div>
                      <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                        <User size={12} className="text-brand-600" /> Full Name{" "}
                        <span className="text-emerald-600 text-[11px] lowercase font-normal">(editable)</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-surface-alt border border-hairline hover:border-brand-600 rounded-xl px-3.5 py-2.5 text-xs text-ink font-semibold outline-none focus:border-brand-600"
                        required
                      />
                    </div>

                    {/* Address (Editable) */}
                    <div>
                      <label className="text-[11px] uppercase font-bold text-brand-700 flex items-center gap-1 mb-1">
                        <MapPin size={12} className="text-brand-600" /> Saved Address{" "}
                        <span className="text-emerald-600 text-[11px] lowercase font-normal">(editable)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        placeholder="Enter your default pickup / residence address..."
                        className="w-full bg-surface-alt border border-hairline hover:border-brand-600 rounded-xl px-3.5 py-2 text-xs text-ink font-semibold outline-none focus:border-brand-600"
                      />
                    </div>

                    {/* Phone Number (Disabled / Non-editable) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-1">
                          <Phone size={12} className="text-gray-400" /> Mobile Phone Number
                        </label>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-bold">
                          <Lock size={10} /> Cannot be changed
                        </span>
                      </div>
                      <input
                        type="tel"
                        value={user.phone || ""}
                        disabled
                        readOnly
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-500 font-mono font-bold cursor-not-allowed select-none"
                      />
                    </div>

                    {/* Email Address (Disabled / Non-editable) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] uppercase font-bold text-gray-500 flex items-center gap-1">
                          <Mail size={12} className="text-gray-400" /> Email Address
                        </label>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-bold">
                          <Lock size={10} /> Cannot be changed
                        </span>
                      </div>
                      <input
                        type="email"
                        value={user.email || ""}
                        disabled
                        readOnly
                        className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-500 font-bold cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 hover:opacity-90 text-white font-sans text-xs font-bold py-3.5 rounded-full transition-all shadow-md mt-4 cursor-pointer"
                  >
                    {loading ? "Saving Profile..." : "Update Profile"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* DETAILED BOOKING POPUP MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-brand-600 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50 px-6 py-4 border-b border-hairline flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-brand-700 font-extrabold block">
                  Aurelle Chauffeur Cab Booking Details
                </span>
                <h3 className="font-mono text-base font-black text-brand-600 flex items-center gap-2">
                  {selectedBooking.bookingId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Status Header Badge */}
              <div className="flex justify-between items-center bg-surface-alt p-3.5 rounded-2xl border border-hairline">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-gray-500 font-bold block">Current Booking Status</span>
                  <span
                    className={`inline-block text-[11px] uppercase font-black px-3 py-1 rounded-full border ${
                      selectedBooking.status === "Confirmed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : selectedBooking.status === "Completed"
                          ? "bg-blue-50 text-blue-700 border-blue-300"
                          : selectedBooking.status === "Cancelled"
                            ? "bg-red-50 text-red-700 border-red-300"
                            : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    {selectedBooking.status || "Pending Confirmation"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 font-bold block">Total Fare</span>
                  <span className="font-sans text-lg font-bold text-brand-600">
                    ₹{selectedBooking.totalFare?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Journey Route */}
              <div className="bg-brand-50/70 p-4 rounded-2xl border border-brand-600/40 space-y-2">
                <span className="text-[11px] uppercase font-bold text-brand-700 block tracking-wider">
                  Tamil Nadu Route &amp; Schedule
                </span>
                <div className="font-sans text-base font-bold text-ink">
                  {selectedBooking.pickupCity} &rarr; {selectedBooking.dropCity}
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-700 pt-1 border-t border-brand-600/30">
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar size={13} className="text-brand-600" /> Date: {selectedBooking.pickupDate}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock size={13} className="text-brand-600" /> Time: {selectedBooking.pickupTime}
                  </span>
                </div>
              </div>

              {/* Assigned Driver & Cab details OR Pending Assignment Banner */}
              {selectedBooking.driverName &&
              selectedBooking.cabNumber &&
              (selectedBooking.status === "Confirmed" || selectedBooking.status === "Completed") ? (
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <span className="text-[11px] uppercase font-bold text-emerald-800 block tracking-wider flex items-center gap-1">
                    <ShieldCheck size={13} className="text-emerald-600" /> Admin Assigned Chauffeur &amp; Cab
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-500 text-[11px] block">Vehicle Class</span>
                      <strong className="text-ink">{selectedBooking.vehicleName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Cab Reg. No</span>
                      <strong className="text-brand-600 font-mono">{selectedBooking.cabNumber}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Assigned Chauffeur</span>
                      <strong className="text-ink">{selectedBooking.driverName}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px] block">Driver Contact</span>
                      <strong className="text-ink font-mono">{selectedBooking.driverPhone || "+91 98401 55443"}</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-50 p-4 rounded-2xl border border-brand-600/50 space-y-2 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 mb-0.5">
                    <Clock size={18} />
                  </div>
                  <h5 className="font-sans font-bold text-xs text-ink">Awaiting Admin Phone Confirmation</h5>
                  <p className="text-[11px] text-gray-600 leading-relaxed max-w-sm mx-auto font-medium">
                    Our Aurelle operations team will call your mobile number (
                    <strong className="text-gray-900 font-mono">{selectedBooking.phone}</strong>) to confirm your pickup
                    address. Chauffeur name and cab registration number will be assigned &amp; updated here after call
                    confirmation.
                  </p>
                </div>
              )}

              {/* Passenger Contact Info */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                <span className="text-[11px] uppercase font-bold text-gray-500 block tracking-wider">
                  Passenger Contact Details
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 text-[11px] block">Name</span>
                    <strong className="text-ink">{selectedBooking.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[11px] block">Mobile Phone</span>
                    <strong className="text-ink font-mono">{selectedBooking.phone}</strong>
                  </div>
                  {selectedBooking.email && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-[11px] block">Email</span>
                      <strong className="text-ink">{selectedBooking.email}</strong>
                    </div>
                  )}
                  {selectedBooking.specialRequests && (
                    <div className="col-span-2 pt-1 border-t border-gray-100">
                      <span className="text-gray-400 text-[11px] block">Special Notes / Demands</span>
                      <p className="text-gray-700 italic">{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-surface-alt border-t border-gray-200 flex items-center justify-between gap-3">
              {selectedBooking.driverName && selectedBooking.driverPhone ? (
                <a
                  href={`tel:${selectedBooking.driverPhone}`}
                  className="bg-brand-600 hover:opacity-90 text-white font-extrabold px-4 py-2.5 rounded-full text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <PhoneCall size={14} /> Call Driver ({selectedBooking.driverName.split(" ")[0]})
                </a>
              ) : (
                <a
                  href="tel:+919876543210"
                  className="bg-brand-600 hover:opacity-90 text-white font-extrabold px-4 py-2.5 rounded-full text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <PhoneCall size={14} /> Call Fleet Operations
                </a>
              )}

              {selectedBooking.status !== "Cancelled" && selectedBooking.status !== "Completed" && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.bookingId)}
                  disabled={cancellingBookingId === selectedBooking.bookingId}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Ban size={14} />
                  {cancellingBookingId === selectedBooking.bookingId ? "Cancelling..." : "Cancel Ride"}
                </button>
              )}

              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
