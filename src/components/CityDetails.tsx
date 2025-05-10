import { City } from '@prisma/client';

type CityDetailsProps = {
  city: City;
};

export const CityDetails = ({ city }: CityDetailsProps) => {
  return (
    <div>
      <p>{city.name}</p>
      <p>{city.id} for some reason</p>
    </div>
  );
};
