import { useState, useEffect } from 'react';

interface City {
  id: number;
  name: string;
  country: string;
  state?: string;
  population?: number;
  area?: number;
  notes?: string;
}

export default function CityList() {
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cities');
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchCities();
  }, []);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cities</h2>
      <div className="space-y-4">
        {cities.map((city) => (
          <div
            key={city.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold">{city.name}</h3>
            <p className="text-gray-600">
              {city.country}
              {city.state && `, ${city.state}`}
            </p>
            {city.population && (
              <p className="text-sm text-gray-500">
                Population: {city.population.toLocaleString()}
              </p>
            )}
            {city.area && (
              <p className="text-sm text-gray-500">Area: {city.area.toLocaleString()} km²</p>
            )}
            {city.notes && <p className="mt-2 text-gray-700">{city.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
