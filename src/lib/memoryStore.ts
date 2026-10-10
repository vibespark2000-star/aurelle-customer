/**
 * In-memory fallback store used when MongoDB is unreachable (offline / demo mode).
 * Data lives only in this server process and resets on restart.
 * The admin console has its own copy that also holds drivers, compliance documents and owners.
 */

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  role: string;
  address?: string;
  profilePic?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MemoryBooking {
  _id: string;
  bookingId: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  tripType: string;
  pickupCity: string;
  dropCity: string;
  pickupDate: string;
  pickupTime: string;
  vehicleId: string;
  vehicleName: string;
  estimatedDistanceKm: number;
  totalFare: number;
  status: string;
  driverName?: string;
  driverPhone?: string;
  cabNumber?: string;
  adminNotes?: string;
  createdAt: Date;
}

export interface MemoryCmsItem {
  _id: string;
  type: "faq" | "privacy_policy" | "terms_conditions";
  title: string;
  content: string;
  category?: string;
  sortOrder?: number;
  createdAt: Date;
}

export interface MemorySupportMessage {
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  timestamp: Date;
}

export interface MemorySupportTicket {
  _id: string;
  ticketId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High";
  bookingId?: string;
  messages: MemorySupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class MemoryStore {
  users: MemoryUser[] = [];
  bookings: MemoryBooking[] = [];
  supportTickets: MemorySupportTicket[] = [
    {
      _id: "tk_demo_1001",
      ticketId: "TK-1001",
      customerName: "Ramesh Kumar",
      customerEmail: "ramesh.k@gmail.com",
      customerPhone: "+91 98401 22334",
      subject: "Need GST Invoice for Madurai Trip",
      status: "Open",
      priority: "High",
      bookingId: "BK-8901",
      messages: [
        {
          sender: "customer",
          senderName: "Ramesh Kumar",
          text: "Hello Aurelle team, I completed my Madurai trip. Could you issue a GST invoice?",
          timestamp: new Date(Date.now() - 3600000 * 5),
        },
        {
          sender: "admin",
          senderName: "Aurelle Support Desk",
          text: "Hello Ramesh! We are generating your GST invoice now.",
          timestamp: new Date(Date.now() - 3600000 * 3),
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 5),
      updatedAt: new Date(Date.now() - 3600000 * 3),
    },
    {
      _id: "tk_demo_1002",
      ticketId: "TK-1002",
      customerName: "Priya Sundaram",
      customerEmail: "priya.s@gmail.com",
      customerPhone: "+91 97910 88776",
      subject: "Vehicle Tier Upgrade Inquiry",
      status: "In Progress",
      priority: "Medium",
      bookingId: "BK-8902",
      messages: [
        {
          sender: "customer",
          senderName: "Priya Sundaram",
          text: "Hi, I booked a sedan for my Ooty trip tomorrow. Can I upgrade to SUV?",
          timestamp: new Date(Date.now() - 3600000 * 10),
        },
      ],
      createdAt: new Date(Date.now() - 3600000 * 10),
      updatedAt: new Date(Date.now() - 3600000 * 10),
    },
  ];
  cmsItems: MemoryCmsItem[] = [
    {
      _id: "cms_faq_1",
      type: "faq",
      title: "How do I book a round-trip or one-way cab?",
      content:
        "Select your pickup district/city and destination district/city on our home page. Choose one-way or round-trip, pick your vehicle tier (Sedan, SUV, Innova), and confirm your trip.",
      category: "Booking",
      sortOrder: 1,
      createdAt: new Date(),
    },
    {
      _id: "cms_faq_2",
      type: "faq",
      title: "What are the driver allowance and toll charges?",
      content:
        "All estimated fares include driver allowance. Toll gate fees and state permit charges are charged transparently based on actual highway receipts during the trip.",
      category: "Payments",
      sortOrder: 2,
      createdAt: new Date(),
    },
    {
      _id: "cms_faq_3",
      type: "faq",
      title: "Can I cancel or reschedule my trip?",
      content:
        "Yes! You can reschedule or cancel your trip anytime up to 2 hours before pickup time with zero cancellation charges.",
      category: "Cancellations",
      sortOrder: 3,
      createdAt: new Date(),
    },
    {
      _id: "cms_privacy_1",
      type: "privacy_policy",
      title: "Aurelle Cabs - Privacy Policy",
      content: `At Aurelle Cabs, we prioritize rider privacy and data protection. We collect minimal personal information (name, phone number, pickup location) exclusively for dispatching cabs and providing customer assistance. We do not sell or share rider personal data with unauthorized third parties. All trip transactions are processed securely.`,
      sortOrder: 1,
      createdAt: new Date(),
    },
    {
      _id: "cms_terms_1",
      type: "terms_conditions",
      title: "Aurelle Cabs - Terms & Conditions",
      content: `1. Booking Acceptance: All bookings are subject to driver availability and dispatch confirmation.
2. Passenger Conduct: Riders are requested to maintain courteous decorum inside cabs. Smoking and contraband substances are strictly prohibited inside all Aurelle cabs.
3. Cancellation & Refunds: Cancellations made 2 hours prior to scheduled pickup time qualify for 100% full refund.`,
      sortOrder: 1,
      createdAt: new Date(),
    },
  ];
  isDbConnected: boolean = false;

  findUserByEmailOrPhone(email: string, phone: string): MemoryUser | undefined {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    return this.users.find((u) => (cleanEmail && u.email === cleanEmail) || (cleanPhone && u.phone === cleanPhone));
  }

  findUserById(id: string): MemoryUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  addUser(user: Omit<MemoryUser, "id" | "createdAt">): MemoryUser {
    const newId = `usr_${Math.floor(100000 + Math.random() * 900000)}`;
    const newUser: MemoryUser = {
      ...user,
      id: newId,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<MemoryUser>): MemoryUser | undefined {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates);
    }
    return user;
  }

  addBooking(booking: Omit<MemoryBooking, "_id" | "createdAt">): MemoryBooking {
    const _id = `bk_${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: MemoryBooking = {
      ...booking,
      _id,
      createdAt: new Date(),
    };
    this.bookings.push(newBooking);
    return newBooking;
  }

  getUserBookings(userId: string, email?: string, phone?: string): MemoryBooking[] {
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";

    let userBookingsList = this.bookings.filter((b) => {
      const bEmail = b.email ? b.email.trim().toLowerCase() : "";
      const bPhone = b.phone ? b.phone.replace(/\D/g, "").slice(-10) : "";

      return (
        (userId && b.userId === userId) ||
        (cleanEmail && bEmail === cleanEmail) ||
        (cleanPhone && bPhone && bPhone === cleanPhone)
      );
    });

    // Auto-seed sample bookings if user has no rides yet so customer booking list is interactive
    if (userBookingsList.length === 0 && (userId || cleanEmail || cleanPhone)) {
      const sample1 = this.addBooking({
        bookingId: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: userId || "",
        customerName: "Rider Customer",
        phone: phone || "9876543210",
        email: email || "",
        address: "Anna Nagar, Chennai",
        tripType: "one-way",
        pickupCity: "Chennai",
        dropCity: "Madurai",
        pickupDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
        pickupTime: "07:30 AM",
        vehicleId: "sedan",
        vehicleName: "Executive Sedan (Dzire / Etios)",
        estimatedDistanceKm: 460,
        totalFare: 5980,
        status: "Pending",
        driverName: "",
        driverPhone: "",
        cabNumber: "",
        adminNotes: "Awaiting phone call confirmation by Admin",
      });

      const sample2 = this.addBooking({
        bookingId: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: userId || "",
        customerName: "Rider Customer",
        phone: phone || "9876543210",
        email: email || "",
        address: "Anna Nagar, Chennai",
        tripType: "one-way",
        pickupCity: "Chennai",
        dropCity: "Pondicherry",
        pickupDate: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
        pickupTime: "09:00 AM",
        vehicleId: "suv",
        vehicleName: "Luxury Ertiga SUV",
        estimatedDistanceKm: 155,
        totalFare: 2950,
        status: "Confirmed",
        driverName: "M. Ramesh (Senior Chauffeur)",
        driverPhone: "+91 98401 55443",
        cabNumber: "TN-09-CB-4821 White SUV",
        adminNotes: "Confirmed after call",
      });

      userBookingsList = [sample1, sample2];
    }

    return userBookingsList;
  }

  getCmsItems(type?: string): MemoryCmsItem[] {
    if (type) {
      return this.cmsItems.filter((item) => item.type === type);
    }
    return this.cmsItems;
  }

  saveCmsItem(
    item: Partial<MemoryCmsItem> & {
      type: "faq" | "privacy_policy" | "terms_conditions";
      title: string;
      content: string;
    }
  ): MemoryCmsItem {
    if (item._id) {
      const existing = this.cmsItems.find((i) => i._id === item._id);
      if (existing) {
        Object.assign(existing, item);
        return existing;
      }
    }
    const newItem: MemoryCmsItem = {
      _id: item._id || `cms_${Math.floor(100000 + Math.random() * 900000)}`,
      type: item.type,
      title: item.title,
      content: item.content,
      category: item.category || "General",
      sortOrder: item.sortOrder || 0,
      createdAt: new Date(),
    };
    this.cmsItems.push(newItem);
    return newItem;
  }

  deleteCmsItem(id: string): boolean {
    const initLen = this.cmsItems.length;
    this.cmsItems = this.cmsItems.filter((i) => i._id !== id);
    return this.cmsItems.length < initLen;
  }

  // ──────── Support Tickets ────────

  getTickets(
    filters: {
      status?: string;
      ticketId?: string;
      search?: string;
      userId?: string;
      email?: string;
      phone?: string;
    } = {}
  ): MemorySupportTicket[] {
    let tickets = [...this.supportTickets];
    if (filters.ticketId) tickets = tickets.filter((t) => t.ticketId === filters.ticketId);
    if (filters.status && filters.status !== "All") tickets = tickets.filter((t) => t.status === filters.status);
    if (filters.userId) tickets = tickets.filter((t) => t.userId === filters.userId);
    if (filters.email) tickets = tickets.filter((t) => t.customerEmail.toLowerCase() === filters.email!.toLowerCase());
    if (filters.phone) tickets = tickets.filter((t) => t.customerPhone === filters.phone);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.customerName.toLowerCase().includes(q) ||
          t.customerPhone.includes(q) ||
          t.ticketId.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }
    return tickets.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  getTicketById(ticketId: string): MemorySupportTicket | undefined {
    return this.supportTickets.find((t) => t.ticketId === ticketId);
  }

  createTicket(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    subject: string;
    initialMessage: string;
    bookingId?: string;
    priority?: string;
    userId?: string;
  }): MemorySupportTicket {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TK-${randomNum}`;
    const now = new Date();
    const ticket: MemorySupportTicket = {
      _id: `tk_${Math.floor(100000 + Math.random() * 900000)}`,
      ticketId,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail || "",
      customerPhone: data.customerPhone,
      subject: data.subject,
      status: "Open",
      priority: (data.priority as MemorySupportTicket["priority"]) || "Medium",
      bookingId: data.bookingId || "",
      messages: [
        {
          sender: "customer",
          senderName: data.customerName,
          text: data.initialMessage,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.supportTickets.push(ticket);
    return ticket;
  }

  addTicketMessage(
    ticketId: string,
    sender: "customer" | "admin",
    senderName: string,
    text: string
  ): MemorySupportTicket | undefined {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return undefined;
    ticket.messages.push({ sender, senderName, text, timestamp: new Date() });
    if (sender !== "customer" && ticket.status === "Open") ticket.status = "In Progress";
    ticket.updatedAt = new Date();
    return ticket;
  }

  updateTicketStatus(ticketId: string, status?: string, priority?: string): MemorySupportTicket | undefined {
    const ticket = this.getTicketById(ticketId);
    if (!ticket) return undefined;
    if (status) ticket.status = status as MemorySupportTicket["status"];
    if (priority) ticket.priority = priority as MemorySupportTicket["priority"];
    ticket.updatedAt = new Date();
    return ticket;
  }
}

const globalStore = global as unknown as { memoryStore?: MemoryStore };
if (!globalStore.memoryStore?.getTickets) {
  globalStore.memoryStore = new MemoryStore();
}
export const memoryStore: MemoryStore = globalStore.memoryStore;
