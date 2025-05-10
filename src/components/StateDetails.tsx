import { State } from '@prisma/client';

type StateDetailsProps = {
  state: State;
  onSelectState: React.Dispatch<React.SetStateAction<number | null>>;
};

export const StateDetails = ({ state, onSelectState }: StateDetailsProps) => {
  return (
    <div className="flex flex-col">
      <p>{state.name}</p>
      <p>Population: {state.population}</p>
      <p>Income Tax Rate: {state.incomeTaxRate?.toString()}</p>
      <button type="button" onClick={() => onSelectState(state.id)}>
        Go to cities
      </button>
    </div>
  );
};
