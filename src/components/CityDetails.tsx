import { CityFullDetails } from '../types';
import { ReactNode } from 'react';
import { Place } from '@prisma/client';
import { EventManager } from './Events/EventManager';
import { MonthlyWeatherManager } from './MonthlyWeather/MonthlyWeatherManager';
import { NeighborhoodManager } from './Neighborhoods/NeighborhoodManager';
import { AgeDemographicsManager } from './AgeDemographics/AgeDemographicsManager';
import { EthnicDemographicsManager } from './EthnicDemographics/EthnicDemographicsManager';
import { AllergenLevelsManager } from './AllergenLevels/AllergenLevelsManager';
import { AirportsManager } from './Airports/AirportsManager';
import { PlacesManager } from './Places/PlacesManager';

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
      {city && <AllergenLevelsManager cityId={city.id} />}
      {city && <AirportsManager cityId={city.id} />}
      {city && <PlacesManager cityId={city.id} />}
    </div>
  );
};
