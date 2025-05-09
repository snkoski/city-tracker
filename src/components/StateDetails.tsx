type StateDetailsProps = {
  id: number;
  incomeTaxRate: number;
  name: string;
  population: number;
  setSelectedStateId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const StateDetails = ({
  id,
  name,
  population,
  incomeTaxRate,
  setSelectedStateId
}: StateDetailsProps) => {
  return (
    <div className="flex flex-col">
      <p>{name}</p>
      <p>Population: {population}</p>
      <p>Income Tax Rate: {incomeTaxRate}</p>
      <button type="button" onClick={() => setSelectedStateId(id)}>
        Go to cities
      </button>
    </div>
  );
};
