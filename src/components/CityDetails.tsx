import { ReactNode } from 'react';
import { CityFullDetails } from '../types';
import {
  Airport,
  Place,
  Event,
  MonthlyWeather,
  Neighborhood,
  AgeDemographic,
  EthnicDemographic,
  AllergenLevel
} from '@prisma/client';
import { getLocalizedMonthName } from '../utils/dateUtils';

type CityDetailsProps = {
  city: CityFullDetails | null;
};

const sectionContainer = <T extends { id: string | number }>(
  title: string,
  data: T[] | undefined,
  callback: (item: T) => ReactNode,
  flexDirection: 'row' | 'col' = 'col'
) => {
  if (!data || data.length === 0)
    return (
      <div className="border-red-400 border-2 rounded-lg p-2">
        <p>No {title} data yet...</p>
      </div>
    );
  return (
    <div className={`border-b-cyan-700 border-2 rounded-xl p-2 flex flex[${flexDirection}]`}>
      <p>
        <strong>{title}</strong>
      </p>
      <ul>{data.map(callback)}</ul>
    </div>
  );
};

export const CityDetails = ({ city }: CityDetailsProps) => {
  console.log('CITY', city);

  return (
    <div className="flex flex-col gap-2">
      <p>
        {city?.name}, {city?.state.name}
      </p>
      <p>Population: {city?.population}</p>
      <p>Sales Tax Rate: {city?.salesTaxRate?.toString()}</p>
      <p>
        Subreddit:{' '}
        <a
          href={city?.subreddit ? `https://www.reddit.com/${city?.subreddit}` : ''}
          target="_blank"
          rel="noopener noreferrer"
        >
          {city?.subreddit}
        </a>
      </p>
      <p>Natural Disasters: {city?.naturalDisasters}</p>
      <p>Violent Crime Rate: {city?.violentCrimeRate?.toString()}</p>
      <p>Property Crime Rate: {city?.propertyCrimeRate?.toString()}</p>
      <p>Life Expectancy: {city?.lifeExpectancy}</p>
      <p>Median Income: {city?.medianIncome}</p>
      <p>Median Household Income: {city?.medianHouseholdIncome}</p>
      <p>Walkability Score: {city?.walkabilityScore}</p>
      <p>Bike Score: {city?.bikeScore}</p>
      <p>Transit Score: {city?.transitScore}</p>
      <p>School Rating: {city?.schoolRating}</p>
      <p>Notes: {city?.notes}</p>
      {sectionContainer<Neighborhood>('Neighborhoods', city?.neighborhoods, (neighborhood) => {
        return (
          <li key={neighborhood.id}>
            <div>
              <p className="font-semibold">{neighborhood.name}</p>
              {neighborhood.population && <p>Population: {neighborhood.population}</p>}
              {neighborhood.area && <p>Area: {neighborhood.area}</p>}
              {neighborhood.description && <p>Description: {neighborhood.description}</p>}
              {neighborhood.walkabilityScore && (
                <p>Walkability Score: {neighborhood.walkabilityScore}</p>
              )}
              {neighborhood.bikeScore && <p>Bike Score: {neighborhood.bikeScore}</p>}
              {neighborhood.transitScore && <p>Transit Score: {neighborhood.transitScore}</p>}
              {neighborhood.schoolRating && <p>School Rating: {neighborhood.schoolRating}</p>}
              {neighborhood.notes && <p>Notes: {neighborhood.notes}</p>}
            </div>
          </li>
        );
      })}
      {sectionContainer<MonthlyWeather>(
        'Monthly Weather',
        city?.monthlyWeather,
        (monthlyWeather) => {
          return (
            <li key={monthlyWeather.id}>
              <div className="flex flex-col">
                <p>{getLocalizedMonthName(monthlyWeather.month)}</p>
                <p>Avgerage Temp: {monthlyWeather.avgTempF?.toString()} F</p>
              </div>
            </li>
          );
        },
        'row'
      )}
      {sectionContainer<Event>('Events', city?.events, (event) => {
        return <li key={event.id}>{event.name}</li>;
      })}
      {sectionContainer<AgeDemographic>(
        'Age Demographics',
        city?.ageDemographics,
        (ageDemographic) => {
          return <li key={ageDemographic.id}>{ageDemographic.ageRange}</li>;
        }
      )}
      {sectionContainer<EthnicDemographic>(
        'EthnicDemographics',
        city?.ethnicDemographics,
        (ethnicDemographic) => {
          return <li key={ethnicDemographic.id}>{ethnicDemographic.group}</li>;
        }
      )}
      {sectionContainer<AllergenLevel>('AllergenLevels', city?.allergenLevels, (allergenLevel) => {
        return <li key={allergenLevel.id}>{allergenLevel.month}</li>;
      })}
      {sectionContainer<Airport>('Airports', city?.airports, (airport) => {
        return <li key={airport.id}>{airport.name}</li>;
      })}
      {sectionContainer<Place>('Places', city?.places, (place) => {
        return <li key={place.id}>{place.name}</li>;
      })}
    </div>
  );
};
