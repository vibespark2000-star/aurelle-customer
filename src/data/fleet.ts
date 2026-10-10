export interface Vehicle {
  id: string;
  name: string;
  category: "Hatchback" | "Sedan" | "SUV" | "Premium";
  tagline: string;
  description: string;
  color: string;
  images: string[];
  ratePerKm: number;
  driverBattaPerDay: number;
  minKmPerDay: number;
  seatingCapacity: number;
  baggageCapacity: number;
  features: string[];
}

export const FLEET: Vehicle[] = [
  {
    id: "hatchback-tier",
    name: "White Economy Hatchback",
    category: "Hatchback",
    tagline: "Pristine White Compact Cab for Intra-State Drop",
    description:
      "Spotless white compact outstation taxi for quick inter-district travel. Air-conditioned, sanitize-inspected, and fuel-efficient for solo or couple highway journeys across Tamil Nadu.",
    color: "Pristine White",
    images: ["https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop"],
    ratePerKm: 13,
    driverBattaPerDay: 300,
    minKmPerDay: 130,
    seatingCapacity: 4,
    baggageCapacity: 2,
    features: ["Pristine White Fleet", "AC", "Highway Safety GPS", "USB Fast Charger", "Dual Airbags"],
  },
  {
    id: "sedan-tier",
    name: "Pristine White Classic Sedan",
    category: "Sedan",
    tagline: "Uncompromised Executive Luxury & Smooth Highway Comfort",
    description:
      "Our hallmark pristine white outstation sedan (Dzire / Etios White Class). Ultra-clean plush interior, generous rear legroom, high-speed highway stability, and spacious trunk.",
    color: "Pearl White",
    images: ["https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop"],
    ratePerKm: 14,
    driverBattaPerDay: 400,
    minKmPerDay: 150,
    seatingCapacity: 4,
    baggageCapacity: 3,
    features: [
      "Royal Pearl White Finish",
      "Dual Zone AC",
      "Plush Leatherette Seats",
      "Spacious Trunk",
      "Bluetooth Audio",
    ],
  },
  {
    id: "suv-tier",
    name: "White Family SUV",
    category: "SUV",
    tagline: "Spacious & Powerful White Highway Performer",
    description:
      "Heavy-duty pristine white SUV for family temple tours, relocations, and hill climbs to Ooty, Kodaikanal, and Yercaud. Maximum stability with roof carrier option.",
    color: "Glacier White",
    images: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop"],
    ratePerKm: 18,
    driverBattaPerDay: 400,
    minKmPerDay: 200,
    seatingCapacity: 6,
    baggageCapacity: 4,
    features: [
      "Glacier White Metallic",
      "Triple Row AC",
      "Hill Assist Control",
      "Roof Luggage Carrier",
      "Extra Legroom",
    ],
  },
  {
    id: "premium-tier",
    name: "White Innova Crysta Royal",
    category: "Premium",
    tagline: "The Sovereign Gold Standard of White Chauffeur Luxury",
    description:
      "Supreme royal white Toyota Innova Crysta with plush captain seats, rear climate control, ambient lighting, and zero-compromise highway luxury for long-distance district drops.",
    color: "Super White Royal",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop"],
    ratePerKm: 24,
    driverBattaPerDay: 500,
    minKmPerDay: 250,
    seatingCapacity: 7,
    baggageCapacity: 5,
    features: [
      "Super White Chauffeur Edition",
      "Leather Captain Seats",
      "Individual Rear AC",
      "JBL Audio",
      "24/7 Telematics",
    ],
  },
];

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  approxDuration: string;
  popularFor: string;
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: "ch-mdu",
    from: "Chennai",
    to: "Madurai",
    distanceKm: 460,
    approxDuration: "7h 45m",
    popularFor: "Temple & Heritage Corridor",
  },
  {
    id: "cbe-ooty",
    from: "Coimbatore",
    to: "Nilgiris (Ooty)",
    distanceKm: 85,
    approxDuration: "2h 45m",
    popularFor: "Queen of Hill Stations",
  },
  {
    id: "ch-trichy",
    from: "Chennai",
    to: "Tiruchirappalli (Trichy)",
    distanceKm: 330,
    approxDuration: "5h 30m",
    popularFor: "Central TN Hub & Airport",
  },
  {
    id: "ch-cbe",
    from: "Chennai",
    to: "Coimbatore",
    distanceKm: 510,
    approxDuration: "8h 30m",
    popularFor: "Industrial & Textile Capital",
  },
  {
    id: "mdu-kky",
    from: "Madurai",
    to: "Kanyakumari",
    distanceKm: 245,
    approxDuration: "4h 15m",
    popularFor: "Southern Tip Scenic Expressway",
  },
  {
    id: "slm-cbe",
    from: "Salem",
    to: "Coimbatore",
    distanceKm: 165,
    approxDuration: "2h 50m",
    popularFor: "Kongu Highway Link",
  },
  {
    id: "trichy-thj",
    from: "Tiruchirappalli (Trichy)",
    to: "Thanjavur",
    distanceKm: 55,
    approxDuration: "1h 10m",
    popularFor: "Chola Temple Trail",
  },
  {
    id: "tvl-tks",
    from: "Tirunelveli",
    to: "Tenkasi",
    distanceKm: 55,
    approxDuration: "1h 15m",
    popularFor: "Courtallam Falls & Nature",
  },
  {
    id: "ch-knc",
    from: "Chennai",
    to: "Kanchipuram",
    distanceKm: 75,
    approxDuration: "1h 45m",
    popularFor: "Silk City Pilgrimage",
  },
  {
    id: "mdu-rms",
    from: "Madurai",
    to: "Ramanathapuram (Rameswaram)",
    distanceKm: 170,
    approxDuration: "3h 20m",
    popularFor: "Pamban Bridge Gateway",
  },
  {
    id: "vlr-ch",
    from: "Vellore",
    to: "Chennai",
    distanceKm: 140,
    approxDuration: "2h 40m",
    popularFor: "Medical & Educational Link",
  },
  {
    id: "erd-tpr",
    from: "Erode",
    to: "Tiruppur",
    distanceKm: 50,
    approxDuration: "1h 0m",
    popularFor: "Knitwear Industrial Corridor",
  },
];

export const TN_DISTRICTS = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari (Nagercoil)",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris (Ooty)",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi (Tuticorin)",
  "Tiruchirappalli (Trichy)",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Villupuram",
  "Virudhunagar",
];

export const CITIES = TN_DISTRICTS;
