import { ReactNode } from 'react';
import { CityFullDetails, EventWithPlaceDetails } from '../types';
import {
  Airport,
  Place,
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
  const flexDir = flexDirection === 'row' ? 'flex-row' : 'flex-col';
  return (
    <div className={`border-b-cyan-700 border-2 rounded-xl p-2 flex flex-col`}>
      <p>
        <strong>{title}</strong>
      </p>
      <ul className={`flex ${flexDir} gap-2`}>{data.map(callback)}</ul>
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
        'Monthly Weather Averages',
        city?.monthlyWeather,
        (monthlyWeather) => {
          return (
            <li key={monthlyWeather.id} className="flex">
              <div className="flex flex-col border-amber-600 border-2 p-1 rounded-md">
                <p>{getLocalizedMonthName(monthlyWeather.month)}</p>
                <p>Temp: {monthlyWeather.avgTempF?.toString()}&deg; F</p>
                <p>High: {monthlyWeather.avgHighTempF?.toString()}&deg; F</p>
                <p>Low: {monthlyWeather.avgLowTempF?.toString()}&deg; F</p>
                <p>Rain Fall: {monthlyWeather.avgRainfallInch?.toString()}"</p>
                <p>Humidity: {monthlyWeather.humiditiy?.toString()}%</p>
              </div>
            </li>
          );
        },
        'row'
      )}
      {sectionContainer<EventWithPlaceDetails>('Events', city?.events, (event) => {
        return (
          <li key={event.id}>
            <div>
              <p>
                <strong>{event.name}</strong>
                {event.place?.name && ` @ ${event.place.name}`}
              </p>
              {event.date && <p>{event.date.toString()}</p>}
              {(event.startTime || event.endTime) && (
                <p>
                  {event.startTime && `From: ${event.startTime} `}
                  {event.endTime && `Until: ${event.endTime}`}
                </p>
              )}
              {event.website && (
                <a href={`${event.website}`} target="_blank" rel="noopener noreferrer">
                  <p>Website</p>
                </a>
              )}
              {event.ticketUrl && (
                <a href={`${event.ticketUrl}`} target="_blank" rel="noopener noreferrer">
                  <p>Tickets</p>
                </a>
              )}
              {event.details && <p>{event.details}</p>}
            </div>
          </li>
        );
      })}
      {sectionContainer<AgeDemographic>(
        'Age Demographics',
        city?.ageDemographics,
        (ageDemographic) => {
          return (
            <li key={ageDemographic.id}>
              <p>{ageDemographic.ageRange}</p>
              <p>{ageDemographic.percent.toString()}%</p>
            </li>
          );
        },
        'row'
      )}
      {sectionContainer<EthnicDemographic>(
        'EthnicDemographics',
        city?.ethnicDemographics,
        (ethnicDemographic) => {
          return (
            <li key={ethnicDemographic.id}>
              <p>
                {ethnicDemographic.group}: {ethnicDemographic.percent.toString()}%
              </p>
            </li>
          );
        }
      )}
      {sectionContainer<AllergenLevel>(
        'AllergenLevels',
        city?.allergenLevels,
        (allergenLevel) => {
          return (
            <li key={allergenLevel.id}>
              <div className="flex flex-col border-amber-600 border-2 p-1 rounded-md">
                <p>{getLocalizedMonthName(allergenLevel.month)}</p>
                <p>Pollen: {allergenLevel.pollen}</p>
                <p>Dust: {allergenLevel.dust}</p>
                <p>Mold: {allergenLevel.mold}</p>
                <p>Ragweed: {allergenLevel.ragweed}</p>
                <p>Grass: {allergenLevel.grass}</p>
                <p>Trees: {allergenLevel.trees}</p>
              </div>
            </li>
          );
        },
        'row'
      )}
      {sectionContainer<Airport>('Airports', city?.airports, (airport) => {
        return (
          <li key={airport.id}>
            <div>
              <p>
                {airport.code}:{' '}
                <a href={`${airport.website}`} target="_blank" rel="noopener noreferrer">
                  {airport.name}
                </a>
                {airport.isInternational && (
                  <span className="font-bold text-pink-400">
                    {' '}
                    Int(ernational) not an Integer you dummies
                  </span>
                )}
              </p>
              <p>Distance: {airport.distanceMiles} miles</p>
              <p>Hopefully takes {airport.travelTimeMinutes} minutes🤷‍♂️</p>
              <p>{airport.description}</p>
            </div>
          </li>
        );
      })}
      {sectionContainer<Place>('Places', city?.places, (place) => {
        return (
          <li key={place.id}>
            <div>
              <p>
                <a href={`${place.website}`} target="_blank" rel="noopener noreferrer">
                  {place.name}
                </a>{' '}
                - {place.type}
              </p>
              <p>{place.description}</p>
            </div>
          </li>
        );
      })}
    </div>
  );
};
