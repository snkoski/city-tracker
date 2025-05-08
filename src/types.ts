// TypeScript types based on complete Prisma schema

// Enum for PlaceType
export enum PlaceType {
  BREWERY = 'BREWERY',
  RESTAURANT = 'RESTAURANT',
  MUSIC_VENUE = 'MUSIC_VENUE',
  MUSEUM = 'MUSEUM',
  COWORKING = 'COWORKING',
  AIRPORT = 'AIRPORT'
}

// State model
export interface State {
  id: number;
  name: string;
  incomeTaxRate: number; // Decimal in Prisma, number in TypeScript
  population: number;
  cities: City[];
}

// City model
export interface City {
  id: number;
  name: string;
  stateId: number;
  population: number | null;
  salesTaxRate: number | null; // Decimal in Prisma, number in TypeScript
  subreddit: string | null;
  naturalDisasters: string | null;
  crimeRate: number | null; // Decimal in Prisma, number in TypeScript
  walkabilityScore: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  events: Event[];
  monthlyWeather: MonthlyWeather[];
  places: Place[];
  state: State;
  neighborhoods: Neighborhood[];
}

// Neighborhood model
export interface Neighborhood {
  id: number;
  name: string;
  cityId: number;
  population: number | null;
  area: number | null; // Float in Prisma, number in TypeScript
  description: string | null;
  walkabilityScore: number | null;
  createdAt: Date;
  updatedAt: Date;
  places: Place[];
  city: City;
}

// MonthlyWeather model
export interface MonthlyWeather {
  id: number;
  cityId: number;
  month: number;
  avgHighTempF: number; // Decimal in Prisma, number in TypeScript
  avgLowTempF: number; // Decimal in Prisma, number in TypeScript
  avgTempF: number; // Decimal in Prisma, number in TypeScript
  avgRainfallInch: number; // Decimal in Prisma, number in TypeScript
  city: City;
}

// Place model
export interface Place {
  id: number;
  cityId: number;
  name: string;
  type: PlaceType;
  neighborhoodId: number | null;
  address: string;
  website: string | null;
  description: string | null;
  events: Event[];
  city: City;
  neighborhood: Neighborhood | null;
}

// Event model
export interface Event {
  id: number;
  cityID: number | null;
  placeId: number | null;
  name: string;
  date: Date;
  startTime: Date | null;
  endTime: Date | null;
  details: string | null;
  website: string | null;
  ticketUrl: string | null;
  city: City | null;
  place: Place | null;
}
