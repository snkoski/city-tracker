import { City, State, Neighborhood } from '@prisma/client';
import { useState } from 'react';
import NeighborhoodDetail from '../NeighborhoodDetail';

interface CityDetailProps {
  city: City & {
    state: State;
    neighborhoods: Neighborhood[];
  };
}

export default function CityDetail({ city }: CityDetailProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);

  return (
    <div className="city-detail">
      <h2>{city.name}</h2>
      <div className="city-info">
        <div>
          <p>
            <span>State:</span> {city.state.name}
          </p>
          {city.population && (
            <p>
              <span>Population:</span> {city.population.toLocaleString()}
            </p>
          )}
          {city.salesTaxRate && (
            <p>
              <span>Sales Tax Rate:</span> {city.salesTaxRate.toString()}%
            </p>
          )}
        </div>
        <div>
          {city.subreddit && (
            <p>
              <span>Subreddit:</span>{' '}
              <a
                href={`https://reddit.com/r/${city.subreddit}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                r/{city.subreddit}
              </a>
            </p>
          )}
          {city.walkabilityScore && (
            <p>
              <span>Walkability Score:</span> {city.walkabilityScore}/100
            </p>
          )}
          {city.crimeRate && (
            <p>
              <span>Crime Rate:</span> {city.crimeRate.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      {city.notes && (
        <div className="notes">
          <h3>Notes:</h3>
          <p>{city.notes}</p>
        </div>
      )}

      <div className="neighborhoods">
        <h3>Neighborhoods</h3>
        {city.neighborhoods.length > 0 ? (
          <div className="neighborhood-grid">
            {city.neighborhoods.map((neighborhood) => (
              <div
                key={neighborhood.id}
                className="neighborhood-card"
                onClick={() => setSelectedNeighborhood(neighborhood)}
              >
                <h4>{neighborhood.name}</h4>
                {neighborhood.population && (
                  <p>Population: {neighborhood.population.toLocaleString()}</p>
                )}
                {neighborhood.walkabilityScore && (
                  <p>Walkability: {neighborhood.walkabilityScore}/100</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No neighborhoods found.</p>
        )}
      </div>

      {selectedNeighborhood && (
        <div className="neighborhood-detail">
          <button onClick={() => setSelectedNeighborhood(null)}>← Back to city details</button>
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
