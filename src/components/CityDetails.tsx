type CityDetailsProps = {
  name: string;
  state: string;
  population: number | null;
  taxRate: number | null;
};

export const CityDetails = ({ name, state, population, taxRate }: CityDetailsProps) => {
  return (
    <div>
      <p>
        {name}, {state}
      </p>
      <p>Population: {population ?? 'N/A'}</p>
      <p>Tax Rate: {taxRate ?? 'N/A'}</p>
    </div>
  );
};
