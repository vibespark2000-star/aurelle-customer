"use client";

import React from "react";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { BookingProvider } from "@/context/BookingContext";
import { BookingDrawer } from "@/components/ui/BookingDrawer";
import { TariffDetailsModal } from "@/components/ui/TariffDetailsModal";
import { CustomerAuthModal } from "@/components/ui/CustomerAuthModal";
import { CustomerAccountModal } from "@/components/ui/CustomerAccountModal";

/**
 * App-wide client state (customer session + booking flow) and the global
 * modals/drawers that any page can open through those contexts.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CustomerAuthProvider>
      <BookingProvider>
        <BookingDrawer />
        <TariffDetailsModal />
        <CustomerAuthModal />
        <CustomerAccountModal />
        {children}
      </BookingProvider>
    </CustomerAuthProvider>
  );
}
