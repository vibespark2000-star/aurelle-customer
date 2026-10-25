"use client";

import {
  Calendar,
  CheckCircle,
  CircleNotch as Loader2,
  MapPin,
  NavigationArrow as Navigation,
  UserCheck,
  X,
} from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useBooking } from "@/context/BookingContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export const BookingDrawer: React.FC = () => {
  const {
    bookingDrawerOpen,
    setBookingDrawerOpen,
    tripType,
    pickupCity,
    dropCity,
    pickupDate,
    pickupTime,
    passengerName,
    setPassengerName,
    passengerPhone,
    setPassengerPhone,
    passengerEmail,
    setPassengerEmail,
    selectedVehicle,
    isCalculated,
    tariffBreakdown,
    bookingReference,
    bookingStatus,
    submitBooking,
    resetBooking,
  } = useBooking();

  const { user, isAuthenticated, openAuthForBooking, fetchUserBookings } = useCustomerAuth();

  useEffect(() => {
    if (bookingDrawerOpen && !isAuthenticated) {
      setBookingDrawerOpen(false);
      openAuthForBooking();
    }
  }, [bookingDrawerOpen, isAuthenticated]);

  useEffect(() => {
    if (user) {
      if (!passengerName && user.name) setPassengerName(user.name);
      if (!passengerPhone && user.phone) setPassengerPhone(user.phone);
      if (!passengerEmail && user.email) setPassengerEmail(user.email);
    }
  }, [user]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      openAuthForBooking();
      return;
    }
    if (!passengerName || !passengerPhone) {
      alert("Please fill in passenger contact details.");
      return;
    }
    await submitBooking({
      userId: user.id,
      customerName: passengerName,
      phone: passengerPhone,
      email: passengerEmail || user.email,
      address: user.address,
    });
    fetchUserBookings();
  };

  const handleClose = () => {
    if (bookingStatus === "confirmed") {
      resetBooking();
    }
    setBookingDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {bookingDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="relative flex h-full w-full max-w-md flex-col bg-white text-ink shadow-2xl border-l border-brand-600/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-hairline px-6 py-5 bg-surface-alt">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-brand-600" />
                <h3 className="font-sans text-lg font-bold tracking-wide text-ink">
                  {bookingStatus === "confirmed" ? "TN Ride Confirmed" : "Review TN Tariff & Book"}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-ink-subtle hover:text-brand-600 transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 no-scrollbar">
              {bookingStatus === "confirmed" ? (
                // SUCCESS STATE
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center space-y-6 py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckCircle size={36} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-sans text-xl font-bold text-ink">Tamil Nadu Ride Confirmed!</h4>
                    <p className="text-xs text-ink-muted leading-relaxed max-w-xs mx-auto font-medium">
                      Your premium chauffeur cab has been reserved. A confirmation SMS &amp; WhatsApp message has been
                      dispatched to your mobile.
                    </p>
                  </div>

                  {/* Booking ID Codebox */}
                  <div className="w-full bg-brand-50 border border-brand-600/40 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
                    <span className="text-[11px] uppercase tracking-widest text-brand-700 font-bold">
                      TN Booking Reference
                    </span>
                    <span className="font-mono text-xl font-bold tracking-wider text-brand-600 select-all flex items-center gap-2">
                      {bookingReference}
                    </span>
                  </div>

                  {/* Booking Details Card */}
                  <div className="w-full bg-surface-alt border border-hairline rounded-2xl p-5 text-left text-xs space-y-3.5 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-ink-subtle font-medium">TN Route:</span>
                      <span className="font-bold text-ink flex items-center gap-1.5">
                        {pickupCity} &rarr; {dropCity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-subtle font-medium">Trip Type:</span>
                      <span className="font-bold text-ink capitalize">{tripType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-subtle font-medium">Date &amp; Time:</span>
                      <span className="font-bold text-ink">
                        {pickupDate} at {pickupTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-subtle font-medium">Fleet Class:</span>
                      <span className="font-bold text-brand-600">{selectedVehicle.name}</span>
                    </div>
                    <div className="flex justify-between border-t border-hairline pt-3 font-semibold text-sm">
                      <span className="text-ink font-bold">Total Fare:</span>
                      <span className="text-brand-600 font-bold">₹{tariffBreakdown?.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-brand-700 max-w-xs leading-relaxed font-semibold bg-brand-50 p-2.5 rounded-xl border border-brand-600/40">
                    *Our Aurelle operations desk will call you to confirm your pickup details. Assigned driver name,
                    phone number, and cab registration number will be updated under &apos;My Rides&apos; after phone
                    confirmation.
                  </p>

                  <button
                    onClick={resetBooking}
                    className="w-full bg-brand-600 text-white font-sans text-xs uppercase tracking-widest font-bold py-4 rounded-xl transition-all duration-300 shadow-md shadow-brand-600/20 cursor-pointer"
                  >
                    Book Another TN Ride
                  </button>
                </motion.div>
              ) : (
                // BOOKING REVIEW STATE
                <>
                  {/* Selected Vehicle details */}
                  <div className="bg-brand-50 rounded-2xl p-4 border border-brand-600/40 flex items-center gap-4 shadow-sm">
                    <div className="flex-1 space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-brand-700 block">
                        Selected Fleet Class
                      </span>
                      <h4 className="font-sans text-sm font-bold text-ink">{selectedVehicle.name}</h4>
                      <p className="text-[11px] text-ink-muted font-medium">{selectedVehicle.tagline}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-ink-subtle block uppercase font-bold">Base Rate</span>
                      <span className="font-mono text-xs font-bold text-brand-600">
                        ₹{selectedVehicle.ratePerKm}/km
                      </span>
                    </div>
                  </div>

                  {/* Journey overview */}
                  <div className="space-y-4">
                    <h5 className="text-[11px] uppercase tracking-widest text-brand-700 font-bold border-b border-hairline pb-1">
                      Journey Overview (Tamil Nadu)
                    </h5>

                    <div className="grid grid-cols-2 gap-3.5 text-xs">
                      <div className="space-y-1 bg-surface-alt p-3 rounded-xl border border-hairline">
                        <span className="text-[11px] uppercase text-ink-subtle font-bold flex items-center gap-1">
                          <MapPin size={10} className="text-brand-600" /> Pickup
                        </span>
                        <span className="font-bold text-ink block">{pickupCity}</span>
                      </div>

                      <div className="space-y-1 bg-surface-alt p-3 rounded-xl border border-hairline">
                        <span className="text-[11px] uppercase text-ink-subtle font-bold flex items-center gap-1">
                          <MapPin size={10} className="text-brand-600" /> TN Destination
                        </span>
                        <span className="font-bold text-ink block">{dropCity}</span>
                      </div>

                      <div className="space-y-1 bg-surface-alt p-3 rounded-xl border border-hairline col-span-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-brand-600" />
                          <div>
                            <span className="text-[11px] uppercase text-ink-subtle font-bold block">Schedule</span>
                            <span className="font-bold text-ink">
                              {pickupDate} at {pickupTime}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] bg-brand-50 text-brand-700 px-2 py-0.5 border border-brand-600/30 rounded font-bold uppercase">
                          {tripType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  {isCalculated && tariffBreakdown && (
                    <div className="space-y-4">
                      <h5 className="text-[11px] uppercase tracking-widest text-brand-700 font-bold border-b border-hairline pb-1">
                        Detailed Fare Breakdown
                      </h5>

                      <div className="bg-surface-alt rounded-2xl p-5 border border-brand-600/30 space-y-3 text-xs shadow-sm">
                        <div className="flex justify-between text-ink-muted font-medium">
                          <span>
                            Base Fare ({tariffBreakdown.distanceKm} km x ₹{tariffBreakdown.ratePerKm}/km)
                          </span>
                          <span className="font-mono font-bold text-ink">
                            ₹{tariffBreakdown.baseFare.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-ink-muted font-medium">
                          <span>Driver Allowance (Batta)</span>
                          <span className="font-mono font-bold text-ink">
                            ₹{tariffBreakdown.driverBatta.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-ink-muted font-medium">
                          <span>Highway FASTag Tolls (Est.)</span>
                          <span className="font-mono font-bold text-ink">
                            ₹{tariffBreakdown.tollEstimate.toLocaleString()}
                          </span>
                        </div>
                        {tariffBreakdown.permitEstimate > 0 && (
                          <div className="flex justify-between text-ink-muted font-medium">
                            <span>Inter-district permit</span>
                            <span className="font-mono font-bold text-ink">
                              ₹{tariffBreakdown.permitEstimate.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-ink-muted font-medium border-b border-hairline pb-3">
                          <span>GST (5%)</span>
                          <span className="font-mono font-bold text-ink">₹{tariffBreakdown.gst.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-baseline font-sans text-sm font-semibold pt-1">
                          <span className="text-ink font-bold">Grand Total (One-Way)</span>
                          <span className="font-sans text-base text-brand-600 font-bold">
                            ₹{tariffBreakdown.grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form for passenger details */}
                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-hairline pb-1">
                      <h5 className="text-[11px] uppercase tracking-widest text-brand-700 font-bold">
                        Passenger Contact Info
                      </h5>
                      {user && (
                        <span className="text-[11px] text-brand-600 font-bold flex items-center gap-1">
                          <UserCheck size={12} /> Logged in as {user.name}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {/* Pre-fill notice */}
                      {user && (
                        <div className="bg-brand-50 border border-hairline rounded-xl px-3 py-2 flex items-center gap-2">
                          <UserCheck size={12} className="text-brand-600 shrink-0" />
                          <span className="text-[11px] text-brand-700 font-semibold">
                            Pre-filled from your profile — you may edit any field below for this trip
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">
                          Passenger Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. S. Karthik"
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                          className="bg-white border border-brand-600/40 hover:border-brand-600 rounded-xl px-4 py-3 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all font-medium"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">
                          Mobile Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 98765 43210"
                          value={passengerPhone}
                          onChange={(e) => setPassengerPhone(e.target.value)}
                          className="bg-white border border-brand-600/40 hover:border-brand-600 rounded-xl px-4 py-3 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all font-mono font-medium"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. name@gmail.com"
                          value={passengerEmail}
                          onChange={(e) => setPassengerEmail(e.target.value)}
                          className="bg-white border border-brand-600/40 hover:border-brand-600 rounded-xl px-4 py-3 text-xs text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingStatus === "submitting"}
                      className="w-full bg-brand-600 hover:opacity-90 text-white font-sans text-xs font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      {bookingStatus === "submitting" ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span>Dispatching Chauffeur...</span>
                        </>
                      ) : (
                        <span>Confirm TN Chauffeur Booking</span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
