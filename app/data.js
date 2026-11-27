// Data for Tanah & Tetangga — Namibia in numbers.
// Every figure comes from the Namibia Statistics Agency's 2023 Population
// and Housing Census Main Report (published 30 October 2024) and the 2023
// PHC Labour Force Report (released 29 January 2025), unless noted.
// Regional populations, shares, households and growth are the NSA's own
// published regional table; household size and density are computed from
// those published counts, so they agree with the table to one decimal.
// Regional areas follow the published administrative areas; the national
// total area is the country's published figure, so the regional areas do
// not sum to it exactly. GDP is the World Bank figure for 2023.

export const NATIONAL = {
  population: 3022401,
  female: 1548177,
  male: 1474224,
  urban: 1512685,
  rural: 1509716,
  households: 756339,
  householdSize: 3.8,
  householdSize2011: 4.4,
  growthSince2011Pct: 43.0,
  annualGrowthPct: 3.0,
  medianAge: 21,
  areaKm2: 825615,
  density: 3.7,
  under35Pct: 71.1,
  age0to17Pct: 42.7,
  age15to34Pct: 34.1,
  femaleHeadedHouseholdsPct: 49,
  censusDate: '24 September 2023',
};

// The 14 regions, in population order. sharePct, householdSize and density
// are the published values, rounded to one decimal.
export const REGIONS = [
  { slug: 'khomas', name: 'Khomas', capital: 'Windhoek', population: 494605, sharePct: 16.4, households: 144630, householdSize: 3.4, growth: 44.6, areaKm2: 36950, density: 13.4 },
  { slug: 'ohangwena', name: 'Ohangwena', capital: 'Eenhana', population: 337729, sharePct: 11.2, households: 67820, householdSize: 5.0, growth: 37.6, areaKm2: 10709, density: 31.5 },
  { slug: 'omusati', name: 'Omusati', capital: 'Outapi', population: 316671, sharePct: 10.5, households: 72437, householdSize: 4.4, growth: 30.2, areaKm2: 26600, density: 11.9 },
  { slug: 'oshikoto', name: 'Oshikoto', capital: 'Tsumeb', population: 257302, sharePct: 8.5, households: 60643, householdSize: 4.2, growth: 41.4, areaKm2: 38685, density: 6.7 },
  { slug: 'erongo', name: 'Erongo', capital: 'Swakopmund', population: 240206, sharePct: 7.9, households: 74795, householdSize: 3.2, growth: 59.3, areaKm2: 63639, density: 3.8 },
  { slug: 'oshana', name: 'Oshana', capital: 'Oshakati', population: 230801, sharePct: 7.6, households: 60412, householdSize: 3.8, growth: 30.6, areaKm2: 8647, density: 26.7 },
  { slug: 'otjozondjupa', name: 'Otjozondjupa', capital: 'Otjiwarongo', population: 220811, sharePct: 7.3, households: 58237, householdSize: 3.8, growth: 53.4, areaKm2: 105185, density: 2.1 },
  { slug: 'kavango-east', name: 'Kavango East', capital: 'Rundu', population: 218421, sharePct: 7.2, households: 39907, householdSize: 5.5, growth: 59.6, areaKm2: 23988, density: 9.1 },
  { slug: 'zambezi', name: 'Zambezi', capital: 'Katima Mulilo', population: 142373, sharePct: 4.7, households: 37296, householdSize: 3.8, growth: 57.2, areaKm2: 14528, density: 9.8, noToiletPct: 77 },
  { slug: 'kavango-west', name: 'Kavango West', capital: 'Nkurenkuru', population: 123266, sharePct: 4.1, households: 21614, householdSize: 5.7, growth: 42.5, areaKm2: 23166, density: 5.3, noToiletPct: 78 },
  { slug: 'kunene', name: 'Kunene', capital: 'Opuwo', population: 120762, sharePct: 4.0, households: 28890, householdSize: 4.2, growth: 39.0, areaKm2: 115616, density: 1.0 },
  { slug: 'kharas', name: '//Kharas', capital: 'Keetmanshoop', population: 109893, sharePct: 3.6, households: 33273, householdSize: 3.3, growth: 41.9, areaKm2: 161514, density: 0.7 },
  { slug: 'hardap', name: 'Hardap', capital: 'Mariental', population: 106680, sharePct: 3.5, households: 28197, householdSize: 3.8, growth: 34.2, areaKm2: 109713, density: 1.0 },
  { slug: 'omaheke', name: 'Omaheke', capital: 'Gobabis', population: 102881, sharePct: 3.4, households: 28188, householdSize: 3.6, growth: 44.4, areaKm2: 84745, density: 1.2 },
];

export const AGE_BANDS = [
  { label: '0–14 years', pct: 37.0, note: 'more than one in three Namibians is a child' },
  { label: '15–59 years', pct: 56.1, note: 'the working-age majority' },
  { label: '60 years and over', pct: 6.8, note: 'the smallest band, and growing' },
];

export const EDUCATION = {
  neverSchooledUrbanPct: 5.2,
  neverSchooledRuralPct: 14.4,
  literacy15PlusPct: 91.5,
  note: 'Share of people aged 6 and over who never attended school.',
};

export const SERVICES = {
  safeWaterPct: 91.4,
  safeWater2011Pct: 80,
  noToiletPct: 40.0,
  noToiletHomes: 302385,
  noToiletRuralPct: 64,
  noToiletUrbanPct: 20,
  electricityAccessPct: 59.5,
  noPowerRural: 212519,
  noPowerUrban: 94005,
  mainsLightPct: 47,
};

export const LABOUR = {
  unemploymentStrictPct: 36.9,
  unemploymentBroadPct: 54.8,
  youthUnemploymentPct: 44.4,
  womenUnemploymentPct: 39.6,
  menUnemploymentPct: 34.6,
  labourForceStrict: 867247,
  labourForceBroad: 1209178,
  unemployedStrict: 320442,
};

export const ECONOMY = {
  gdpUsdBn: 12.35,
  gdpPerCapitaUsd: 4168,
  gdpYear: 2023,
  sectors: [
    { label: 'Tertiary (services)', pct: 63.5 },
    { label: 'Primary (farming, fishing, mining)', pct: 20.6 },
    { label: 'Secondary (manufacturing, building)', pct: 15.9 },
  ],
  miningSharePct: 18.0,
  tourismSharePct: 14.5,
};

export const SOURCES = [
  'Namibia Statistics Agency, 2023 Population and Housing Census Main Report, published 30 October 2024 (nsa.org.na)',
  'Namibia Statistics Agency, 2023 Population and Housing Census Labour Force Report, released 29 January 2025',
  'Namibia Statistics Agency, regional profiles from the 2023 census (nsa.org.na/regions)',
  'World Bank, World Development Indicators — Namibia GDP 2023',
  'Namibia National Energy Compact (Mission 300), electricity access 2023, from census household counts',
];
