"use client";
import {
  WarningCircle as AlertCircle,
  CheckCircle as CheckCircle2,
  Headphones,
  Lock,
  ChatCircle as MessageCircle,
  PaperPlaneTilt as Send,
  UserCheck,
  X,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect } from "react";

import { SUPPORT_PHONE_DISPLAY, SUPPORT_WHATSAPP_URL } from "@/lib/site";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, setAuthModalOpen, setAuthMode } = useCustomerAuth();
  const [mode, setMode] = useState<"create" | "check">("create");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    subject: "",
    initialMessage: "",
    bookingId: "",
  });

  const [checkTicketId, setCheckTicketId] = useState("");
  const [foundTicket, setFoundTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Pre-fill user data when authenticated user opens modal
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        customerName: user.name || "",
        customerPhone: user.phone || "",
        customerEmail: user.email || "",
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      onClose();
      setAuthMode("register");
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setErrMsg("");
    setSuccessMsg("");

    try {
      const res = await apiFetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_ticket",
          customerName: user.name,
          customerPhone: user.phone,
          customerEmail: user.email,
          subject: form.subject,
          initialMessage: form.initialMessage,
          bookingId: form.bookingId,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSuccessMsg(
          `Support Ticket ${data.data.ticketId} raised successfully! Our support desk agent will respond shortly.`
        );
        setForm({
          customerName: user.name || "",
          customerPhone: user.phone || "",
          customerEmail: user.email || "",
          subject: "",
          initialMessage: "",
          bookingId: "",
        });
      } else {
        setErrMsg(data.error || "Failed to raise ticket.");
      }
    } catch (err: any) {
      setErrMsg(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkTicketId.trim()) return;
    setLoading(true);
    setErrMsg("");

    try {
      const res = await apiFetch(`/api/support?ticketId=${encodeURIComponent(checkTicketId.trim())}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setFoundTicket(data.data[0]);
      } else {
        setErrMsg("No ticket found with that Ticket Ref ID.");
        setFoundTicket(null);
      }
    } catch (err: any) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCustomerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundTicket || !replyText.trim()) return;
    setLoading(true);

    try {
      const res = await apiFetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_message",
          ticketId: foundTicket.ticketId,
          sender: "customer",
          senderName: user?.name || foundTicket.customerName,
          text: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReplyText("");
        setFoundTicket(data.data);
      }
    } catch (err: any) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lift animate-fade-up"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-hairline px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Headphones size={19} />
            </span>
            <div>
              <h2 id="support-modal-title" className="text-lg font-bold text-ink leading-tight">
                Support desk
              </h2>
              <p className="text-[13px] text-ink-subtle mt-0.5">Trip help and resolutions, 24/7</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-subtle hover:text-ink transition-colors p-1 -mr-1 -mt-1 cursor-pointer shrink-0"
            aria-label="Close support desk"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* WhatsApp shortcut */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <span className="block text-[13px] font-semibold text-emerald-900">Prefer WhatsApp?</span>
              <span className="block text-[13px] text-emerald-800 mt-0.5">{SUPPORT_PHONE_DISPLAY}</span>
            </div>
            <a
              href={`${SUPPORT_WHATSAPP_URL}?text=Hi%20Aurelle%20Cabs,%20I%20need%20assistance%20with%20my%20cab%20booking.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              <MessageCircle size={14} />
              Chat
            </a>
          </div>

          {/* Mode switcher */}
          <div role="tablist" aria-label="Support options" className="flex gap-1 bg-surface-sunken p-1 rounded-lg">
            {(
              [
                { value: "create", label: "Raise a ticket" },
                { value: "check", label: "Check status" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.value}
                role="tab"
                aria-selected={mode === tab.value}
                onClick={() => {
                  setMode(tab.value);
                  setSuccessMsg("");
                  setErrMsg("");
                }}
                className={`flex-1 py-2.5 text-[13px] font-semibold rounded-md transition-all cursor-pointer ${
                  mode === tab.value ? "bg-white text-brand-600 shadow-card" : "text-ink-subtle hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {successMsg && (
            <p
              role="status"
              className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] p-3.5 rounded-lg flex items-start gap-2"
            >
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </p>
          )}

          {errMsg && (
            <p
              role="alert"
              className="bg-brand-50 border border-brand-200 text-brand-700 text-[13px] p-3.5 rounded-lg flex items-start gap-2"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errMsg}</span>
            </p>
          )}

          {/* ── Raise a ticket ─────────────────────────────────────────── */}
          {mode === "create" &&
            (!isAuthenticated ? (
              <div className="bg-surface-alt border border-hairline rounded-xl p-6 text-center">
                <span className="w-11 h-11 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                  <Lock size={20} />
                </span>
                <h3 className="text-[16px] font-bold text-ink mb-1.5">Sign in to raise a ticket</h3>
                <p className="text-[13px] text-ink-muted leading-relaxed max-w-xs mx-auto mb-5">
                  An account lets you track your ticket and see agent replies as they come in.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setAuthMode("register");
                    setAuthModalOpen(true);
                  }}
                  className="btn-primary w-full"
                >
                  Sign in or register
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="flex items-center justify-between gap-3 bg-surface-alt border border-hairline rounded-lg px-3.5 py-2.5">
                  <span className="text-[13px] text-ink-muted flex items-center gap-2 min-w-0">
                    <UserCheck size={15} className="text-brand-600 shrink-0" />
                    <span className="truncate">
                      {user?.name} · {user?.phone}
                    </span>
                  </span>
                  <span className="badge bg-emerald-50 text-emerald-800 border-emerald-200 shrink-0">Verified</span>
                </div>

                <div>
                  <label htmlFor="support-booking" className="field-label">
                    Booking reference (optional)
                  </label>
                  <input
                    id="support-booking"
                    type="text"
                    value={form.bookingId}
                    onChange={(e) => setForm({ ...form, bookingId: e.target.value })}
                    placeholder="e.g. AUR-123456"
                    className="field"
                  />
                </div>

                <div>
                  <label htmlFor="support-subject" className="field-label">
                    Subject
                  </label>
                  <input
                    id="support-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Need a GST invoice"
                    className="field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="support-message" className="field-label">
                    How can we help?
                  </label>
                  <textarea
                    id="support-message"
                    rows={4}
                    value={form.initialMessage}
                    onChange={(e) => setForm({ ...form, initialMessage: e.target.value })}
                    placeholder="Describe your request in detail…"
                    className="field resize-y"
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  <Send size={15} />
                  {loading ? "Submitting…" : "Submit ticket"}
                </button>
              </form>
            ))}

          {/* ── Check status ───────────────────────────────────────────── */}
          {mode === "check" && (
            <div className="space-y-4">
              <form onSubmit={handleCheckTicket} className="flex gap-2">
                <label htmlFor="support-ticket-id" className="sr-only">
                  Ticket reference
                </label>
                <input
                  id="support-ticket-id"
                  type="text"
                  value={checkTicketId}
                  onChange={(e) => setCheckTicketId(e.target.value)}
                  placeholder="Ticket reference, e.g. TK-1001"
                  className="field flex-1"
                />
                <button type="submit" disabled={loading} className="btn-primary shrink-0">
                  Search
                </button>
              </form>

              {foundTicket && (
                <div className="border border-hairline rounded-xl overflow-hidden">
                  <div className="flex justify-between items-start gap-3 bg-surface-alt px-4 py-3 border-b border-hairline">
                    <div className="min-w-0">
                      <span className="block text-[12px] text-ink-subtle font-medium">{foundTicket.ticketId}</span>
                      <h3 className="text-[14px] font-semibold text-ink truncate">{foundTicket.subject}</h3>
                    </div>
                    <span className="badge bg-amber-50 text-amber-800 border-amber-200 shrink-0">
                      {foundTicket.status}
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto p-3 space-y-2.5">
                    {(foundTicket.messages || []).map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-[13px] ${
                          m.sender === "customer"
                            ? "bg-surface-sunken text-ink"
                            : "bg-brand-50 border border-brand-100 text-ink"
                        }`}
                      >
                        <div className="flex justify-between gap-3 text-[12px] text-ink-subtle mb-1">
                          <span className="font-medium truncate">{m.senderName}</span>
                          <span className="shrink-0">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleSendCustomerReply}
                    className="flex gap-2 p-3 border-t border-hairline bg-surface-alt"
                  >
                    <label htmlFor="support-reply" className="sr-only">
                      Follow-up message
                    </label>
                    <input
                      id="support-reply"
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type a follow-up…"
                      className="field flex-1"
                    />
                    <button type="submit" disabled={loading} className="btn-primary btn-sm shrink-0">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
