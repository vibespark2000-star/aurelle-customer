/** Default FAQ, privacy policy and terms content, seeded when the CMS collection is empty. */
export const DEFAULT_CMS_CONTENT = [
  {
    type: "faq",
    title: "How do I book a round-trip or one-way cab?",
    content:
      "Select your pickup district/city and destination district/city on our home page. Choose one-way or round-trip, pick your vehicle tier (Sedan, SUV, Innova), and confirm your trip.",
    category: "Booking",
    sortOrder: 1,
  },
  {
    type: "faq",
    title: "What are the driver allowance and toll charges?",
    content:
      "All estimated fares include driver allowance. Toll gate fees and state permit charges are charged transparently based on actual highway receipts during the trip.",
    category: "Payments",
    sortOrder: 2,
  },
  {
    type: "faq",
    title: "Can I cancel or reschedule my trip?",
    content:
      "Yes! You can reschedule or cancel your trip anytime up to 2 hours before pickup time with zero cancellation charges.",
    category: "Cancellations",
    sortOrder: 3,
  },
  {
    type: "privacy_policy",
    title: "Aurelle Cabs - Privacy Policy",
    content: `At Aurelle Cabs, we prioritize rider privacy and data protection. We collect minimal personal information (name, phone number, pickup location) exclusively for dispatching cabs and providing customer assistance. We do not sell or share rider personal data with unauthorized third parties. All trip transactions are processed securely.`,
    sortOrder: 1,
  },
  {
    type: "terms_conditions",
    title: "Aurelle Cabs - Terms & Conditions",
    content: `1. Booking Acceptance: All bookings are subject to driver availability and dispatch confirmation.
2. Passenger Conduct: Riders are requested to maintain courteous decorum inside cabs. Smoking and contraband substances are strictly prohibited inside all Aurelle cabs.
3. Cancellation & Refunds: Cancellations made 2 hours prior to scheduled pickup time qualify for 100% full refund.`,
    sortOrder: 1,
  },
];
