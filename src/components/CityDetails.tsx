import { CityFullDetails } from '../types';
import { EventManager } from './Events/EventManager';
import { MonthlyWeatherManager } from './MonthlyWeather/MonthlyWeatherManager';
import { NeighborhoodManager } from './Neighborhoods/NeighborhoodManager';
import { AgeDemographicsManager } from './AgeDemographics/AgeDemographicsManager';
import { EthnicDemographicsManager } from './EthnicDemographics/EthnicDemographicsManager';
import { AllergenLevelsManager } from './AllergenLevels/AllergenLevelsManager';
import { AirportsManager } from './Airports/AirportsManager';
import { PlacesManager } from './Places/PlacesManager';
import { CityManager } from './Cities/CityManager';

type CityDetailsProps = {
  city: CityFullDetails | null;
};

export const CityDetails = ({ city }: CityDetailsProps) => {
  console.log('CITYDETAILS - city', city);

  return (
    <div>
      {city && <CityManager city={city} />}
      {city && <NeighborhoodManager cityId={city.id} />}
      {city && <MonthlyWeatherManager cityId={city.id} />}
      {city && <EventManager cityId={city.id} />}
      {city && <AgeDemographicsManager cityId={city.id} />}
      {city && <EthnicDemographicsManager cityId={city.id} />}
      {city && <AllergenLevelsManager cityId={city.id} />}
      {city && <AirportsManager cityId={city.id} />}
      {city && <PlacesManager cityId={city.id} neighborhoods={city.neighborhoods} />}
    </div>
  );
};
