import { City } from '@prisma/client';

type CitySummaryProps = {
  city: City;
  state: string;
  onSelectCity: (cityId: number) => void;
};

export const CitySummary = ({ city, state, onSelectCity }: CitySummaryProps) => {
  return (
    <div>
      <p>
        {city.name}, {state}
      </p>
      <p>Population: {city.population ?? 'N/A'}</p>
      <p>Tax Rate: {city.salesTaxRate?.toString() ?? 'N/A'}</p>
      <button type="button" onClick={() => onSelectCity(city.id)}>
        Full details
      </button>
    </div>
  );
};
