import { Neighborhood, City } from '@prisma/client';

interface NeighborhoodDetailProps {
  neighborhood: Neighborhood & {
    city: City;
  };
}

export default function NeighborhoodDetail({ neighborhood }: NeighborhoodDetailProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4">{neighborhood.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">City:</span> {neighborhood.city.name}
          </p>
          {neighborhood.population && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Population:</span>{' '}
              {neighborhood.population.toLocaleString()}
            </p>
          )}
          {neighborhood.area && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Area:</span> {neighborhood.area.toFixed(2)} km²
            </p>
          )}
        </div>
        <div>
          {neighborhood.walkabilityScore && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Walkability Score:</span>{' '}
              {neighborhood.walkabilityScore}/100
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Created:</span>{' '}
            {new Date(neighborhood.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {neighborhood.description && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Description:</h3>
          <p className="text-gray-600 dark:text-gray-300">{neighborhood.description}</p>
        </div>
      )}
    </div>
  );
}
