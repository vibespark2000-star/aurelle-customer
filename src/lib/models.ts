import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Vehicle Schema
export interface IVehicle extends Document {
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

const VehicleSchema = new Schema<IVehicle>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    tagline: { type: String, default: "Pristine White Luxury Cab" },
    description: { type: String, default: "Clean, AC white cab with professional driver." },
    color: { type: String, default: "Pristine White" },
    images: [{ type: String }],
    ratePerKm: { type: Number, required: true },
    driverBattaPerDay: { type: Number, required: true },
    minKmPerDay: { type: Number, required: true },
    seatingCapacity: { type: Number, required: true },
    baggageCapacity: { type: Number, required: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

// 2. District Schema — PopularPlace sub-document
export interface IPopularPlace {
  name: string;
  description: string;
  images: string[];
  keywords: string[];
}

export interface IDistrict extends Document {
  id: string;
  name: string;
  region: string;
  tagline: string;
  famousFor: string;
  landmarkName: string;
  heroImage: string;
  seoKeywords: string[];
  popularPlaces: IPopularPlace[];
}

const PopularPlaceSchema = new Schema<IPopularPlace>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    images: [{ type: String }],
    keywords: [{ type: String }],
  },
  { _id: false }
);

const DistrictSchema = new Schema<IDistrict>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    tagline: { type: String, default: "Premier District Destination" },
    famousFor: { type: String, default: "Iconic Landmarks & Popular Tourist Places" },
    landmarkName: { type: String, required: true },
    heroImage: { type: String, required: true },
    seoKeywords: [{ type: String }],
    popularPlaces: { type: [PopularPlaceSchema], default: [] },
  },
  { timestamps: true }
);

// 3. Route Schema
export interface IRoute extends Document {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  approxDuration: string;
  popularFor: string;
}

const RouteSchema = new Schema<IRoute>(
  {
    id: { type: String, required: true, unique: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    approxDuration: { type: String, required: true },
    popularFor: { type: String, required: true },
  },
  { timestamps: true }
);

// 4. Booking Schema
export interface IBooking extends Document {
  bookingId: string;
  userId?: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  tripType: "one-way" | "round-trip";
  serviceType?: "one-way" | "wedding" | "corporate" | "hourly";
  serviceCategory?: string;
  venueName?: string;
  cabCount?: number;
  companyName?: string;
  shiftRosterInfo?: string;
  packageHours?: number;
  otpVerified?: boolean;
  otpCode?: string;
  specialRequests?: string;
  driverName?: string;
  driverPhone?: string;
  cabNumber?: string;
  adminNotes?: string;
  pickupCity: string;
  dropCity: string;
  pickupDate: string;
  pickupTime: string;
  vehicleId: string;
  vehicleName: string;
  estimatedDistanceKm: number;
  totalFare: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: String },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, default: "" },
    tripType: { type: String, enum: ["one-way", "round-trip"], default: "one-way" },
    serviceType: { type: String, enum: ["one-way", "wedding", "corporate", "hourly"], default: "one-way" },
    serviceCategory: { type: String, default: "General Service" },
    venueName: { type: String, default: "" },
    cabCount: { type: Number, default: 1 },
    companyName: { type: String, default: "" },
    shiftRosterInfo: { type: String, default: "" },
    packageHours: { type: Number, default: 0 },
    otpVerified: { type: Boolean, default: false },
    otpCode: { type: String, default: "" },
    specialRequests: { type: String, default: "" },
    driverName: { type: String, default: "" },
    driverPhone: { type: String, default: "" },
    cabNumber: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
    pickupCity: { type: String, required: true },
    dropCity: { type: String, required: true },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String, required: true },
    estimatedDistanceKm: { type: Number, default: 150 },
    totalFare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

if (mongoose.models.Booking) {
  delete (mongoose.models as any).Booking;
}

export const VehicleModel: Model<IVehicle> =
  mongoose.models.Vehicle || mongoose.model<IVehicle>("Vehicle", VehicleSchema);

// Force re-registration with the new PopularPlaceSchema subdocument.
// The old cached model used [String] which causes CastError on save.
if (mongoose.models.District) {
  delete (mongoose.models as any).District;
}
export const DistrictModel: Model<IDistrict> = mongoose.model<IDistrict>("District", DistrictSchema);

export const RouteModel: Model<IRoute> = mongoose.models.Route || mongoose.model<IRoute>("Route", RouteSchema);

export const BookingModel: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

// 5. Role Schema
export interface IRole extends Document {
  name: string;
  key: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    permissions: [{ type: String }],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RoleModel: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);

// 6. User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: string;
  dob?: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
  profilePic?: string;
  customPermissions?: string[];
  isActive: boolean;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, required: true, default: "customer" },
    dob: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    customPermissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// 7. Support Ticket Schema
export interface ISupportMessage {
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  timestamp: Date;
}

export interface ISupportTicket extends Document {
  ticketId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subject: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  bookingId?: string;
  messages: ISupportMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    ticketId: { type: String, required: true, unique: true },
    userId: { type: String, default: "", index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    bookingId: { type: String, default: "" },
    messages: [
      {
        sender: { type: String, required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const SupportTicketModel: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);

// 8. CMS Content Schema (FAQ, Privacy Policy, Terms & Conditions)
export interface ICmsContent extends Document {
  type: "faq" | "privacy_policy" | "terms_conditions";
  title: string;
  content: string;
  category?: string;
  sortOrder?: number;
}

const CmsContentSchema = new Schema<ICmsContent>(
  {
    type: { type: String, required: true, enum: ["faq", "privacy_policy", "terms_conditions"] },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: "General" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CmsContentModel: Model<ICmsContent> =
  mongoose.models.CmsContent || mongoose.model<ICmsContent>("CmsContent", CmsContentSchema);

// 9. Blog Post Schema (SEO & Content Marketing)
export interface IBlogPost extends Document {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  isPublished: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    category: { type: String, default: "Travel Guide" },
    tags: [{ type: String }],
    author: { type: String, default: "Aurelle Editorial Team" },
    readTime: { type: String, default: "5 min read" },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    seoKeywords: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const BlogPostModel: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

// 10. Service Package Schema (Hourly, Corporate, Wedding & Events)
export interface IServicePackage extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const ServicePackageSchema = new Schema<IServicePackage>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true, enum: ["hourly", "corporate", "wedding", "event"] },
    subtitle: { type: String, default: "" },
    description: { type: String, required: true },
    badge: { type: String, default: "Popular" },
    image: { type: String, required: true },
    priceDisplay: { type: String, required: true },
    baseFare: { type: Number, default: 0 },
    includedHours: { type: Number, default: 0 },
    includedKm: { type: Number, default: 0 },
    extraKmRate: { type: Number, default: 0 },
    extraHourRate: { type: Number, default: 0 },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ServicePackageModel: Model<IServicePackage> =
  mongoose.models.ServicePackage || mongoose.model<IServicePackage>("ServicePackage", ServicePackageSchema);

// 11. Driver Schema (Fleet Chauffeur Management)
export interface IDriver extends Document {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedCabNumber: string;
  vehicleCategory: "Sedan" | "SUV" | "Innova" | "Hatchback";
  vehicleModelName: string;
  experienceYears: number;
  rating: number;
  status: "Available" | "On Duty" | "Off Duty" | "Suspended";
  districtLocation: string;
  photo?: string;
  totalTripsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    assignedCabNumber: { type: String, default: "" },
    vehicleCategory: { type: String, enum: ["Sedan", "SUV", "Innova", "Hatchback"], default: "Sedan" },
    vehicleModelName: { type: String, default: "Executive White Sedan" },
    experienceYears: { type: Number, default: 5 },
    rating: { type: Number, default: 4.8 },
    status: { type: String, enum: ["Available", "On Duty", "Off Duty", "Suspended"], default: "Available" },
    districtLocation: { type: String, default: "Chennai" },
    photo: { type: String, default: "" },
    totalTripsCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const DriverModel: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>("Driver", DriverSchema);
