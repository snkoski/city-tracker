import { City, State } from '@prisma/client';
import StateContainer from '../../StateContainer';
import { CitySummary } from '../../CitySummary';

type CitySummaryManagerProps = {
  cities: City[];
  state: State | null;
  handleSelectCity: (city: City) => void;
};

export const CitySummaryManager = ({
  cities,
  state,
  handleSelectCity
}: CitySummaryManagerProps) => {
  return (
    <div className="flex flex-row gap-2">
      {cities.map((city) => (
        <StateContainer key={city.id}>
          <CitySummary
            city={city}
            state={state?.name ?? 'Where the fuck is this place'}
            onSelectCity={() => handleSelectCity(city)}
          />
        </StateContainer>
      ))}
    </div>
  );
};
