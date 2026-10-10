export interface ServicePackageItem {
  id: string;
  title: string;
  category: "hourly" | "corporate" | "wedding" | "event";
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  priceDisplay: string;
  baseFare: number;
  includedHours: number;
  includedKm: number;
  extraKmRate: number;
  extraHourRate: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export const SAMPLE_SERVICES: ServicePackageItem[] = [
  // 1. Hourly Packages
  {
    id: "pkg-hourly-4h40k",
    title: "4 Hours / 40 KM Local Package",
    category: "hourly",
    subtitle: "Quick City Errands & Shopping",
    description:
      "Ideal for brief city meetings, hospital visits, railway station pickups, and shopping trips with a dedicated white AC cab.",
    badge: "Most Popular Local",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop",
    priceDisplay: "₹1,299",
    baseFare: 1299,
    includedHours: 4,
    includedKm: 40,
    extraKmRate: 14,
    extraHourRate: 150,
    features: [
      "4 Hours & 40 KM Included",
      "Pristine White Sedan / Hatchback",
      "Extra KM: ₹14/km",
      "Extra Hour: ₹150/hr",
      "Zero Driver Batta within city",
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "pkg-hourly-8h80k",
    title: "8 Hours / 80 KM Full Day City Package",
    category: "hourly",
    subtitle: "Complete City Sightseeing & Business Meetings",
    description:
      "Full day local rental for business executives, family outings, temple visits within city, and multi-stop itineraries.",
    badge: "Best Value",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop",
    priceDisplay: "₹2,399",
    baseFare: 2399,
    includedHours: 8,
    includedKm: 80,
    extraKmRate: 14,
    extraHourRate: 150,
    features: [
      "8 Hours & 80 KM Included",
      "Pristine White Executive Sedan",
      "Extra KM: ₹14/km",
      "Extra Hour: ₹150/hr",
      "Chauffeur Wait & Multi-Stop Allowed",
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "pkg-hourly-12h120k",
    title: "12 Hours / 120 KM Extended Rental",
    category: "hourly",
    subtitle: "Suburban Travel & All-Day Business",
    description:
      "Extended 12-hour rental covering outskirts, industrial corridors (Sriperumbudur, Maraimalai Nagar, Oragadam), and all-day touring.",
    badge: "Extended Day",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop",
    priceDisplay: "₹3,499",
    baseFare: 3499,
    includedHours: 12,
    includedKm: 120,
    extraKmRate: 15,
    extraHourRate: 150,
    features: [
      "12 Hours & 120 KM Included",
      "Spacious White Family SUV / Sedan",
      "Extra KM: ₹15/km",
      "Extra Hour: ₹150/hr",
      "Industrial & Outskirt Access Included",
    ],
    isActive: true,
    sortOrder: 3,
  },

  // 2. Corporate & IT Company Regular Basis Cabs
  {
    id: "pkg-corp-regular",
    title: "Corporate & IT Company Employee Transport",
    category: "corporate",
    subtitle: "Regular Daily Shift & Monthly Contract Cabs",
    description:
      "Dedicated 100% white fleet contracts for IT Parks, Tech Hubs (OMR, Tidel Park, DLF IT Park, Cybercity) & Corporate Executive Commutes.",
    badge: "Monthly Contract",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    priceDisplay: "Custom Contract Rates",
    baseFare: 0,
    includedHours: 0,
    includedKm: 0,
    extraKmRate: 0,
    extraHourRate: 0,
    features: [
      "24/7 Dedicated Shift Pick & Drop",
      "GPS Real-time Telematics & SOS Alert",
      "Background-Verified Uniformed Chauffeurs",
      "GST Monthly Consolidated Invoicing",
      "Dedicated Fleet Operations Account Manager",
    ],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "pkg-corp-exec",
    title: "Executive Director & VIP Client Fleet",
    category: "corporate",
    subtitle: "Premium Chauffeur Luxury for Business Delegates",
    description:
      "Chauffeur-driven white Toyota Innova Crysta & luxury sedans for visiting foreign clients, board meetings, and airport transfers.",
    badge: "VIP Corporate",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    priceDisplay: "From ₹4,500/day",
    baseFare: 4500,
    includedHours: 10,
    includedKm: 100,
    extraKmRate: 24,
    extraHourRate: 250,
    features: [
      "White Innova Crysta Royal Chauffeur",
      "Complimentary Mineral Water & Wi-Fi",
      "Flight Delay Tracking for Airport Pickups",
      "Executive Leatherette Interior",
      "Priority Dispatch Status",
    ],
    isActive: true,
    sortOrder: 5,
  },

  // 3. Wedding & Special Events Cabs
  {
    id: "pkg-wedding-grand",
    title: "Grand Marriage & Bride/Groom Escort Fleet",
    category: "wedding",
    subtitle: "Flawless White Fleet for Weddings & Receptions",
    description:
      "Book matching spotless white luxury cabs for family guests, bridal party convoy, temple mandapam logistics, and grand reception entries.",
    badge: "Wedding Luxury",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    priceDisplay: "Custom Event Package",
    baseFare: 5000,
    includedHours: 12,
    includedKm: 150,
    extraKmRate: 20,
    extraHourRate: 200,
    features: [
      "100% Guaranteed Spotless White Cabs",
      "Ribbon Flower Decoration Ready",
      "Multi-Car Convoy Coordination",
      "Guest Airport & Station Pickup Desk",
      "Full Day Mandapam Chauffeur Availability",
    ],
    isActive: true,
    sortOrder: 6,
  },
];
