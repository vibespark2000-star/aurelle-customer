"use client";
import {
  WarningCircle as AlertCircle,
  CheckCircle as CheckCircle2,
  CaretLeft as ChevronLeft,
  Clock,
  CircleNotch as Loader2,
  Lock,
  ChatText as MessageSquare,
  Plus,
  ArrowsClockwise as RefreshCw,
  PaperPlaneTilt as Send,
  Tag,
  UserCheck,
  X,
} from "@phosphor-icons/react";
import { apiFetch } from "@/lib/apiClient";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

import { useCustomerAuth } from "@/context/CustomerAuthContext";

interface SupportMessage {
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  timestamp: string | Date;
}

interface SupportTicket {
  _id: string;
  ticketId: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  messages: SupportMessage[];
  createdAt: string | Date;
  updatedAt: string | Date;
  bookingId?: string;
}

interface CustomerChatDeskProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  Open: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "In Progress": "bg-amber-50 text-amber-800 border-amber-200",
  Resolved: "bg-blue-50 text-blue-800 border-blue-200",
  Closed: "bg-gray-100 text-gray-700 border-gray-300",
};

const priorityDot: Record<string, string> = {
  High: "bg-red-400",
  Medium: "bg-amber-400",
  Low: "bg-gray-400",
};

export const CustomerChatDesk: React.FC<CustomerChatDeskProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, setAuthModalOpen, setAuthMode } = useCustomerAuth();

  const [view, setView] = useState<"list" | "chat" | "new">("list");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // New ticket form
  const [newForm, setNewForm] = useState({ subject: "", initialMessage: "", bookingId: "" });
  const [creatingTicket, setCreatingTicket] = useState(false);

  const fetchMyTickets = useCallback(async () => {
    if (!user) return;
    setLoadingTickets(true);
    try {
      const params = new URLSearchParams();
      if (user.id) params.set("userId", user.id);
      else if (user.email) params.set("email", user.email);
      else if (user.phone) params.set("phone", user.phone);
      const res = await apiFetch(`/api/support?${params.toString()}`);
      const data = await res.json();
      if (data.success) setTickets(data.data || []);
    } catch {
      // silent
    } finally {
      setLoadingTickets(false);
    }
  }, [user]);

  const refreshSelectedTicket = useCallback(async () => {
    if (!selectedTicket) return;
    try {
      const res = await apiFetch(`/api/support?ticketId=${encodeURIComponent(selectedTicket.ticketId)}`);
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        setSelectedTicket(data.data[0]);
        setTickets((prev) => prev.map((t) => (t.ticketId === data.data[0].ticketId ? data.data[0] : t)));
      }
    } catch {
      // silent
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (isOpen && isAuthenticated && user) {
      fetchMyTickets();
    }
  }, [isOpen, isAuthenticated, user, fetchMyTickets]);

  // Poll for new admin replies when in chat view
  useEffect(() => {
    if (view === "chat" && selectedTicket) {
      pollingRef.current = setInterval(refreshSelectedTicket, 15000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [view, selectedTicket, refreshSelectedTicket]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages.length]);

  const handleOpenChat = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setView("chat");
    setErrMsg("");
    setSuccessMsg("");
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setSendingReply(true);
    try {
      const res = await apiFetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_message",
          ticketId: selectedTicket.ticketId,
          sender: "customer",
          senderName: user?.name || "Customer",
          text: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedTicket(data.data);
        setTickets((prev) => prev.map((t) => (t.ticketId === data.data.ticketId ? data.data : t)));
        setReplyText("");
      } else {
        setErrMsg(data.error || "Failed to send message.");
      }
    } catch {
      setErrMsg("Network error. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newForm.subject || !newForm.initialMessage) return;
    setCreatingTicket(true);
    setErrMsg("");
    try {
      const res = await apiFetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_ticket",
          customerName: user.name,
          customerPhone: user.phone,
          customerEmail: user.email,
          subject: newForm.subject,
          initialMessage: newForm.initialMessage,
          bookingId: newForm.bookingId,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSuccessMsg(`Ticket ${data.data.ticketId} raised! Our team will respond shortly.`);
        setNewForm({ subject: "", initialMessage: "", bookingId: "" });
        await fetchMyTickets();
        setTimeout(() => {
          setSuccessMsg("");
          setView("list");
        }, 2500);
      } else {
        setErrMsg(data.error || "Failed to create ticket.");
      }
    } catch {
      setErrMsg("Network error. Please try again.");
    } finally {
      setCreatingTicket(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
        className="relative flex h-full w-full max-w-sm flex-col bg-white text-ink shadow-lift border-l border-hairline"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline bg-white">
          {view === "chat" && selectedTicket ? (
            <button
              onClick={() => {
                setView("list");
                setSelectedTicket(null);
                setReplyText("");
              }}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
              <span className="text-sm font-bold">My Tickets</span>
            </button>
          ) : view === "new" ? (
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
              <span className="text-sm font-bold">Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink leading-tight">Rider Support Chat</h3>
                <p className="text-[11px] text-ink-subtle uppercase tracking-wider">24/7 • Aurelle Cabs Help Desk</p>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="text-ink-subtle hover:text-ink p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Not Authenticated */}
          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-5">
              <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-600/30 flex items-center justify-center text-brand-600">
                <Lock size={28} />
              </div>
              <div className="text-center space-y-2">
                <h4 className="font-sans text-lg font-bold text-ink">Login Required</h4>
                <p className="text-xs text-ink-subtle leading-relaxed max-w-xs">
                  Please log in or register to access the Aurelle Rider Support Chat Desk and raise or track your
                  support tickets.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="w-full bg-brand-600 hover:opacity-90 text-white font-bold py-3.5 rounded-full text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Lock size={14} /> Login / Register to Chat
              </button>
            </div>
          ) : view === "list" ? (
            /* ── Ticket List View ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* User badge + refresh */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                <span className="text-[11px] text-brand-600 font-bold flex items-center gap-1.5">
                  <UserCheck size={12} /> {user?.name} · {user?.phone}
                </span>
                <button
                  onClick={fetchMyTickets}
                  className="text-ink-subtle hover:text-brand-600 transition-colors cursor-pointer"
                  title="Refresh tickets"
                >
                  <RefreshCw size={13} className={loadingTickets ? "animate-spin" : ""} />
                </button>
              </div>

              {/* New Ticket Button */}
              <div className="px-4 pb-3">
                <button
                  onClick={() => {
                    setView("new");
                    setErrMsg("");
                    setSuccessMsg("");
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:opacity-90 text-white font-bold py-2.5 rounded-full text-xs cursor-pointer transition-all shadow-md"
                >
                  <Plus size={14} /> Raise New Support Ticket
                </button>
              </div>

              {/* Tickets */}
              <div className="flex-1 overflow-y-auto px-4 space-y-2.5 pb-4">
                {loadingTickets ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={20} className="animate-spin text-brand-600" />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                    <MessageSquare size={32} className="text-ink-muted" />
                    <p className="text-xs text-ink-subtle">
                      No support tickets yet.
                      <br />
                      Raise a ticket and our team will assist you.
                    </p>
                  </div>
                ) : (
                  tickets.map((ticket) => {
                    const lastMsg = ticket.messages[ticket.messages.length - 1];
                    return (
                      <button
                        key={ticket._id}
                        onClick={() => handleOpenChat(ticket)}
                        className="w-full bg-white hover:bg-surface-sunken border border-hairline hover:border-brand-200 rounded-2xl p-3.5 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[ticket.priority] || "bg-gray-400"}`}
                            />
                            <span className="text-[11px] font-mono text-brand-600 font-bold shrink-0">
                              {ticket.ticketId}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${statusColors[ticket.status] || "bg-gray-100 text-gray-700 border-gray-300"}`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink font-semibold truncate mb-1">{ticket.subject}</p>
                        {lastMsg && (
                          <p className="text-[11px] text-ink-subtle truncate">
                            <span className={lastMsg.sender === "admin" ? "text-brand-600" : "text-ink-muted"}>
                              {lastMsg.sender === "admin" ? "Agent: " : "You: "}
                            </span>
                            {lastMsg.text}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock size={9} className="text-ink-subtle" />
                          <span className="text-[11px] text-ink-subtle">
                            {new Date(ticket.updatedAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : view === "chat" && selectedTicket ? (
            /* ── Chat Thread View ── */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Ticket Info Bar */}
              <div className="px-4 py-2.5 bg-surface-alt border-b border-hairline flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{selectedTicket.subject}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-mono text-brand-600">{selectedTicket.ticketId}</span>
                    {selectedTicket.bookingId && (
                      <span className="text-[11px] text-ink-subtle flex items-center gap-0.5">
                        <Tag size={8} />
                        {selectedTicket.bookingId}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded border ${statusColors[selectedTicket.status] || ""}`}
                  >
                    {selectedTicket.status}
                  </span>
                  <button
                    onClick={refreshSelectedTicket}
                    className="text-ink-subtle hover:text-brand-600 transition-colors cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {selectedTicket.messages.map((msg, idx) => {
                  const isCustomer = msg.sender === "customer";
                  return (
                    <div key={idx} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                          isCustomer
                            ? "bg-brand-600 text-white rounded-br-sm"
                            : "bg-surface-sunken text-ink rounded-bl-sm border border-hairline-strong"
                        }`}
                      >
                        {!isCustomer && <p className="text-[11px] text-brand-600 font-bold mb-1">{msg.senderName}</p>}
                        <p className="text-xs leading-relaxed">{msg.text}</p>
                        <p
                          className={`text-[11px] mt-1.5 ${isCustomer ? "text-brand-100/70 text-right" : "text-ink-subtle"}`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Box */}
              {selectedTicket.status !== "Closed" && selectedTicket.status !== "Resolved" ? (
                <div className="border-t border-hairline p-3 bg-white">
                  {errMsg && (
                    <div className="mb-2 text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} /> {errMsg}
                    </div>
                  )}
                  <form onSubmit={handleSendReply} className="flex items-end gap-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply(e as any);
                        }
                      }}
                      placeholder="Type your message... (Enter to send)"
                      className="flex-1 bg-white border border-hairline-strong rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-brand-600 resize-none placeholder-gray-400"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="bg-brand-600 hover:opacity-90 disabled:opacity-50 text-white p-2.5 rounded-full transition-all cursor-pointer shrink-0"
                    >
                      {sendingReply ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="border-t border-hairline p-3 bg-white text-center">
                  <p className="text-[11px] text-ink-subtle">
                    This ticket is {selectedTicket.status}. Raise a new ticket if you need further help.
                  </p>
                  <button
                    onClick={() => setView("new")}
                    className="mt-2 text-[11px] text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 mx-auto cursor-pointer"
                  >
                    <Plus size={11} /> New Ticket
                  </button>
                </div>
              )}
            </div>
          ) : view === "new" ? (
            /* ── New Ticket Form ── */
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <p className="text-[11px] text-ink-subtle mb-4">
                Describe your issue and our support team will respond within a few hours.
              </p>

              {successMsg && (
                <div className="mb-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-3 rounded-2xl flex items-center gap-2">
                  <CheckCircle2 size={14} /> {successMsg}
                </div>
              )}
              {errMsg && (
                <div className="mb-4 bg-red-500/20 border border-red-500/40 text-red-300 text-xs p-3 rounded-2xl flex items-center gap-2">
                  <AlertCircle size={14} /> {errMsg}
                </div>
              )}

              {/* Verified rider badge */}
              <div className="flex items-center gap-2 bg-white border border-hairline rounded-xl px-3 py-2.5 mb-4">
                <UserCheck size={14} className="text-brand-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-brand-600 font-bold truncate">{user?.name}</p>
                  <p className="text-[11px] text-ink-subtle truncate">
                    {user?.phone} · {user?.email}
                  </p>
                </div>
                <span className="ml-auto text-[11px] uppercase font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  Verified
                </span>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-3.5">
                <div>
                  <label className="text-[11px] uppercase font-bold text-ink-subtle block mb-1">
                    Subject / Issue Topic *
                  </label>
                  <input
                    type="text"
                    value={newForm.subject}
                    onChange={(e) => setNewForm({ ...newForm, subject: e.target.value })}
                    placeholder="e.g. GST Invoice / Driver Delay / Fare Dispute"
                    className="w-full bg-white border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-ink outline-none focus:border-brand-600 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-ink-subtle block mb-1">
                    Booking Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={newForm.bookingId}
                    onChange={(e) => setNewForm({ ...newForm, bookingId: e.target.value })}
                    placeholder="e.g. AUR-123456 (leave blank for general)"
                    className="w-full bg-white border border-hairline rounded-xl px-3.5 py-2.5 text-xs text-brand-600 font-mono outline-none focus:border-brand-600 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase font-bold text-ink-subtle block mb-1">
                    Describe Your Issue *
                  </label>
                  <textarea
                    rows={4}
                    value={newForm.initialMessage}
                    onChange={(e) => setNewForm({ ...newForm, initialMessage: e.target.value })}
                    placeholder="Provide full details of your issue or question..."
                    className="w-full bg-white border border-hairline rounded-xl p-3 text-xs text-ink outline-none focus:border-brand-600 resize-none transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={creatingTicket}
                  className="w-full bg-brand-600 hover:opacity-90 disabled:opacity-60 text-white font-bold py-3.5 rounded-full text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                >
                  {creatingTicket ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {creatingTicket ? "Raising Ticket..." : "Submit Support Ticket"}
                </button>
              </form>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-hairline bg-white flex items-center justify-between">
          <span className="text-[11px] text-ink-subtle">Aurelle 24/7 Rider Support</span>
          <a
            href="https://wa.me/918610201546?text=Hi%20Aurelle%20Cabs,%20I%20need%20help%20with%20my%20booking."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer"
          >
            WhatsApp: +91 86102 01546 →
          </a>
        </div>
      </motion.div>
    </div>
  );
};
