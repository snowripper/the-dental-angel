/**
 * Dental Fee Reference Data
 *
 * Regional average fee ranges for common dental procedures.
 * Based on publicly available ADA survey data and FAIR Health benchmarks.
 * These are typical patient-pay (non-insurance) fee ranges.
 *
 * Used to give patients area-appropriate fee context when they ask
 * "is this price reasonable?" — always with the caveat that fees
 * vary by practice and this is educational, not a quote.
 */

// Fee range: [low, typical, high] in dollars
interface FeeRange {
  low: number;
  typical: number;
  high: number;
}

interface ProcedureFees {
  name: string;
  code: string;
  national: FeeRange;
}

// National baseline fees for common procedures
export const PROCEDURE_FEES: ProcedureFees[] = [
  {
    name: 'Adult Cleaning (Prophylaxis)',
    code: 'D1110',
    national: { low: 80, typical: 130, high: 200 },
  },
  {
    name: 'Deep Cleaning (per quadrant)',
    code: 'D4341',
    national: { low: 180, typical: 275, high: 400 },
  },
  { name: 'Comprehensive Exam', code: 'D0150', national: { low: 60, typical: 100, high: 175 } },
  { name: 'Periodic Exam', code: 'D0120', national: { low: 40, typical: 65, high: 100 } },
  {
    name: 'Bitewing X-rays (4 films)',
    code: 'D0274',
    national: { low: 40, typical: 65, high: 100 },
  },
  { name: 'Full Mouth X-rays', code: 'D0210', national: { low: 100, typical: 160, high: 250 } },
  { name: 'Panoramic X-ray', code: 'D0330', national: { low: 80, typical: 130, high: 200 } },
  {
    name: 'Composite Filling (1 surface)',
    code: 'D2391',
    national: { low: 130, typical: 200, high: 300 },
  },
  {
    name: 'Composite Filling (2 surfaces)',
    code: 'D2392',
    national: { low: 160, typical: 260, high: 380 },
  },
  {
    name: 'Composite Filling (3+ surfaces)',
    code: 'D2393',
    national: { low: 190, typical: 310, high: 450 },
  },
  {
    name: 'Porcelain/Ceramic Crown',
    code: 'D2740',
    national: { low: 800, typical: 1200, high: 1800 },
  },
  {
    name: 'Porcelain-Fused-to-Metal Crown',
    code: 'D2750',
    national: { low: 750, typical: 1100, high: 1650 },
  },
  {
    name: 'Root Canal (Front Tooth)',
    code: 'D3310',
    national: { low: 600, typical: 900, high: 1400 },
  },
  {
    name: 'Root Canal (Premolar)',
    code: 'D3320',
    national: { low: 750, typical: 1050, high: 1500 },
  },
  { name: 'Root Canal (Molar)', code: 'D3330', national: { low: 900, typical: 1350, high: 1900 } },
  { name: 'Simple Extraction', code: 'D7140', national: { low: 100, typical: 200, high: 350 } },
  { name: 'Surgical Extraction', code: 'D7210', national: { low: 200, typical: 350, high: 550 } },
  {
    name: 'Wisdom Tooth (Impacted, Soft Tissue)',
    code: 'D7220',
    national: { low: 250, typical: 400, high: 600 },
  },
  {
    name: 'Wisdom Tooth (Impacted, Bony)',
    code: 'D7230',
    national: { low: 300, typical: 500, high: 750 },
  },
  {
    name: 'Single Dental Implant',
    code: 'D6010',
    national: { low: 1500, typical: 2500, high: 4000 },
  },
  { name: 'Implant Crown', code: 'D6065', national: { low: 1000, typical: 1700, high: 2500 } },
  { name: 'Porcelain Veneer', code: 'D2962', national: { low: 800, typical: 1300, high: 2200 } },
  {
    name: 'Denture (Complete Upper or Lower)',
    code: 'D5110',
    national: { low: 1000, typical: 1800, high: 3000 },
  },
  { name: 'Partial Denture', code: 'D5213', national: { low: 900, typical: 1500, high: 2500 } },
  {
    name: 'Night Guard (Occlusal Guard)',
    code: 'D9944',
    national: { low: 300, typical: 500, high: 800 },
  },
  {
    name: 'Tooth Whitening (In-Office)',
    code: 'D9975',
    national: { low: 300, typical: 550, high: 900 },
  },
  {
    name: '3-Unit Bridge (Porcelain)',
    code: 'D6740',
    national: { low: 2000, typical: 3500, high: 5500 },
  },
  { name: 'Core Buildup', code: 'D2950', national: { low: 150, typical: 300, high: 450 } },
  { name: 'Post and Core', code: 'D2954', national: { low: 250, typical: 400, high: 600 } },
  {
    name: 'Fluoride Treatment (Adult)',
    code: 'D1208',
    national: { low: 25, typical: 40, high: 65 },
  },
  { name: 'Sealant (per tooth)', code: 'D1351', national: { low: 30, typical: 50, high: 75 } },
  {
    name: 'Palliative (Emergency) Treatment',
    code: 'D9110',
    national: { low: 80, typical: 150, high: 250 },
  },
];

// Regional cost multipliers relative to national average
// Based on geographic cost-of-living and dental market data
interface RegionInfo {
  name: string;
  multiplier: number;
  description: string;
}

const REGIONS: Record<string, RegionInfo> = {
  northeast_metro: {
    name: 'New York/Boston Metro',
    multiplier: 1.35,
    description: 'one of the higher-cost areas in the country',
  },
  northeast: {
    name: 'Northeast',
    multiplier: 1.15,
    description: 'a somewhat higher-cost area',
  },
  mid_atlantic: {
    name: 'Mid-Atlantic (DC/MD/VA)',
    multiplier: 1.2,
    description: 'a moderately high-cost area',
  },
  southeast: {
    name: 'Southeast',
    multiplier: 0.9,
    description: 'a relatively moderate-cost area',
  },
  florida: {
    name: 'Florida',
    multiplier: 0.95,
    description: 'a moderate-cost area (varies significantly by city)',
  },
  midwest: {
    name: 'Midwest',
    multiplier: 0.85,
    description: 'a lower-cost area for dental care',
  },
  upper_midwest: {
    name: 'Upper Midwest',
    multiplier: 0.9,
    description: 'a moderate-cost area',
  },
  south_central: {
    name: 'South Central (TX/OK/AR/LA)',
    multiplier: 0.88,
    description: 'a relatively affordable area for dental care',
  },
  texas_metro: {
    name: 'Texas Metro (Dallas/Houston/Austin)',
    multiplier: 1.0,
    description: 'close to the national average',
  },
  mountain: {
    name: 'Mountain West',
    multiplier: 0.92,
    description: 'a moderate-cost area',
  },
  colorado: {
    name: 'Colorado',
    multiplier: 1.05,
    description: 'slightly above the national average',
  },
  pacific_northwest: {
    name: 'Pacific Northwest',
    multiplier: 1.1,
    description: 'a somewhat higher-cost area',
  },
  california_metro: {
    name: 'California Metro (LA/SF/SD)',
    multiplier: 1.4,
    description: 'one of the highest-cost areas in the country',
  },
  california: {
    name: 'California',
    multiplier: 1.2,
    description: 'a higher-cost area',
  },
  hawaii: {
    name: 'Hawaii',
    multiplier: 1.45,
    description: 'one of the highest-cost areas in the country',
  },
  alaska: {
    name: 'Alaska',
    multiplier: 1.35,
    description: 'a high-cost area',
  },
  national: {
    name: 'National Average',
    multiplier: 1.0,
    description: 'around the national average',
  },
};

/**
 * Map a zip code to a dental fee region
 * Uses the first 3 digits (zip prefix) for geographic mapping
 */
function getRegionForZip(zipCode: string): RegionInfo {
  const prefix = parseInt(zipCode.substring(0, 3), 10);

  // New York City metro (Manhattan, Brooklyn, Queens, Bronx, Staten Island, nearby NJ/CT)
  if (
    (prefix >= 100 && prefix <= 104) ||
    (prefix >= 110 && prefix <= 119) ||
    (prefix >= 70 && prefix <= 79) ||
    (prefix >= 60 && prefix <= 69)
  ) {
    return REGIONS.northeast_metro;
  }
  // Boston metro
  if (prefix >= 10 && prefix <= 27) {
    return REGIONS.northeast_metro;
  }
  // Rest of New England
  if (prefix >= 1 && prefix <= 69) {
    return REGIONS.northeast;
  }
  // New Jersey (not NYC metro)
  if (prefix >= 80 && prefix <= 89) {
    return REGIONS.northeast;
  }
  // Pennsylvania
  if (prefix >= 150 && prefix <= 196) {
    return REGIONS.northeast;
  }
  // Upstate New York
  if (prefix >= 105 && prefix <= 149) {
    return REGIONS.northeast;
  }
  // DC, Maryland, Virginia
  if (prefix >= 200 && prefix <= 268) {
    return REGIONS.mid_atlantic;
  }
  // North Carolina, South Carolina
  if (prefix >= 270 && prefix <= 299) {
    return REGIONS.southeast;
  }
  // Georgia
  if (prefix >= 300 && prefix <= 319) {
    return REGIONS.southeast;
  }
  // Florida
  if (prefix >= 320 && prefix <= 349) {
    return REGIONS.florida;
  }
  // Alabama, Tennessee, Mississippi
  if (prefix >= 350 && prefix <= 399) {
    return REGIONS.southeast;
  }
  // Kentucky, Ohio, Indiana
  if (prefix >= 400 && prefix <= 479) {
    return REGIONS.midwest;
  }
  // Michigan
  if (prefix >= 480 && prefix <= 499) {
    return REGIONS.midwest;
  }
  // Iowa, Minnesota, Wisconsin, Dakotas, Montana, Nebraska
  if (prefix >= 500 && prefix <= 599) {
    return REGIONS.upper_midwest;
  }
  // Illinois
  if (prefix >= 600 && prefix <= 629) {
    return REGIONS.midwest;
  }
  // Missouri, Kansas
  if (prefix >= 630 && prefix <= 679) {
    return REGIONS.midwest;
  }
  // Nebraska continued
  if (prefix >= 680 && prefix <= 693) {
    return REGIONS.upper_midwest;
  }
  // Louisiana, Arkansas
  if (prefix >= 700 && prefix <= 729) {
    return REGIONS.south_central;
  }
  // Oklahoma
  if (prefix >= 730 && prefix <= 749) {
    return REGIONS.south_central;
  }
  // Texas metro areas (Dallas 750-753, Houston 770-772, Austin 787)
  if ((prefix >= 750 && prefix <= 753) || (prefix >= 770 && prefix <= 772) || prefix === 787) {
    return REGIONS.texas_metro;
  }
  // Rest of Texas
  if (prefix >= 750 && prefix <= 799) {
    return REGIONS.south_central;
  }
  // Colorado
  if (prefix >= 800 && prefix <= 816) {
    return REGIONS.colorado;
  }
  // Wyoming, Idaho, Utah, Montana
  if (prefix >= 820 && prefix <= 847) {
    return REGIONS.mountain;
  }
  // Arizona
  if (prefix >= 850 && prefix <= 865) {
    return REGIONS.mountain;
  }
  // New Mexico
  if (prefix >= 870 && prefix <= 884) {
    return REGIONS.mountain;
  }
  // Nevada
  if (prefix >= 889 && prefix <= 898) {
    return REGIONS.mountain;
  }
  // California metro: LA (900-908, 910-918), SF Bay (940-945, 948-951), San Diego (919-921)
  if (
    (prefix >= 900 && prefix <= 908) ||
    (prefix >= 910 && prefix <= 921) ||
    (prefix >= 940 && prefix <= 951)
  ) {
    return REGIONS.california_metro;
  }
  // Rest of California
  if (prefix >= 900 && prefix <= 961) {
    return REGIONS.california;
  }
  // Hawaii
  if (prefix >= 967 && prefix <= 968) {
    return REGIONS.hawaii;
  }
  // Oregon, Washington
  if (prefix >= 970 && prefix <= 994) {
    return REGIONS.pacific_northwest;
  }
  // Alaska
  if (prefix >= 995 && prefix <= 999) {
    return REGIONS.alaska;
  }

  return REGIONS.national;
}

/**
 * Get a fee range for a specific area based on zip code
 */
function getRegionalFee(fee: FeeRange, multiplier: number): FeeRange {
  return {
    low: Math.round((fee.low * multiplier) / 10) * 10,
    typical: Math.round((fee.typical * multiplier) / 10) * 10,
    high: Math.round((fee.high * multiplier) / 10) * 10,
  };
}

/**
 * Build a dental fee context string for the AI based on the patient's zip code.
 * Returns a formatted reference the AI can use to answer fee questions.
 */
export function buildFeeContext(zipCode: string): string {
  const region = getRegionForZip(zipCode);

  const feeLines = PROCEDURE_FEES.map((proc) => {
    const regional = getRegionalFee(proc.national, region.multiplier);
    return `- ${proc.name} (${proc.code}): $${regional.low}–$${regional.high} (typical: $${regional.typical})`;
  }).join('\n');

  return `
DENTAL FEE REFERENCE FOR PATIENT'S AREA:
The patient is in the ${region.name} area (zip: ${zipCode}), which is ${region.description}.

Typical fee ranges for common procedures in their area:
${feeLines}

IMPORTANT GUIDELINES FOR DISCUSSING FEES:
- Use these ranges when a patient asks about costs or whether a fee is reasonable
- Say something like "In the ${region.name} area, a [procedure] typically runs $X to $Y"
- Always note that fees can vary by practice, dentist experience, and complexity
- If their quoted fee is within or near the range, reassure them it's in the normal range
- If it's significantly above the range, suggest they ask their dentist what's included (materials, warranty, etc.)
- If it's below the range, note that's a good value but make sure they understand what's included
- Never say a dentist is overcharging — instead help them ask the right questions
- These are estimates for educational purposes, not guarantees`;
}
