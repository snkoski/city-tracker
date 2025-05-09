import { useState, useEffect } from 'react';
import StateContainer from './components/StateContainer';
import { StateDetails } from './components/StateDetails';

import { City, State } from './types';

import './App.css';
// import { CityContainer } from './components/CityContainer';
import { CityDetails } from './components/CityDetails';

function App() {
  const [states, setStates] = useState<State[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [cityInfo, setCityInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        // Fetch data from the json-server endpoint for states
        const response = await fetch('http://localhost:3000/states');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStates(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          // Handle cases where 'e' might not be an Error object
          setError('An unknown error occurred');
        }
        console.error('Failed to fetch states:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        // Fetch data from the json-server endpoint for cities of a specific state
        const response = await fetch(`http://localhost:3000/cities?stateId=${selectedStateId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCities(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          // Handle cases where 'e' might not be an Error object
          setError('An unknown error occurred');
        }
        console.error('Failed to fetch states:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [selectedStateId]);

  useEffect(() => {
    const fetchCityInfo = async () => {
      try {
        // Fetch data from the json-server endpoint for cities of a specific state
        const response = await fetch(
          `http://localhost:3000/cities/101?_embed=places&_embed=events&_embed=neighborhoods&_embed=monthlyWeather&_embed=ageDemographics&_embed=ethnicDemographics&_embed=airports&_embed=allergenLevels`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCityInfo(data);
        console.log('CITY INFO DATA', data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          // Handle cases where 'e' might not be an Error object
          setError('An unknown error occurred');
        }
        console.error('Failed to fetch city inpfo:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCityInfo();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <p>Loading states...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <p>Error fetching states: {error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>City Tracker, i guess</h1>
      </header>
      {selectedStateId ? (
        <div>
          <div className="flex flex-row gap-2">
            {cities.map(({ name, population, salesTaxRate }) => (
              <StateContainer>
                <CityDetails
                  name={name}
                  population={population}
                  taxRate={salesTaxRate}
                  state={states.find((state) => state.id === selectedStateId)?.name ?? 'N/A'}
                />
              </StateContainer>
            ))}
          </div>
          <button type="button" onClick={() => setSelectedStateId(null)}>
            Back to states
          </button>
        </div>
      ) : (
        <main className="flex flex-row gap-2">
          {states.length > 0 ? (
            states.map((state) => (
              <StateContainer key={state.id}>
                <StateDetails
                  id={state.id}
                  name={state.name}
                  population={state.population}
                  incomeTaxRate={state.incomeTaxRate}
                  setSelectedStateId={setSelectedStateId}
                />
              </StateContainer>
            ))
          ) : (
            // Display a message if no states are found or the array is empty
            <p>No states found. Ensure your mock server is running and has data.</p>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
