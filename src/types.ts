import { Event, MonthlyWeather, Prisma, Resource } from '@prisma/client';

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

export type MonthlyWeatherFormDaa = Omit<MonthlyWeather, 'id' | 'createdAt' | 'updatedAt'>;
