import { CityFullDetails, EventWithPlaceDetails } from '../types';
import { EventManager } from './Events/EventManager';
import { MonthlyWeatherManager } from './MonthlyWeather/MonthlyWeatherManager';
import { NeighborhoodManager } from './Neighborhoods/NeighborhoodManager';
import { AgeDemographicsManager } from './AgeDemographics/AgeDemographicsManager';
import { EthnicDemographicsManager } from './EthnicDemographics/EthnicDemographicsManager';
import { AllergenLevelsManager } from './AllergenLevels/AllergenLevelsManager';
import { AirportsManager } from './Airports/AirportsManager';
import { PlacesManager } from './Places/PlacesManager';
import { CityManager } from './Cities/CityManager';
import { useState } from 'react';
import { Neighborhood, Place } from '@prisma/client';

type CityDetailsProps = {
  city: CityFullDetails | null;
};

export const CityDetails = ({ city }: CityDetailsProps) => {
  console.log('CITYDETAILS - city', city);
  const [events, setEvents] = useState<EventWithPlaceDetails[]>(city?.events || []);

  const [places, setPlaces] = useState<Place[]>(city?.places || []);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(city?.neighborhoods || []);

  const handleSetEvents = (newEvents: EventWithPlaceDetails[]) => {
    setEvents(newEvents);
  };

  const handleSetPlaces = (newPlaces: Place[]) => {
    setPlaces(newPlaces);
  };

  const handleSetNeighborhoods = (newNeighborhoods: Neighborhood[]) => {
    setNeighborhoods(newNeighborhoods);
  };

  return (
    <div>
      {city && <CityManager city={city} />}
      {city && (
        <NeighborhoodManager
          cityId={city.id}
          neighborhoods={neighborhoods}
          setNeighborhoodsCallback={handleSetNeighborhoods}
        />
      )}
      {city && <MonthlyWeatherManager cityId={city.id} />}
      {city && (
        <EventManager
          cityId={city.id}
          events={events}
          places={places}
          setEventsCallback={handleSetEvents}
        />
      )}
      {city && <AgeDemographicsManager cityId={city.id} />}
      {city && <EthnicDemographicsManager cityId={city.id} />}
      {city && <AllergenLevelsManager cityId={city.id} />}
      {city && <AirportsManager cityId={city.id} />}
      {city && (
        <PlacesManager
          cityId={city.id}
          places={places}
          neighborhoods={neighborhoods}
          setPlacesCallback={handleSetPlaces}
        />
      )}
    </div>
  );
};
