import { useState, useEffect } from 'react';
import { City, State } from '@prisma/client';

interface CityListProps {
  onCitySelect: (city: City & { state: State }) => void;
}

export default function CityList({ onCitySelect }: CityListProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [cities, setCities] = useState<(City & { state: State })[]>([]);
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
    return <div className="">Error: {error}</div>;
  }

  return (
    <div className={`slideout ${isOpen ? 'open' : ''}`}>
      <h2 className="">Cities</h2>
      <button className="slideout-btn" type="button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '<' : '>'}
      </button>
      <div className="">
        {cities.map((city) => (
          <div key={city.id} className="">
            <h3 className="cursor-pointer hover:text-blue-500" onClick={() => onCitySelect(city)}>
              {city.name}
            </h3>
            <p className="">{city.state.name}</p>
            {city.population && <p className="">Population: {city.population.toLocaleString()}</p>}
            {city.notes && <p className="">{city.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
