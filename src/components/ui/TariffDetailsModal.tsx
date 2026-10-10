"use client";

import { FileText, Info, X } from "@phosphor-icons/react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useBooking } from "@/context/BookingContext";

export const TariffDetailsModal: React.FC = () => {
  const { tariffDetailsOpen, setTariffDetailsOpen } = useBooking();

  const rules = [
    {
      rule: "TN Coverage Scope",
      details:
        "Exclusive service across all 38 districts of Tamil Nadu. Strictly intra-state service (no inter-state permit charges).",
    },
    {
      rule: "Minimum Distance",
      details: "Charged at 130 km to 250 km minimum per day depending on selected vehicle class.",
    },
    {
      rule: "Driver Bata / Allowance",
      details:
        "Daily allowances range between ₹300 and ₹500 depending on vehicle. Double Bata applies if trip exceeds 300km/day.",
    },
    {
      rule: "Night Chauffeur Fee",
      details: "A flat ₹300 fee applies for journeys scheduled or active between 11:00 PM and 5:00 AM.",
    },
    {
      rule: "Highway Toll Plaza",
      details: "FASTag toll charges are computed automatically and included for seamless highway plaza crossing.",
    },
    {
      rule: "Cancellation Terms",
      details: "Free cancellation up to 6 hours prior to pickup time. 100% driver bata applies for late cancellations.",
    },
  ];

  return (
    <AnimatePresence>
      {tariffDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTariffDetailsOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tariff-modal-title"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-lift"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-hairline px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="tariff-modal-title" className="text-lg font-bold text-ink flex items-center gap-2">
                  <FileText size={19} className="text-brand-600" />
                  Tariff terms &amp; rules
                </h2>
                <p className="text-[13px] text-ink-subtle mt-0.5">Standard billing and inclusions policy</p>
              </div>
              <button
                onClick={() => setTariffDetailsOpen(false)}
                className="text-ink-subtle hover:text-ink transition-colors shrink-0 -mr-1 -mt-1 p-1 cursor-pointer"
                aria-label="Close tariff rules"
              >
                <X size={20} />
              </button>
            </div>

            {/* Rules */}
            <dl className="px-6 py-2 divide-y divide-hairline">
              {rules.map((row) => (
                <div key={row.rule} className="py-4">
                  <dt className="text-[13px] font-bold text-ink mb-1">{row.rule}</dt>
                  <dd className="text-[13px] text-ink-muted leading-relaxed">{row.details}</dd>
                </div>
              ))}
            </dl>

            {/* Footer note */}
            <div className="border-t border-hairline bg-surface-alt px-6 py-4 flex items-start gap-2.5">
              <Info size={15} className="text-ink-subtle shrink-0 mt-0.5" />
              <p className="text-[12px] text-ink-muted leading-relaxed">
                Invoices are generated digitally and sent by SMS and WhatsApp. Pay the driver only the amount shown on
                your official Aurelle invoice.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
