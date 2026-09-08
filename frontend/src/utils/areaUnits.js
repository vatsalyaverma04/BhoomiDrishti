// Centralized Land Area Measurement & Geography Utility for BhoomiDrishti / DILRMP

/**
 * Standard Indian Land Measurement Conversion Factors (Base: Square Meters)
 */
export const AREA_CONVERSIONS_TO_SQ_M = {
  'Sq. Meters': 1.0,
  'Square Meters': 1.0,
  'Hectares': 10000.0,
  'Acres': 4046.8564,
  'Bigha': 2529.285,      // Standard Pucca Bigha (Central & Northern India)
  'Guntha': 101.171,      // Maharashtra, Karnataka, Gujarat (1/40th Acre)
  'Biswa': 126.464,       // UP, Haryana, Punjab (1/20th Bigha)
  'Kanal': 505.857,       // Punjab, Haryana, J&K, HP (1/8th Acre)
  'Marla': 25.293,        // Punjab, Haryana, J&K (1/20th Kanal)
  'Square Feet': 0.092903,
  'Square Yards': 0.836127 // Gaj
};

export const ALL_AREA_UNITS = [
  'Sq. Meters',
  'Hectares',
  'Acres',
  'Bigha',
  'Guntha',
  'Biswa',
  'Kanal',
  'Marla',
  'Square Feet',
  'Square Yards'
];

/**
 * All 28 States and 8 Union Territories of India (Official Gazette of India)
 */
export const ALL_INDIAN_STATES_AND_UTS = [
  // 28 States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

/**
 * Converts any area value from one unit to another
 */
export function convertArea(value, fromUnit = 'Sq. Meters', toUnit = 'Sq. Meters') {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return 0;
  
  const fromFactor = AREA_CONVERSIONS_TO_SQ_M[fromUnit] || 1.0;
  const toFactor = AREA_CONVERSIONS_TO_SQ_M[toUnit] || 1.0;
  
  const sqMeters = num * fromFactor;
  return sqMeters / toFactor;
}

/**
 * Formats land area with default unit SQ. M. and flexible multi-tier scaling:
 * - Always displays SQ. M. as the primary unit
 * - If >= 10,000 sq m (1 Ha): secondary displays Hectares & Acres
 * - If >= 4,000 sq m (~1 Acre): secondary displays Acres & Hectares
 * - If >= 1,000 sq m: secondary displays Acres & Bigha
 * - If < 1,000 sq m: secondary displays Sq. Feet
 * 
 * Example output: "14,500 SQ. M. (1.45 Ha / 3.58 Acres)"
 */
export function formatFlexibleArea(value, unit = 'Sq. Meters') {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return '0 SQ. M.';

  const factor = AREA_CONVERSIONS_TO_SQ_M[unit] || 1.0;
  const sqMeters = num * factor;

  const sqMFormatted = Math.round(sqMeters).toLocaleString('en-IN');

  if (sqMeters >= 10000) {
    const ha = (sqMeters / 10000).toFixed(2);
    const acres = (sqMeters / 4046.8564).toFixed(2);
    return `${sqMFormatted} SQ. M. (${ha} Ha / ${acres} Acres)`;
  } else if (sqMeters >= 4046) {
    const acres = (sqMeters / 4046.8564).toFixed(2);
    const ha = (sqMeters / 10000).toFixed(2);
    return `${sqMFormatted} SQ. M. (${acres} Acres / ${ha} Ha)`;
  } else if (sqMeters >= 1000) {
    const acres = (sqMeters / 4046.8564).toFixed(2);
    const bigha = (sqMeters / 2529.285).toFixed(2);
    return `${sqMFormatted} SQ. M. (${acres} Acres / ${bigha} Bigha)`;
  } else {
    const sqFt = Math.round(sqMeters * 10.7639).toLocaleString('en-IN');
    return `${sqMFormatted} SQ. M. (${sqFt} Sq. Ft.)`;
  }
}

// Convenient alias for ReportsView and other components
export const formatAreaDynamic = formatFlexibleArea;

