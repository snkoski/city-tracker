type CityDetailsProps = {
  name: string;
  id: number;
};

export const CityDetails = ({ name, id }: CityDetailsProps) => {
  return (
    <div>
      <p>{name}</p>
      <p>{id} for some reason</p>
    </div>
  );
};
