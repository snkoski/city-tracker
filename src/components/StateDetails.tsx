type StateDetailsProps = {
  name: string;
  population: number;
  incomeTaxRate: number;
};

export const StateDetails = ({ name, population, incomeTaxRate }: StateDetailsProps) => {
  return (
    <div>
      <p>{name}</p>
      <p>Population: {population}</p>
      <p>Income Tax Rate: {incomeTaxRate}</p>
    </div>
  );
};
