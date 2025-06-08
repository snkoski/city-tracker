import { Neighborhood, Place } from '@prisma/client';

type PlacesListProps = {
  places: Place[];
  neighborhoods: Neighborhood[];
  onEdit: (data: Place) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const PlacesList = ({
  places,
  neighborhoods,
  onEdit,
  onDelete,
  isLoadingDelete
}: PlacesListProps) => {
  if (!places.length) {
    return <p>No places yet. Find somewhere to go!</p>;
  }
  return (
    <div className="border-cyan-400 border-2 rounded-2xl p-4">
      {places.map((place) => (
        <div key={place.id}>
          <p>
            <a href={`${place.website}`} target="_blank" rel="noopener noreferrer">
              {place.name}
            </a>{' '}
            - {place.type}
          </p>
          <p>{place.description}</p>
          <p>
            neighborhood:{' '}
            {place.neighborhoodId
              ? neighborhoods.find((item) => item.id === place.neighborhoodId)?.name
              : 'n/a'}
          </p>
          <p>address: {place.address}</p>
          <div>
            <button type="button" onClick={() => onEdit(place)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(place.id)}
              disabled={isLoadingDelete === place.id}
            >
              {isLoadingDelete === place.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
