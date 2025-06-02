import { Airport } from '@prisma/client';

type AirportsListProps = {
  airports: Airport[];
  onEdit: (data: Airport) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const AirportsList = ({
  airports,
  onEdit,
  onDelete,
  isLoadingDelete
}: AirportsListProps) => {
  if (!airports.length) {
    return <p>No Allergen Levels yet. Will I be sneezy!</p>;
  }
  return (
    <div className="border-cyan-400 border-2 rounded-2xl p-4">
      {airports.map((airport) => (
        <div key={airport.id}>
          <div className="flex flex-col border-amber-600 border-2 p-1 rounded-md">
            <p>
              {airport.code}:{' '}
              <a href={`${airport.website}`} target="_blank" rel="noopener noreferrer">
                {airport.name}
              </a>
              {airport.isInternational && (
                <span className="font-bold text-pink-400">
                  {' '}
                  Int(ernational) not an Integer you dummies
                </span>
              )}
            </p>
            <p>{airport.description}</p>
            <p>Getting there:</p>
            <p>Transit options: {airport.transitOptions}</p>
            <p>Distance: {airport.distanceMiles} miles</p>
            <p>Driving hopefully takes {airport.travelTimeMinutes} minutes🤷‍♂️</p>
          </div>
          <div>
            <button type="button" onClick={() => onEdit(airport)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(airport.id)}
              disabled={isLoadingDelete === airport.id}
            >
              {isLoadingDelete === airport.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
