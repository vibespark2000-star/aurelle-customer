/**
 * Road-distance estimates between Tamil Nadu district headquarters.
 *
 * We have no routing API, so distance = great-circle distance × a road
 * factor. The factors were calibrated against known road distances
 * (Chennai→Tiruvannamalai ≈ 195 km, Chennai→Madurai ≈ 460 km,
 * Salem→Coimbatore ≈ 165 km, Madurai→Nagercoil ≈ 245 km): short hops wind
 * more than long highway runs, so they get the larger factor.
 *
 * Exact figures for popular corridors live in POPULAR_ROUTES and take
 * precedence over this estimate (see BookingContext.calculateDistance).
 */

/** [latitude, longitude] of each district headquarters; keys match TN_DISTRICTS. */
const HQ: Record<string, [number, number]> = {
  Ariyalur: [11.1401, 79.0786],
  Chengalpattu: [12.6921, 79.9707],
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Cuddalore: [11.748, 79.7714],
  Dharmapuri: [12.1211, 78.1582],
  Dindigul: [10.3673, 77.9803],
  Erode: [11.341, 77.7172],
  Kallakurichi: [11.7376, 78.9597],
  Kanchipuram: [12.8342, 79.7036],
  "Kanyakumari (Nagercoil)": [8.1833, 77.4119],
  Karur: [10.9601, 78.0766],
  Krishnagiri: [12.5186, 78.2137],
  Madurai: [9.9252, 78.1198],
  Mayiladuthurai: [11.1018, 79.6521],
  Nagapattinam: [10.7672, 79.8449],
  Namakkal: [11.2189, 78.1677],
  "Nilgiris (Ooty)": [11.4102, 76.695],
  Perambalur: [11.2342, 78.8807],
  Pudukkottai: [10.3797, 78.8205],
  Ramanathapuram: [9.3639, 78.8395],
  Ranipet: [12.9224, 79.3326],
  Salem: [11.6643, 78.146],
  Sivaganga: [9.8433, 78.4809],
  Tenkasi: [8.9594, 77.3161],
  Thanjavur: [10.787, 79.1378],
  Theni: [10.0104, 77.4768],
  "Thoothukudi (Tuticorin)": [8.7642, 78.1348],
  "Tiruchirappalli (Trichy)": [10.7905, 78.7047],
  Tirunelveli: [8.7139, 77.7567],
  Tirupathur: [12.4955, 78.573],
  Tiruppur: [11.1085, 77.3411],
  Tiruvallur: [13.1231, 79.912],
  Tiruvannamalai: [12.2253, 79.0747],
  Tiruvarur: [10.7661, 79.6344],
  Vellore: [12.9165, 79.1325],
  Villupuram: [11.9401, 79.4861],
  Virudhunagar: [9.568, 77.9624],
};

/** Accepts "Trichy", "Tiruchirappalli (Trichy)", "nilgiris", "Ooty", ... */
const findHQ = (name: string): [number, number] | null => {
  const q = name.trim().toLowerCase();
  if (!q) return null;
  for (const [key, coords] of Object.entries(HQ)) {
    const k = key.toLowerCase();
    const alias = k.match(/\(([^)]+)\)/)?.[1];
    const base = k.replace(/\s*\(.*\)/, "");
    if (q === k || q === base || q === alias) return coords;
  }
  return null;
};

const haversineKm = ([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) => {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
};

/** Estimated one-way road distance in km, or null if either district is unknown. */
export const estimateRoadKm = (from: string, to: string): number | null => {
  const a = findHQ(from);
  const b = findHQ(to);
  if (!a || !b) return null;
  const straight = haversineKm(a, b);
  const factor = straight < 200 ? 1.2 : 1.12;
  // Round to the nearest 5 km — the estimate isn't more precise than that.
  return Math.max(5, Math.round((straight * factor) / 5) * 5);
};

/** Rough highway driving time for a distance, e.g. "3h 30m". */
export const estimateDriveTime = (km: number) => {
  const minutes = Math.round((km / 55) * 60 / 15) * 15;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
};
