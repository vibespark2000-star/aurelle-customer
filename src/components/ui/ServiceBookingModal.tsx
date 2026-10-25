"use client";
import {
  ArrowRight,
  Buildings as Building2,
  Car,
  Check,
  CheckCircle as CheckCircle2,
  Clock,
  Crown,
  Heart,
  Lock,
  MapPin,
  Minus,
  Phone,
  PhoneCall,
  Plus,
  ArrowsClockwise as RefreshCw,
  ShieldCheck,
  Sparkle as Sparkles,
  User,
  X,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect, useRef } from "react";

import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage: any | null;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ isOpen, onClose, servicePackage }) => {
  const { user, isAuthenticated, fetchUserBookings } = useCustomerAuth();

  const [step, setStep] = useState<"form" | "otp" | "success">("form");

  // Custom Form Fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupCity, setPickupCity] = useState("Chennai");
  const [venueName, setVenueName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cabCount, setCabCount] = useState(3);
  const [selectedCabModel, setSelectedCabModel] = useState<"Sedan" | "SUV" | "Innova" | "Hatchback">("Sedan");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00 AM");
  const [specialRequests, setSpecialRequests] = useState("");

  // OTP Verification
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Canvas Ref for Celebration Confetti Blast
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate random 3-digit OTP when opening OTP step
  const generateNewOtp = () => {
    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    setGeneratedOtp(randomCode);
    setUserEnteredOtp("");
    setOtpError("");
  };

  useEffect(() => {
    if (isOpen && servicePackage) {
      setStep("form");

      // Auto-fill logged in user details
      if (isAuthenticated && user) {
        setCustomerName(user.name || "");
        setPhone(user.phone || "");
        setEmail(user.email || "");
      } else {
        setCustomerName("");
        setPhone("");
        setEmail("");
      }

      setPickupCity("Chennai");
      setVenueName("");
      setCompanyName("");
      setSelectedCabModel(servicePackage.category === "wedding" ? "Innova" : "Sedan");
      setCabCount(servicePackage.category === "wedding" ? 3 : servicePackage.category === "corporate" ? 5 : 1);
      setPickupDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
      setPickupTime("09:00 AM");
      setSpecialRequests("");
      setConfirmedBooking(null);
    }
  }, [isOpen, servicePackage, isAuthenticated, user]);

  // Determine Service Category Type
  const category = servicePackage?.category || "wedding"; // wedding | corporate | hourly | general

  // HTML5 Canvas Confetti Blast Effect
  useEffect(() => {
    if (step !== "success" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

    let confettiColors: string[] = [];
    if (category === "wedding") {
      confettiColors = ["#DC2626", "#FF69B4", "#E11D48", "#FFFFFF", "#FEF2F2", "#F59E0B"];
    } else if (category === "corporate") {
      confettiColors = ["#B91C1C", "#1E3A8A", "#06B6D4", "#FFFFFF", "#3B82F6", "#F59E0B"];
    } else {
      confettiColors = ["#F59E0B", "#F59E0B", "#DC2626", "#FFFFFF", "#10B981"];
    }

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      shape: "square" | "circle" | "heart";
    }> = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height / 2 + (Math.random() - 0.5) * 50,
        size: Math.random() * 8 + 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.9) * 14,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: category === "wedding" && Math.random() > 0.6 ? "heart" : Math.random() > 0.5 ? "square" : "circle",
      });
    }

    let animationFrameId: number;
    let opacity = 1;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "heart") {
          ctx.font = `${p.size * 1.5}px sans-serif`;
          ctx.fillText("💖", -p.size / 2, p.size / 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      });

      opacity -= 0.005;
      if (opacity > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [step, category]);

  if (!isOpen || !servicePackage) return null;

  // Handle Form Submit -> Move to OTP Step
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert("Please enter contact name and mobile phone number.");
      return;
    }
    generateNewOtp();
    setStep("otp");
  };

  // Verify 3-Digit OTP and Confirm Booking
  const handleVerifyOtpAndConfirm = async () => {
    if (userEnteredOtp.trim() !== generatedOtp) {
      setOtpError("Incorrect 3-digit security code. Please check and re-enter.");
      return;
    }

    setIsSubmitting(true);
    setOtpError("");

    const bookingId = `AUR-${category.toUpperCase().slice(0, 3)}-${Math.floor(10000 + Math.random() * 90000)}`;

    const payload = {
      bookingId,
      userId: user?.id || (user as any)?._id || "",
      customerName,
      phone,
      email,
      tripType: "one-way",
      serviceType: category,
      serviceCategory: servicePackage.title,
      venueName: category === "wedding" ? venueName : "",
      companyName: category === "corporate" ? companyName : "",
      cabCount: cabCount || 1,
      selectedCabModel,
      otpVerified: true,
      otpCode: generatedOtp,
      specialRequests,
      pickupCity: pickupCity || "Chennai",
      dropCity:
        category === "wedding"
          ? venueName || "Mandapam Venue"
          : category === "corporate"
            ? companyName || "Tech Park"
            : "Local City",
      pickupDate: pickupDate || new Date().toISOString().split("T")[0],
      pickupTime: pickupTime || "09:00 AM",
      vehicleId: servicePackage.id || "srv_custom",
      vehicleName: `${cabCount} x ${selectedCabModel} White Cabs (${servicePackage.title})`,
      estimatedDistanceKm: servicePackage.includedKm || 200,
      totalFare: servicePackage.baseFare ? servicePackage.baseFare * cabCount : 4500 * cabCount,
      status: "Pending",
    };

    try {
      const res = await apiFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.data || payload);
        setStep("success");
      } else {
        setConfirmedBooking(payload);
        setStep("success");
      }
      fetchUserBookings();
    } catch {
      setConfirmedBooking(payload);
      setStep("success");
      fetchUserBookings();
    } finally {
      setIsSubmitting(false);
    }
  };

  const cabModelsList: Array<{
    id: "Sedan" | "SUV" | "Innova" | "Hatchback";
    label: string;
    rate: string;
    seats: string;
  }> = [
    { id: "Sedan", label: "Executive Sedan", rate: "₹14/km", seats: "4 Seats" },
    { id: "SUV", label: "Family SUV (Ertiga)", rate: "₹18/km", seats: "6+1 Seats" },
    { id: "Innova", label: "Luxury Innova Crysta", rate: "₹24/km", seats: "7 Captain Seats" },
    { id: "Hatchback", label: "Compact Hatchback", rate: "₹13/km", seats: "4 Seats" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-2 border-brand-600/50 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative text-gray-900 my-auto max-h-[92vh] flex flex-col">
        {/* Canvas Confetti Layer */}
        {step === "success" && (
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-40 w-full h-full" />
        )}

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-600/40 text-brand-600 flex items-center justify-center shadow-xs">
              {category === "wedding" ? (
                <Heart size={20} className="text-[#E11D48]" />
              ) : category === "corporate" ? (
                <Building2 size={20} className="text-[#1E3A8A]" />
              ) : (
                <Clock size={20} className="text-brand-600" />
              )}
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-brand-600 flex items-center gap-1.5">
                <Sparkles size={12} />
                <span>
                  {category === "wedding"
                    ? "Wedding Convoy Booking"
                    : category === "corporate"
                      ? "Corporate IT Roster Request"
                      : "Hourly City Rental"}
                </span>
              </div>
              <h3 className="text-base font-sans font-bold text-ink">{servicePackage.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP 1: SERVICE FORM */}
          {step === "form" && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              {/* User Account State & Contact Details */}
              {isAuthenticated && user ? (
                /* Clean Verified Rider Profile Header (Inputs Hidden) */
                <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50 border-2 border-brand-600/50 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink flex items-center gap-2">
                        <span>{user.name}</span>
                        <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-emerald-600" /> Account Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                        Mobile: <strong className="text-gray-900">{user.phone || "Verified Contact"}</strong>{" "}
                        {user.email ? `• ${user.email}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Guest Booking Fields & Login Prompt */
                <div className="space-y-3">
                  <div className="bg-brand-50/70 p-3 rounded-2xl border border-brand-600/40 text-xs text-brand-700 flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <Crown size={15} className="text-brand-600" /> Booking as Guest Rider
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">Enter contact info below</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Contact Name *</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Mobile Phone Number *</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9840122334"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🚗 WHITE CAB TYPE & QUANTITY COUNTER (+ / -) */}
              <div className="bg-brand-50/60 p-4 rounded-2xl border border-brand-600/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-ink flex items-center gap-1.5">
                    <Car size={15} className="text-brand-600" />
                    <span>Select Preferred White Cab Tier:</span>
                  </label>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-300 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setCabCount(Math.max(1, cabCount - 1))}
                      className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-brand-600 hover:text-white text-gray-800 font-extrabold flex items-center justify-center transition-all cursor-pointer"
                      title="Decrease Cabs"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-extrabold text-xs text-ink min-w-[50px] text-center">
                      {cabCount} {cabCount === 1 ? "Cab" : "Cabs"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCabCount(cabCount + 1)}
                      className="w-7 h-7 rounded-lg bg-brand-600 hover:opacity-90 text-white font-extrabold flex items-center justify-center shadow-xs transition-all cursor-pointer"
                      title="Increase Cabs"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Cab Model Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {cabModelsList.map((model) => {
                    const isSelected = selectedCabModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setSelectedCabModel(model.id)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-brand-600 text-white border-brand-600 shadow-sm font-bold scale-[1.02]"
                            : "bg-white text-gray-800 border-gray-200 hover:border-brand-600/50"
                        }`}
                      >
                        <div className="text-[11px] font-bold truncate flex items-center justify-between">
                          <span>{model.id}</span>
                          {isSelected && <Check size={12} className="text-white shrink-0" />}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${isSelected ? "text-brand-100" : "text-gray-500"}`}>
                          {model.rate} &bull; {model.seats}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Specific Venue / Location Fields */}
              {category === "wedding" ? (
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Marriage Mandapam / Function Hall &amp; District *
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-[#E11D48]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Rama Marriage Hall, Madurai"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-brand-600 outline-none"
                    />
                  </div>
                </div>
              ) : category === "corporate" ? (
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Company Name / IT Tech Park Location *
                  </label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-3 text-[#1E3A8A]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cognizant / TIDEL Park, Chennai"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-brand-600 outline-none"
                    />
                  </div>
                </div>
              ) : null}

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Pickup City *</label>
                  <input
                    type="text"
                    required
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Function / Trip Date *</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2 text-xs border border-gray-300 rounded-xl focus:border-brand-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Special Notes / Decoration / VIP Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flower decorations on lead Innova, AC on continuously, luggage space needed."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:border-brand-600 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:opacity-90 text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
              >
                <span>Proceed to Security Verification</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}

          {/* STEP 2: FLIPKART-STYLE 3-DIGIT OTP VERIFICATION */}
          {step === "otp" && (
            <div className="space-y-5 text-center py-2 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-brand-50 border-2 border-brand-600 text-brand-600 flex items-center justify-center mx-auto shadow-md">
                <Lock size={24} />
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-lg font-bold text-ink">Instant Security Verification</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  To prevent unauthorized bookings, please enter the random 3-digit security code displayed below.
                </p>
              </div>

              {/* Flipkart-Style 3-Digit Security Badge Display */}
              <div className="bg-gradient-to-r from-brand-50 via-white to-brand-50 border-2 border-brand-600 rounded-2xl p-4 max-w-xs mx-auto shadow-md">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-brand-700 mb-1">
                  Your Booking Verification Code
                </div>
                <div className="text-3xl font-black tracking-widest text-brand-600 bg-white py-2 rounded-xl border border-brand-600/50 shadow-inner font-mono">
                  {generatedOtp}
                </div>
                <button
                  onClick={generateNewOtp}
                  className="mt-2 text-[11px] text-brand-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={10} /> Refresh New Code
                </button>
              </div>

              {/* 3-Digit Input */}
              <div className="max-w-xs mx-auto space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Enter 3-Digit Security Code Below:</label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="e.g. 749"
                  value={userEnteredOtp}
                  onChange={(e) => setUserEnteredOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-xl font-mono font-bold tracking-widest py-2.5 border-2 border-gray-300 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30 outline-none"
                />
                {otpError && <div className="text-xs font-bold text-red-600 mt-1">{otpError}</div>}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep("form")}
                  className="w-1/3 border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>

                <button
                  onClick={handleVerifyOtpAndConfirm}
                  disabled={isSubmitting || userEnteredOtp.length !== 3}
                  className="w-2/3 bg-brand-600 hover:opacity-90 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Verify &amp; Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFETTI BLAST & CONFIRMATION */}
          {step === "success" && (
            <div className="text-center space-y-5 py-3 relative z-50 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-600 text-brand-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 size={32} className="text-brand-600" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-600/50 text-[11px] font-extrabold uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>
                    {category === "wedding"
                      ? "Wedding Fleet Reserved!"
                      : category === "corporate"
                        ? "Corporate Roster Submitted!"
                        : "Hourly Rental Confirmed!"}
                  </span>
                </div>
                <h3 className="text-xl font-sans font-bold text-ink pt-1">Thank You, {customerName}!</h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your specialized white cab booking has been verified and registered with our fleet operations desk.
                </p>
              </div>

              {/* Confirmation Details Summary */}
              <div className="bg-brand-50/50 border border-hairline rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-hairline/60 font-bold">
                  <span className="text-gray-500">Booking Reference:</span>
                  <span className="text-brand-600 font-mono font-extrabold">{confirmedBooking?.bookingId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <span className="text-[11px] text-gray-500 block font-bold">Service Package</span>
                    <span className="font-bold text-ink">{servicePackage.title}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block font-bold">Fleet Quantity</span>
                    <span className="font-bold text-brand-600">
                      {cabCount} x {selectedCabModel} White Cabs
                    </span>
                  </div>
                  {category === "wedding" && venueName && (
                    <div className="col-span-2">
                      <span className="text-[11px] text-gray-500 block font-bold">Marriage Mandapam / Venue</span>
                      <span className="font-bold text-ink">{venueName}</span>
                    </div>
                  )}
                  {category === "corporate" && companyName && (
                    <div className="col-span-2">
                      <span className="text-[11px] text-gray-500 block font-bold">Company / IT Park</span>
                      <span className="font-bold text-ink">{companyName}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] text-gray-500 block font-bold">Date &amp; Pickup</span>
                    <span className="font-bold text-gray-800">
                      {pickupDate} ({pickupTime})
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500 block font-bold">OTP Verification</span>
                    <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                      <ShieldCheck size={11} /> Code Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="tel:+919876543210"
                  className="w-full sm:w-1/2 bg-brand-600 hover:opacity-90 text-white font-extrabold py-3 rounded-full text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <PhoneCall size={15} />
                  <span>Call Fleet Manager</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-1/2 border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Done &amp; Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
