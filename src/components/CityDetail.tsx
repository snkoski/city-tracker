import { City, State, Neighborhood } from '@prisma/client';
import { useState } from 'react';
import NeighborhoodDetail from './NeighborhoodDetail';

interface CityDetailProps {
  city: City & {
    state: State;
    neighborhoods: Neighborhood[];
  };
}

export default function CityDetail({ city }: CityDetailProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4">{city.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">State:</span> {city.state.name}
          </p>
          {city.population && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Population:</span> {city.population.toLocaleString()}
            </p>
          )}
          {city.salesTaxRate && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Sales Tax Rate:</span> {city.salesTaxRate.toString()}%
            </p>
          )}
        </div>
        <div>
          {city.subreddit && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Subreddit:</span>{' '}
              <a
                href={`https://reddit.com/r/${city.subreddit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                r/{city.subreddit}
              </a>
            </p>
          )}
          {city.walkabilityScore && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Walkability Score:</span> {city.walkabilityScore}/100
            </p>
          )}
          {city.crimeRate && (
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">Crime Rate:</span> {city.crimeRate.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      {city.notes && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Notes:</h3>
          <p className="text-gray-600 dark:text-gray-300">{city.notes}</p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Neighborhoods</h3>
        {city.neighborhoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {city.neighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedNeighborhood(neighborhood)}
              >
                <h4 className="font-medium">{neighborhood.name}</h4>
                {neighborhood.population && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Population: {neighborhood.population.toLocaleString()}
                  </p>
                )}
                {neighborhood.walkabilityScore && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Walkability: {neighborhood.walkabilityScore}/100
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No neighborhoods found.</p>
        )}
      </div>

      {selectedNeighborhood && (
        <div className="mt-6">
          <button
            className="mb-4 text-blue-500 hover:text-blue-600"
            onClick={() => setSelectedNeighborhood(null)}
          >
            ← Back to city details
          </button>
          <NeighborhoodDetail
            neighborhood={{
              ...selectedNeighborhood,
              city: city
            }}
          />
        </div>
      )}
    </div>
  );
}
