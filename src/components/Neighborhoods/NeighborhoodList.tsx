import { Neighborhood } from '@prisma/client';

type NeighborhoodListProps = {
  neighborhoods: Neighborhood[];
  onEdit: (data: Neighborhood) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const NeighborhoodList = ({
  neighborhoods,
  onEdit,
  onDelete,
  isLoadingDelete
}: NeighborhoodListProps) => {
  if (!neighborhoods.length) {
    return <p>Intellisense is kinda ass. Oh yeah there are no neighborhoods for this city</p>;
  }
  return (
    <div className="border-lime-600 border-2 rounded-3xl">
      {neighborhoods.map((neighborhood) => (
        <div key={neighborhood.id}>
          <p>
            <strong>{neighborhood.name}</strong>
          </p>
          <p>Population: {neighborhood.population ? neighborhood.population : 'n/a'}</p>
          <div>
            <button type="button" onClick={() => onEdit(neighborhood)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(neighborhood.id)}
              disabled={isLoadingDelete === neighborhood.id}
            >
              {isLoadingDelete === neighborhood.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
