import { useState, useEffect } from 'react';
import { State } from '@prisma/client';

interface CityFormProps {
  onSubmit: (data: {
    name: string;
    stateId: number;
    population?: number;
    salesTaxRate?: number;
  }) => void;
}

export default function CityForm({ onSubmit }: CityFormProps) {
  const [states, setStates] = useState<State[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    stateId: '',
    population: '',
    salesTaxRate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/states');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        const data = await response.json();
        setStates(data);
      } catch (err) {
        setError(`Failed to load states: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      name: formData.name,
      stateId: parseInt(formData.stateId),
      ...(formData.population && { population: parseInt(formData.population) }),
      ...(formData.salesTaxRate && { salesTaxRate: parseFloat(formData.salesTaxRate) })
    };

    try {
      const response = await fetch('http://localhost:3000/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create city');
      }

      const data = await response.json();
      onSubmit(data);

      // Reset form
      setFormData({
        name: '',
        stateId: '',
        population: '',
        salesTaxRate: ''
      });
    } catch (err) {
      setError(`Error creating city: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) return <div>Loading states...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          City Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State *
        </label>
        <select
          id="state"
          required
          value={formData.stateId}
          onChange={(e) => setFormData({ ...formData, stateId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="population" className="block text-sm font-medium text-gray-700">
          Population (optional)
        </label>
        <input
          type="number"
          id="population"
          value={formData.population}
          onChange={(e) => setFormData({ ...formData, population: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="salesTaxRate" className="block text-sm font-medium text-gray-700">
          Sales Tax Rate (optional)
        </label>
        <input
          type="number"
          id="salesTaxRate"
          step="0.001"
          value={formData.salesTaxRate}
          onChange={(e) => setFormData({ ...formData, salesTaxRate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add City
      </button>
    </form>
  );
}
