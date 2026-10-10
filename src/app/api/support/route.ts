import { connectToDatabase } from "@/lib/db";
import { SupportTicketModel } from "@/lib/models";
import { memoryStore } from "@/lib/memoryStore";
import { ok, fail, errorMessage, getCustomerSession } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * GET /api/support
 *  - `?ticketId=TK-1234`  → look up a single ticket by its reference (public "check status").
 *  - `?userId=&email=&phone=` with a signed-in customer → that customer's own tickets.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get("ticketId")?.trim() || undefined;
  const session = getCustomerSession(req);

  if (!ticketId && !session) {
    return fail("Provide a ticket reference or sign in to view your tickets.", 400);
  }

  try {
    const db = await connectToDatabase();

    if (ticketId) {
      const tickets = db ? await SupportTicketModel.find({ ticketId }) : memoryStore.getTickets({ ticketId });
      return ok({ data: tickets });
    }

    // Signed-in customer: match by account id, plus email/phone for tickets raised before sign-up.
    const email = session!.email?.toLowerCase();
    if (db) {
      const match: any[] = [{ userId: session!.userId }];
      if (email) match.push({ customerEmail: email });
      const tickets = await SupportTicketModel.find({ $or: match }).sort({ updatedAt: -1 });
      return ok({ data: tickets });
    }

    const byUser = memoryStore.getTickets({ userId: session!.userId });
    const byEmail = email ? memoryStore.getTickets({ email }) : [];
    const merged = Array.from(new Map([...byUser, ...byEmail].map((t) => [t.ticketId, t])).values());
    return ok({ data: merged });
  } catch (err) {
    return fail(errorMessage(err), 500);
  }
}

/**
 * POST /api/support
 *  - `{ action: "create_ticket", customerName, customerPhone, subject, initialMessage, ... }`
 *  - `{ action: "add_message", ticketId, text, senderName }` (always recorded as the customer)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = getCustomerSession(req);

    if (body.action === "create_ticket") {
      const { customerName, customerEmail, customerPhone, subject, initialMessage, bookingId, priority } = body;
      if (!customerName || !customerPhone || !subject || !initialMessage) {
        return fail("Name, phone, subject, and message are required.");
      }

      const userId = session?.userId || body.userId || "";
      const db = await connectToDatabase();

      if (db) {
        const ticketId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
        const ticket = await SupportTicketModel.create({
          ticketId,
          userId,
          customerName,
          customerEmail: (customerEmail || "").toLowerCase(),
          customerPhone,
          subject,
          status: "Open",
          priority: priority || "Medium",
          bookingId: bookingId || "",
          messages: [{ sender: "customer", senderName: customerName, text: initialMessage, timestamp: new Date() }],
        });
        return ok({ data: ticket, message: `Support Ticket ${ticketId} created successfully!` });
      }

      const ticket = memoryStore.createTicket({
        customerName,
        customerEmail: customerEmail || "",
        customerPhone,
        subject,
        initialMessage,
        bookingId,
        priority,
        userId,
      });
      return ok({ data: ticket, message: `Support Ticket ${ticket.ticketId} created successfully!` });
    }

    if (body.action === "add_message") {
      const { ticketId, senderName, text } = body;
      if (!ticketId || !text) return fail("Ticket ID and text message are required.");

      const db = await connectToDatabase();

      if (db) {
        const ticket = await SupportTicketModel.findOne({ ticketId });
        if (!ticket) return fail("Ticket not found.", 404);
        ticket.messages.push({
          sender: "customer",
          senderName: senderName || ticket.customerName,
          text,
          timestamp: new Date(),
        });
        await ticket.save();
        return ok({ data: ticket, message: "Message sent successfully!" });
      }

      const ticket = memoryStore.addTicketMessage(ticketId, "customer", senderName || "Customer", text);
      if (!ticket) return fail("Ticket not found.", 404);
      return ok({ data: ticket, message: "Message sent successfully!" });
    }

    return fail("Invalid action.");
  } catch (err) {
    return fail(errorMessage(err), 500);
  }
}
