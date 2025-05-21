// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const states = [
  { name: 'California', incomeTaxRate: 9.3, population: 39172742 },
  { name: 'Colorado', incomeTaxRate: 4.4, population: 5910000 },
  { name: 'Florida', incomeTaxRate: 0, population: 22300000 },
  { name: 'Georgia', incomeTaxRate: 5.75, population: 11000000 },
  { name: 'Idaho', incomeTaxRate: 5.8, population: 2000000 },
  { name: 'Maryland', incomeTaxRate: 7.0, population: 6200000 }, // includes local avg
  { name: 'Massachusetts', incomeTaxRate: 5.0, population: 7000000 },
  { name: 'Minnesota', incomeTaxRate: 7.05, population: 5800000 },
  { name: 'Montana', incomeTaxRate: 6.75, population: 1100000 },
  { name: 'North Carolina', incomeTaxRate: 4.75, population: 10600000 },
  { name: 'Nevada', incomeTaxRate: 0, population: 3300000 },
  { name: 'Oregon', incomeTaxRate: 9.0, population: 4300000 },
  { name: 'South Carolina', incomeTaxRate: 6.5, population: 5400000 },
  { name: 'Tennessee', incomeTaxRate: 0, population: 7200000 },
  { name: 'Texas', incomeTaxRate: 0, population: 30200000 },
  { name: 'Virginia', incomeTaxRate: 5.75, population: 8900000 },
  { name: 'Washington', incomeTaxRate: 0, population: 7900000 }
];

const cities = [
  {
    id: 1,
    name: 'Los Angeles',
    stateId: 1,
    population: 3800000,
    salesTaxRate: 0.095,
    subreddit: 'r/LosAngeles',
    naturalDisasters: 'Earthquakes, Wildfires',
    violentCrimeRate: 7.5,
    propertyCrimeRate: 25.1,
    lifeExpectancy: 81,
    medianIncome: 70370,
    medianHouseholdIncome: 78000,
    walkabilityScore: 68,
    bikeScore: 59,
    transitScore: 57,
    schoolRating: 7
  },
  {
    id: 2,
    name: 'San Francisco',
    stateId: 1,
    population: 870000,
    salesTaxRate: 0.08625,
    subreddit: 'r/sanfrancisco',
    naturalDisasters: 'Earthquakes, Fog',
    violentCrimeRate: 6.9,
    propertyCrimeRate: 45,
    lifeExpectancy: 83,
    medianIncome: 120000,
    medianHouseholdIncome: 135000,
    walkabilityScore: 88,
    bikeScore: 78,
    transitScore: 80,
    schoolRating: 8,
    notes: 'Tech hub with iconic landmarks.'
  },
  {
    id: 3,
    name: 'Minneapolis',
    stateId: 8,
    population: 425115,
    salesTaxRate: 0.0903,
    subreddit: 'r/minneapolis',
    naturalDisasters: 'Flooding, Severe Storms, Winter Storms',
    violentCrimeRate: 11.32,
    propertyCrimeRate: 52.53,
    lifeExpectancy: 78.8,
    medianIncome: 44716,
    medianHouseholdIncome: 80269,
    walkabilityScore: 89,
    bikeScore: 86,
    transitScore: 86,
    schoolRating: 7,
    notes: 'data may not be accurate'
  }
];

const resources = [
  {
    id: 1,
    title: 'Walk Score',
    description:
      'Provides walkability, bikeability, and transit scores for addresses and neighborhoods.',
    url: 'https://www.walkscore.com/',
    category: 'Livability',
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2024-05-01T00:00:00.000Z'
  },
  {
    id: 2,
    title: 'Numbeo',
    description:
      'Crowd-sourced global database of quality of life data: cost of living, housing indicators, health care, traffic, crime and pollution.',
    url: 'https://www.numbeo.com/',
    category: 'Cost of Living',
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2024-05-01T00:00:00.000Z'
  }
];

async function main() {
  for (const state of states) {
    await prisma.state.upsert({
      where: { name: state.name },
      update: { incomeTaxRate: state.incomeTaxRate, population: state.population },
      create: {
        name: state.name,
        incomeTaxRate: state.incomeTaxRate, // You can update this later
        population: state.population // Placeholder, update later if needed
      }
    });
  }

  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: {
        name: city.name,
        stateId: city.stateId,
        population: city.population,
        salesTaxRate: city.salesTaxRate,
        subreddit: city.subreddit,
        naturalDisasters: city.naturalDisasters,
        violentCrimeRate: city.violentCrimeRate,
        propertyCrimeRate: city.propertyCrimeRate,
        lifeExpectancy: city.lifeExpectancy,
        medianIncome: city.medianIncome,
        medianHouseholdIncome: city.medianHouseholdIncome,
        walkabilityScore: city.walkabilityScore,
        bikeScore: city.bikeScore,
        transitScore: city.transitScore,
        schoolRating: city.transitScore,
        notes: city.notes
      }
    });
  }

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {},
      create: {
        title: resource.title,
        description: resource.description,
        url: resource.url,
        category: resource.category
      }
    });
  }
}

main()
  .then(() => {
    console.log('✅ Seed complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Seed error', e);
    return prisma.$disconnect();
  });
