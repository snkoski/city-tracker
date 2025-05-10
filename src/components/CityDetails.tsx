import { City } from '@prisma/client';

type CityDetailsProps = {
  city: City;
};

export const CityDetails = ({ city: { name, id } }: CityDetailsProps) => {
  return (
    <div>
      <p>{name}</p>
      <p>{id} for some reason</p>
    </div>
  );
};
