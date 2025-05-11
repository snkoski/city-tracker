import { Prisma } from '@prisma/client';

export type CityFullDetails = Prisma.CityGetPayload<{
  include: {
    places: true;
    airports: true;
    events: true;
    monthlyWeather: true;
    neighborhoods: true;
    ageDemographics: true;
    ethnicDemographics: true;
    allergenLevels: true;
    state: true;
  };
}>;
