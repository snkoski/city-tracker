// prisma/seed.ts
import { PrismaClient, PlaceType } from '@prisma/client';

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

const neighborhoods = [
  {
    id: 1,
    name: 'Hollywood',
    cityId: 1,
    population: 150000,
    area: 17.5,
    description: 'Famous for its film industry and Walk of Fame.',
    walkabilityScore: 75,
    bikeScore: 60,
    transitScore: 65,
    schoolRating: 6,
    notes: 'Tourist hotspot.'
  },
  {
    id: 2,
    name: 'Mission District',
    cityId: 2,
    population: 60000,
    area: 1.48,
    description: 'Known for its vibrant murals, Latin culture, and trendy restaurants.',
    walkabilityScore: 97,
    bikeScore: 92,
    transitScore: 85,
    schoolRating: 7,
    notes: 'Great food scene.'
  }
];

const resources = [
  {
    id: 1,
    title: 'Walk Score',
    description:
      'Provides walkability, bikeability, and transit scores for addresses and neighborhoods.',
    url: 'https://www.walkscore.com/',
    category: 'Livability'
  },
  {
    id: 2,
    title: 'Numbeo',
    description:
      'Crowd-sourced global database of quality of life data: cost of living, housing indicators, health care, traffic, crime and pollution.',
    url: 'https://www.numbeo.com/',
    category: 'Cost of Living'
  }
];

const monthlyWeather = [
  {
    id: 1,
    cityId: 1,
    month: 1,
    avgHighTempF: 84,
    avgLowTempF: 66,
    avgTempF: 75,
    avgRainfallInch: 0.01,
    humiditiy: 0.65
  },
  {
    id: 2,
    cityId: 1,
    month: 2,
    avgHighTempF: 68,
    avgLowTempF: 48,
    avgTempF: 58,
    avgRainfallInch: 3.1,
    humiditiy: 0.6
  },
  {
    id: 3,
    cityId: 1,
    month: 3,
    avgHighTempF: 85,
    avgLowTempF: 69,
    avgTempF: 77,
    avgRainfallInch: 4.6,
    humiditiy: 0.7
  },
  {
    id: 4,
    cityId: 1,
    month: 4,
    avgHighTempF: 39,
    avgLowTempF: 26,
    avgTempF: 32.5,
    avgRainfallInch: 3.6,
    humiditiy: 0.62
  },
  {
    id: 5,
    cityId: 1,
    month: 5,
    avgHighTempF: 84,
    avgLowTempF: 66,
    avgTempF: 75,
    avgRainfallInch: 0.01,
    humiditiy: 0.65
  },
  {
    id: 6,
    cityId: 1,
    month: 6,
    avgHighTempF: 68,
    avgLowTempF: 48,
    avgTempF: 58,
    avgRainfallInch: 3.1,
    humiditiy: 0.6
  },
  {
    id: 7,
    cityId: 1,
    month: 7,
    avgHighTempF: 85,
    avgLowTempF: 69,
    avgTempF: 77,
    avgRainfallInch: 4.6,
    humiditiy: 0.7
  },
  {
    id: 8,
    cityId: 1,
    month: 8,
    avgHighTempF: 39,
    avgLowTempF: 26,
    avgTempF: 32.5,
    avgRainfallInch: 3.6,
    humiditiy: 0.62
  },
  {
    id: 9,
    cityId: 1,
    month: 9,
    avgHighTempF: 84,
    avgLowTempF: 66,
    avgTempF: 75,
    avgRainfallInch: 0.01,
    humiditiy: 0.65
  },
  {
    id: 10,
    cityId: 1,
    month: 10,
    avgHighTempF: 68,
    avgLowTempF: 48,
    avgTempF: 58,
    avgRainfallInch: 3.1,
    humiditiy: 0.6
  },
  {
    id: 11,
    cityId: 1,
    month: 11,
    avgHighTempF: 85,
    avgLowTempF: 69,
    avgTempF: 77,
    avgRainfallInch: 4.6,
    humiditiy: 0.7
  },
  {
    id: 12,
    cityId: 1,
    month: 12,
    avgHighTempF: 39,
    avgLowTempF: 26,
    avgTempF: 32.5,
    avgRainfallInch: 3.6,
    humiditiy: 0.62
  }
];

const places = [
  {
    id: 1,
    cityId: 1,
    name: 'Griffith Observatory',
    type: 'MUSEUM',
    neighborhoodId: 1,
    address: '2800 E Observatory Rd, Los Angeles, CA 90027',
    website: 'http://griffithobservatory.org/',
    description: 'Iconic observatory with views of the Hollywood Sign and LA.'
  },

  {
    id: 2,
    cityId: 1,
    name: 'Angel City Brewery',
    type: 'BREWERY',
    neighborhoodId: 1,
    address: '216 S Alameda St, Los Angeles, CA 90012',
    website: 'https://angelcitybrewery.com/',
    description: 'Popular craft brewery in the Arts District.'
  },
  {
    id: 3,
    cityId: 2,
    name: 'The Fillmore',
    type: 'MUSIC_VENUE',
    neighborhoodId: 2,
    address: '1805 Geary Blvd, San Francisco, CA 94115',
    website: 'https://www.thefillmore.com/',
    description: 'Legendary music venue.'
  }
];

const events = [
  {
    id: 1,
    cityId: 1,
    placeId: 2,
    name: 'Brewery Tour & Tasting',
    date: '2025-07-15T14:00:00.000Z',
    startTime: '2025-07-15T14:00:00.000Z',
    endTime: '2025-07-15T16:00:00.000Z',
    details: 'Guided tour of Angel City Brewery and tasting session.',
    website: 'https://angelcitybrewery.com/tours',
    ticketUrl: null
  },
  {
    id: 2,
    cityId: 2,
    placeId: 3,
    name: 'Indie Band Showcase',
    date: '2025-08-01T20:00:00.000Z',
    startTime: '2025-08-01T20:00:00.000Z',
    endTime: '2025-08-01T23:00:00.000Z',
    details: 'Featuring up and coming local bands.',
    website: 'https://www.thefillmore.com/events',
    ticketUrl: 'https://www.ticketmaster.com/thefillmore'
  }
];

const ageDemographics = [
  {
    id: 1,
    cityId: 1,
    ageRange: '0-17',
    percent: 22.5
  },
  {
    id: 2,
    cityId: 1,
    ageRange: '18-34',
    percent: 30.1
  },
  {
    id: 3,
    cityId: 1,
    ageRange: '35-64',
    percent: 35.2
  },
  {
    id: 4,
    cityId: 1,
    ageRange: '65+',
    percent: 12.2
  }
];

const ethnicDemographics = [
  {
    id: 1,
    cityId: 1,
    group: 'Hispanic or Latino',
    percent: 48.5
  },
  {
    id: 2,
    cityId: 1,
    group: 'White',
    percent: 28.7
  },
  {
    id: 3,
    cityId: 1,
    group: 'Asian',
    percent: 11.8
  },
  {
    id: 4,
    cityId: 1,
    group: 'Black or African American',
    percent: 8.9
  }
];

const airports = [
  {
    id: 1,
    cityId: 1,
    name: 'Los Angeles International Airport',
    code: 'LAX',
    isInternational: true,
    travelTimeMinutes: 45,
    distanceMiles: 18,
    transitOptions: 'FlyAway Bus, Metro Rail, Ride Shares',
    website: 'https://www.flylax.com/',
    description: 'Major international gateway to Southern California.'
  },
  {
    id: 2,
    cityId: 2,
    name: 'San Francisco International Airport',
    code: 'SFO',
    isInternational: true,
    travelTimeMinutes: 30,
    distanceMiles: 13,
    transitOptions: 'BART, SamTrans Bus, Ride Shares',
    website: 'https://www.flysfo.com/',
    description: 'Main airport serving the San Francisco Bay Area.'
  }
];

const allergenLevels = [
  {
    id: 1,
    cityId: 1,
    month: 1,
    pollen: 7,
    dust: 4,
    mold: 3,
    ragweed: 2,
    grass: 6,
    trees: 7
  },
  {
    id: 2,
    cityId: 1,
    month: 2,
    pollen: 5,
    dust: 5,
    mold: 4,
    ragweed: 6,
    grass: 4,
    trees: 3
  },
  {
    id: 3,
    cityId: 1,
    month: 3,
    pollen: 8,
    dust: 3,
    mold: 5,
    ragweed: 1,
    grass: 7,
    trees: 8
  },
  {
    id: 4,
    cityId: 1,
    month: 4,
    pollen: 6,
    dust: 4,
    mold: 6,
    ragweed: 7,
    grass: 5,
    trees: 4
  },
  {
    id: 5,
    cityId: 1,
    month: 5,
    pollen: 7,
    dust: 4,
    mold: 3,
    ragweed: 2,
    grass: 6,
    trees: 7
  },
  {
    id: 6,
    cityId: 1,
    month: 6,
    pollen: 5,
    dust: 5,
    mold: 4,
    ragweed: 6,
    grass: 4,
    trees: 3
  },
  {
    id: 7,
    cityId: 1,
    month: 7,
    pollen: 8,
    dust: 3,
    mold: 5,
    ragweed: 1,
    grass: 7,
    trees: 8
  },
  {
    id: 8,
    cityId: 1,
    month: 8,
    pollen: 6,
    dust: 4,
    mold: 6,
    ragweed: 7,
    grass: 5,
    trees: 4
  },
  {
    id: 9,
    cityId: 1,
    month: 9,
    pollen: 7,
    dust: 4,
    mold: 3,
    ragweed: 2,
    grass: 6,
    trees: 7
  },
  {
    id: 10,
    cityId: 1,
    month: 10,
    pollen: 5,
    dust: 5,
    mold: 4,
    ragweed: 6,
    grass: 4,
    trees: 3
  },
  {
    id: 11,
    cityId: 1,
    month: 11,
    pollen: 8,
    dust: 3,
    mold: 5,
    ragweed: 1,
    grass: 7,
    trees: 8
  },
  {
    id: 12,
    cityId: 1,
    month: 12,
    pollen: 6,
    dust: 4,
    mold: 6,
    ragweed: 7,
    grass: 5,
    trees: 4
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

  for (const neighborhood of neighborhoods) {
    await prisma.neighborhood.upsert({
      where: { id: neighborhood.id },
      update: {},
      create: {
        id: neighborhood.id,
        name: neighborhood.name,
        cityId: neighborhood.cityId,
        population: neighborhood.population,
        area: neighborhood.area,
        description: neighborhood.description,
        walkabilityScore: neighborhood.walkabilityScore,
        bikeScore: neighborhood.bikeScore,
        transitScore: neighborhood.transitScore,
        schoolRating: neighborhood.schoolRating,
        notes: neighborhood.notes
      }
    });
  }

  for (const place of places) {
    await prisma.place.upsert({
      where: { id: place.id },
      update: {},
      create: {
        id: place.id,
        cityId: place.cityId,
        name: place.name,
        type: place.type as PlaceType,
        neighborhoodId: place.neighborhoodId,
        address: place.address,
        website: place.website,
        description: place.description
      }
    });
  }

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        cityId: event.cityId,
        placeId: event.placeId,
        name: event.name,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        details: event.details,
        website: event.website,
        ticketUrl: event.ticketUrl
      }
    });
  }

  for (const month of monthlyWeather) {
    await prisma.monthlyWeather.upsert({
      where: { id: month.id },
      update: {},
      create: {
        id: month.id,
        cityId: month.cityId,
        month: month.month,
        avgHighTempF: month.avgHighTempF,
        avgLowTempF: month.avgLowTempF,
        avgTempF: month.avgTempF,
        avgRainfallInch: month.avgRainfallInch,
        humiditiy: month.humiditiy
      }
    });
  }

  for (const ageDemographic of ageDemographics) {
    await prisma.ageDemographic.upsert({
      where: { id: ageDemographic.id },
      update: {},
      create: {
        id: ageDemographic.id,
        cityId: ageDemographic.cityId,
        ageRange: ageDemographic.ageRange,
        percent: ageDemographic.percent
      }
    });
  }

  for (const ethnicDemographic of ethnicDemographics) {
    await prisma.ethnicDemographic.upsert({
      where: { id: ethnicDemographic.id },
      update: {},
      create: {
        id: ethnicDemographic.id,
        cityId: ethnicDemographic.cityId,
        group: ethnicDemographic.group,
        percent: ethnicDemographic.percent
      }
    });
  }

  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { id: airport.id },
      update: {},
      create: {
        id: airport.id,
        cityId: airport.cityId,
        name: airport.name,
        code: airport.code,
        isInternational: airport.isInternational,
        travelTimeMinutes: airport.travelTimeMinutes,
        distanceMiles: airport.distanceMiles,
        transitOptions: airport.transitOptions,
        website: airport.website,
        description: airport.description
      }
    });
  }

  for (const allergenLevel of allergenLevels) {
    await prisma.allergenLevel.upsert({
      where: { id: allergenLevel.id },
      update: {},
      create: {
        id: allergenLevel.id,
        cityId: allergenLevel.cityId,
        month: allergenLevel.month,
        pollen: allergenLevel.pollen,
        dust: allergenLevel.dust,
        mold: allergenLevel.mold,
        ragweed: allergenLevel.ragweed,
        grass: allergenLevel.grass,
        trees: allergenLevel.trees
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
