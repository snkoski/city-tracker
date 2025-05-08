import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
}

interface City {
  id: number;
  name: string;
  stateId: number;
  population: number;
  posts: Post[];
  salesTaxRate: number;
  subreddit?: string;
  naturalDisasters?: string;
  crimeRate?: number;
  walkabilityScore?: number;
  notes?: string;
}

function DatabaseTest() {
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
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchCities();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!cities.length) return <div>Loading...</div>;

  return (
    <div>
      <h2>Cities</h2>
      <pre>{JSON.stringify(cities, null, 2)}</pre>
    </div>
  );
}

export default DatabaseTest;
