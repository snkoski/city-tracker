import { Neighborhood, City } from '@prisma/client';

interface NeighborhoodDetailProps {
  neighborhood: Neighborhood & {
    city: City;
  };
}

export default function NeighborhoodDetail({ neighborhood }: NeighborhoodDetailProps) {
  return (
    <div className="neighborhood-detail">
      <h2>{neighborhood.name}</h2>
      <div className="neighborhood-info">
        <div>
          <p>
            <span>City:</span> {neighborhood.city.name}
          </p>
          {neighborhood.population && (
            <p>
              <span>Population:</span> {neighborhood.population.toLocaleString()}
            </p>
          )}
          {neighborhood.area && (
            <p>
              <span>Area:</span> {neighborhood.area.toFixed(2)} km²
            </p>
          )}
        </div>
        <div>
          {neighborhood.walkabilityScore && (
            <p>
              <span>Walkability Score:</span> {neighborhood.walkabilityScore}/100
            </p>
          )}
          <p>
            <span>Created:</span> {new Date(neighborhood.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {neighborhood.description && (
        <div className="description">
          <h3>Description:</h3>
          <p>{neighborhood.description}</p>
        </div>
      )}
    </div>
  );
}
