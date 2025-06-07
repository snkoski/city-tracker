import { City, State } from '@prisma/client';
import { CitySummary } from '../../CitySummary';
import StateContainer from '../../StateContainer';

type CitySummaryListProps = {
  cities: City[];
  state: State;
  handleSelectCity: (city: City) => void;
};

export const CitySummaryList = ({ cities, state, handleSelectCity }: CitySummaryListProps) => {
  return (
    <div className="flex flex-row gap-2">
      {cities.map((city) => (
        <StateContainer key={city.id}>
          <CitySummary
            city={city}
            state={state.name ?? 'Where the fuck is this place'}
            onSelectCity={() => handleSelectCity(city)}
          />
        </StateContainer>
      ))}
    </div>
  );
};
