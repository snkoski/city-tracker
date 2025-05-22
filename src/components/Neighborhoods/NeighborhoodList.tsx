import { Neighborhood } from '@prisma/client';

type NeighborhoodListProps = {
  neighborhoods: Neighborhood[];
};

export const NeighborhoodList = ({ neighborhoods }: NeighborhoodListProps) => {
  if (!neighborhoods.length) {
    return <p>Intellisense is kinda ass. Oh yeah there are no neighborhoods for this city</p>;
  }
  return (
    <div className="border-lime-600 border-2 rounded-3xl">
      {neighborhoods.map((neighborhood) => (
        <div key={neighborhood.id}></div>
      ))}
    </div>
  );
};
