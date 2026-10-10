"use client";
import { apiFetch } from "@/lib/apiClient";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Vehicle, FLEET, POPULAR_ROUTES } from "@/data/fleet";

export interface TariffBreakdown {
  baseFare: number;
  driverBatta: number;
  tollEstimate: number;
  permitEstimate: number;
  gst: number;
  grandTotal: number;
  ratePerKm: number;
  distanceKm: number;
}

interface BookingContextType {
  tripType: "one-way" | "round-trip";
  setTripType: (type: "one-way" | "round-trip") => void;
  pickupCity: string;
  setPickupCity: (city: string) => void;
  dropCity: string;
  setDropCity: (city: string) => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  passengerName: string;
  setPassengerName: (name: string) => void;
  passengerPhone: string;
  setPassengerPhone: (phone: string) => void;
  passengerEmail: string;
  setPassengerEmail: (email: string) => void;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  selectedVehicle: Vehicle;
  fleetList: Vehicle[];
  isCalculated: boolean;
  setIsCalculated: (calc: boolean) => void;
  estimatedDistance: number;
  tariffBreakdown: TariffBreakdown | null;
  bookingDrawerOpen: boolean;
  setBookingDrawerOpen: (open: boolean) => void;
  tariffDetailsOpen: boolean;
  setTariffDetailsOpen: (open: boolean) => void;
  bookingReference: string | null;
  bookingStatus: "idle" | "submitting" | "confirmed";
  calculateTariff: () => void;
  submitBooking: (userInfo?: {
    userId?: string;
    customerName?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => Promise<void>;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const calculateDistance = (from: string, to: string) => {
  if (!from || !to || from === to) return 0;

  const route = POPULAR_ROUTES.find(
    (r) =>
      (r.from.toLowerCase() === from.toLowerCase() && r.to.toLowerCase() === to.toLowerCase()) ||
      (r.from.toLowerCase() === to.toLowerCase() && r.to.toLowerCase() === from.toLowerCase())
  );
  if (route) return route.distanceKm;

  const charSum = (from + to).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 120 + (charSum % 380);
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [pickupCity, setPickupCity] = useState("Chennai");
  const [dropCity, setDropCity] = useState("Madurai");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [passengerName, setPassengerName] = useState("");
  const [passengerPhone, setPassengerPhone] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");

  const [fleetList, setFleetList] = useState<Vehicle[]>(FLEET);
  const [selectedVehicleId, setSelectedVehicleId] = useState(FLEET[1].id);
  const [isCalculated, setIsCalculated] = useState(false);
  const [estimatedDistance, setEstimatedDistance] = useState(350);
  const [tariffBreakdown, setTariffBreakdown] = useState<TariffBreakdown | null>(null);

  const [bookingDrawerOpen, setBookingDrawerOpen] = useState(false);
  const [tariffDetailsOpen, setTariffDetailsOpen] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "confirmed">("idle");

  // Fetch live fleet from API
  useEffect(() => {
    apiFetch("/api/fleet")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFleetList(data.data);
          if (!data.data.some((v: Vehicle) => v.id === selectedVehicleId)) {
            setSelectedVehicleId(data.data[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    setPickupDate(dateStr);
  }, []);

  const selectedVehicle = fleetList.find((v) => v.id === selectedVehicleId) || fleetList[0] || FLEET[1];

  useEffect(() => {
    const dist = calculateDistance(pickupCity, dropCity);
    setEstimatedDistance(dist);
    if (isCalculated) {
      setIsCalculated(false);
    }
  }, [pickupCity, dropCity, isCalculated]);

  const runCalculation = useCallback(() => {
    const dist = calculateDistance(pickupCity, dropCity);
    const multiplier = tripType === "round-trip" ? 2 : 1;
    const finalDistance = dist * multiplier;

    const chargedDistance = Math.max(finalDistance, selectedVehicle.minKmPerDay);
    const baseFare = chargedDistance * selectedVehicle.ratePerKm;

    const days = Math.max(1, Math.ceil(chargedDistance / 300));
    const driverBatta = selectedVehicle.driverBattaPerDay * days;

    const tollEstimate = tripType === "one-way" ? Math.floor(chargedDistance * 1.5) : Math.floor(chargedDistance * 1.2);
    const permitEstimate = dist > 200 ? 400 : 0;

    const subtotal = baseFare + driverBatta + tollEstimate + permitEstimate;
    const gst = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + gst;

    setTariffBreakdown({
      baseFare: Math.round(baseFare),
      driverBatta: Math.round(driverBatta),
      tollEstimate: Math.round(tollEstimate),
      permitEstimate: Math.round(permitEstimate),
      gst,
      grandTotal: Math.round(grandTotal),
      ratePerKm: selectedVehicle.ratePerKm,
      distanceKm: finalDistance,
    });
  }, [pickupCity, dropCity, tripType, selectedVehicle]);

  useEffect(() => {
    if (isCalculated) {
      runCalculation();
    }
  }, [isCalculated, runCalculation]);

  const calculateTariff = () => {
    runCalculation();
    setIsCalculated(true);
  };

  const submitBooking = async (userInfo?: {
    userId?: string;
    customerName?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => {
    setBookingStatus("submitting");

    const ref = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: ref,
          userId: userInfo?.userId || "",
          customerName: userInfo?.customerName || passengerName || "Guest Rider",
          phone: userInfo?.phone || passengerPhone || "9876543210",
          email: userInfo?.email || passengerEmail || "",
          address: userInfo?.address || "",
          tripType,
          pickupCity,
          dropCity,
          pickupDate,
          pickupTime,
          vehicleId: selectedVehicle.id,
          vehicleName: selectedVehicle.name,
          estimatedDistanceKm: estimatedDistance,
          totalFare: tariffBreakdown?.grandTotal || 0,
          status: "Pending",
        }),
      });
    } catch (err) {
      console.error("Booking API error:", err);
    }

    setBookingReference(ref);
    setBookingStatus("confirmed");
  };

  const resetBooking = () => {
    setBookingStatus("idle");
    setBookingReference(null);
    setIsCalculated(false);
    setTariffBreakdown(null);
    setPassengerName("");
    setPassengerPhone("");
    setPassengerEmail("");
  };

  return (
    <BookingContext.Provider
      value={{
        tripType,
        setTripType,
        pickupCity,
        setPickupCity,
        dropCity,
        setDropCity,
        pickupDate,
        setPickupDate,
        pickupTime,
        setPickupTime,
        passengerName,
        setPassengerName,
        passengerPhone,
        setPassengerPhone,
        passengerEmail,
        setPassengerEmail,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedVehicle,
        fleetList,
        isCalculated,
        setIsCalculated,
        estimatedDistance,
        tariffBreakdown,
        bookingDrawerOpen,
        setBookingDrawerOpen,
        tariffDetailsOpen,
        setTariffDetailsOpen,
        bookingReference,
        bookingStatus,
        calculateTariff,
        submitBooking,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
