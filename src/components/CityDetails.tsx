import { CityFullDetails } from '../types';
import { ReactNode } from 'react';
import { Airport, Place, EthnicDemographic, AllergenLevel } from '@prisma/client';
import { EventManager } from './Events/EventManager';
import { MonthlyWeatherManager } from './MonthlyWeather/MonthlyWeatherManager';
import { getLocalizedMonthName } from '../utils/dateUtils';
import { NeighborhoodManager } from './Neighborhoods/NeighborhoodManager';
import { AgeDemographicsManager } from './AgeDemographics/AgeDemographicsManager';
import { EthnicDemographicsManager } from './EthnicDemographics/EthnicDemographicsManager';

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
  const CityForm = () => {
    return (
      <div>
        <p>hello</p>
        <form>
          <label htmlFor="city-name">Name</label>
          <input id="city-name" type="text" className="border-2 border-black" />
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <CityForm />
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
      {city && <NeighborhoodManager cityId={city.id} />}
      {city && <MonthlyWeatherManager cityId={city.id} />}
      {city && <EventManager cityId={city.id} />}
      {city && <AgeDemographicsManager cityId={city.id} />}
      {city && <EthnicDemographicsManager cityId={city.id} />}
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
