import {
  AgeDemographic,
  Airport,
  AllergenLevel,
  City,
  EthnicDemographic,
  Event,
  MonthlyWeather,
  Neighborhood,
  Place,
  Prisma,
  Resource
} from '@prisma/client';

export type CityFullDetails = Prisma.CityGetPayload<{
  include: {
    places: true;
    airports: true;
    events: {
      include: {
        place: true;
      };
    };
    monthlyWeather: true;
    neighborhoods: true;
    ageDemographics: true;
    ethnicDemographics: true;
    allergenLevels: true;
    state: true;
  };
}>;

export type EventWithPlaceDetails = Prisma.EventGetPayload<{
  include: {
    place: true;
  };
}>;

export type ResourceFormData = Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>;

export type EventFormData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

export type MonthlyWeatherFormData = Omit<MonthlyWeather, 'id' | 'createdAt' | 'updatedAt'>;

export type CityFormData = Omit<City, 'id' | 'createdAt' | 'updatedAt'>;

export type NeighborhoodFormData = Omit<Neighborhood, 'id' | 'createdAt' | 'updatedAt'>;

export type PlaceFormData = Omit<Place, 'id' | 'createdAt' | 'updatedAt'>;

export type AgeDemographicFormData = Omit<AgeDemographic, 'id' | 'createdAt' | 'updatedAt'>;

export type EthnicDemographicFormData = Omit<EthnicDemographic, 'id' | 'createdAt' | 'updatedAt'>;

export type AirportFormData = Omit<Airport, 'id' | 'createdAt' | 'updatedAt'>;

export type AllergenLevelFormData = Omit<AllergenLevel, 'id' | 'createdAt' | 'updatedAt'>;

export type CitySummaryFormData = Pick<City, 'name' | 'population' | 'salesTaxRate'>;
