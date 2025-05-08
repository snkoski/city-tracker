type CityDetailsProps = {
  name: string;
  state: string;
  population: number;
  taxRate: number;
};

export const CityDetails = ({ name, state, population, taxRate }: CityDetailsProps) => {
  return (
    <div>
      <p>
        {name}, {state}
      </p>
      <p>Population: {population}</p>
      <p>Tax Rate: {taxRate}</p>
    </div>
  );
};
