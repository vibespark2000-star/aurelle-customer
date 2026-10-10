export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: "Travel Guide" | "Outstation Taxi" | "Temple Tours" | "Hill Stations" | "SEO Tips";
  tags: string[];
  author: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  isPublished: boolean;
  views: number;
  createdAt?: string;
}

export const SAMPLE_BLOGS: BlogPostItem[] = [
  {
    id: "blog-1",
    title: "Complete Outstation Taxi Rate Guide in Tamil Nadu (2026 Edition)",
    slug: "tamil-nadu-outstation-taxi-rate-guide-2026",
    excerpt:
      "Discover transparent per-kilometer pricing, driver batta calculations, and how to avoid hidden toll fees when booking outstation cabs across Chennai, Madurai, and Coimbatore.",
    category: "Outstation Taxi",
    author: "Aurelle Travel & Logistics Insights",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200&auto=format&fit=crop",
    tags: ["Taxi Rates", "Chennai to Madurai", "Outstation Cab", "Travel Tips"],
    metaTitle: "Tamil Nadu Outstation Cab Rates 2026 | Per-KM Tariff Breakdown",
    metaDescription:
      "Learn transparent outstation cab pricing in Tamil Nadu. Includes sedan & SUV per-km rates, driver batta rules, and zero return fee guarantees.",
    seoKeywords: [
      "outstation taxi rates tamil nadu",
      "chennai to madurai cab cost",
      "per km taxi fare chennai",
      "one way outstation taxi",
    ],
    isPublished: true,
    views: 1420,
    content: `
      <h2>Why Transparent Outstation Taxi Pricing Matters in Tamil Nadu</h2>
      <p>Planning an inter-city trip from Chennai to Madurai, Trichy, or Coimbatore? One of the biggest challenges travelers face is hidden return-fare charges, inflated driver allowances, and unexpected luggage tariffs. In this guide, we break down how outstation cab rates work so you get the best value for your trip.</p>
      
      <h3>1. One-Way vs. Round-Trip Billing</h3>
      <p>Many traditional taxi operators charge you double for one-way journeys by billing return mileage. With <strong>Aurelle Cabs</strong>, you only pay for the exact distance traveled from your pickup location to your destination city.</p>
      <ul>
        <li><strong>White Economy Hatchback:</strong> ₹13/km with ₹300/day driver batta</li>
        <li><strong>Pristine White Sedan (Etios/Dzire):</strong> ₹14/km with ₹400/day driver batta</li>
        <li><strong>White Family SUV (Ertiga/Marazzo):</strong> ₹18/km with ₹400/day driver batta</li>
        <li><strong>Innova Crysta Royal:</strong> ₹24/km with ₹500/day driver batta</li>
      </ul>

      <h3>2. Understanding Driver Batta and Night Charges</h3>
      <p>Driver batta covers meals and daily accommodation for your highway chauffeur. Ensure your service provider includes fixed batta terms without surprise additions for night driving.</p>

      <h3>3. Why 100% White Cabs Provide Better Comfort & Safety</h3>
      <p>White cabs reflect solar radiation effectively during hot Tamil Nadu summers, keeping cabin temperatures significantly cooler. Furthermore, dedicated white outstation fleets undergo mandatory highway safety inspections.</p>
    `,
  },
  {
    id: "blog-2",
    title: "Top 7 Sacred Temple Trail Corridors You Can Explore via Chauffeur Cabs",
    slug: "top-7-sacred-temple-trail-corridors-tamil-nadu",
    excerpt:
      "Explore the legendary Chola temple circuits of Thanjavur, Rameswaram, Madurai Meenakshi, and Kanchipuram with zero travel hassle.",
    category: "Temple Tours",
    author: "Heritage Travel Editorial",
    readTime: "8 min read",
    coverImage: "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=1200&auto=format&fit=crop",
    tags: ["Temple Tour", "Madurai", "Thanjavur", "Rameswaram", "Kanchipuram"],
    metaTitle: "Tamil Nadu Temple Tour by Outstation Cab | 7 Spiritual Corridors",
    metaDescription:
      "Book outstation white cabs for temple pilgrimages across Tamil Nadu. Explore Madurai, Thanjavur, Rameswaram, and Chidambaram hassle-free.",
    seoKeywords: [
      "tamil nadu temple tour taxi",
      "madurai rameswaram cab package",
      "thanjavur temple cab hire",
      "kanchipuram silk temple taxi",
    ],
    isPublished: true,
    views: 2890,
    content: `
      <h2>Experience Divine Architecture Across Tamil Nadu's Heritage Corridors</h2>
      <p>Tamil Nadu is home to thousands of ancient Dravidian temples. Driving yourself through congested narrow temple towns can be exhausting. Renting an outstation white cab with a local Tamil-speaking chauffeur allows you to focus purely on spiritual bliss.</p>

      <h3>Corridor 1: Madurai to Rameswaram & Dhanushkodi</h3>
      <p>Cover 170 km of pristine highway leading to the historic Pamban Bridge and Rameswaram Ramanathaswamy Temple. A private SUV allows comfortable family travel with luggage space for holy water cans and offerings.</p>

      <h3>Corridor 2: The Great Living Chola Temples (Trichy - Thanjavur - Kumbakonam)</h3>
      <p>Visit the Brihadeeswarar Temple in Thanjavur, Gangaikonda Cholapuram, and Darasuram in a single relaxed 2-day taxi circuit.</p>

      <h3>Corridor 3: Kanchipuram & Tiruvannamalai Girivalam Circuit</h3>
      <p>Ideal for weekend spiritual trips from Chennai. Experience early morning Abhishekam and full moon Girivalam with dedicated chauffeur drop and wait options.</p>
    `,
  },
  {
    id: "blog-3",
    title: "Ooty & Kodaikanal Hill Station Drive: Route Map, Hairpin Bends & Driver Tips",
    slug: "ooty-kodaikanal-hill-station-drive-route-tips",
    excerpt:
      "Navigating 36 hairpin bends to Nilgiris or the scenic Ghat roads to Kodaikanal requires hill-tested drivers. Here is everything you need to know before booking.",
    category: "Hill Stations",
    author: "Highland Chauffeur Guides",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    tags: ["Ooty", "Kodaikanal", "Hill Station Taxi", "Coimbatore to Ooty"],
    metaTitle: "Ooty & Kodaikanal Hill Drive Guide | Outstation Taxi Tips",
    metaDescription:
      "Planning a hill station trip to Ooty or Kodaikanal? Learn why experienced hill chauffeurs and heavy-duty white SUVs make all the difference.",
    seoKeywords: [
      "coimbatore to ooty cab service",
      "ooty hairpin bend driver",
      "chennai to kodaikanal outstation cab",
      "best cab for ooty hill travel",
    ],
    isPublished: true,
    views: 1950,
    content: `
      <h2>Conquering the Nilgiris and Palani Hills with Peace of Mind</h2>
      <p>Driving up to Ooty (via Mettupalayam) involves 36 challenging hairpin bends. Similarly, the Kodaikanal Ghat road demands expert clutch control, fog maneuvering, and braking expertise.</p>

      <h3>Why Hire an Outstation Chauffeur for Hill Roads?</h3>
      <ul>
        <li><strong>Hill-Certified Chauffeurs:</strong> Our drivers frequently travel the Coimbatore-Ooty and Madurai-Kodaikanal routes.</li>
        <li><strong>Vehicle Hill Assist:</strong> Aurelle SUVs feature automatic hill-hold control and dual AC systems for peak comfort.</li>
        <li><strong>Flexible Sightseeing:</strong> From Botanical Gardens and Pykara Lake to Pillar Rocks in Kodai, your cab stays with you.</li>
      </ul>
    `,
  },
];
