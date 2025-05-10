import { useState, useEffect } from 'react';
import StateContainer from './components/StateContainer';
import { StateDetails } from './components/StateDetails';

import './App.css';
// import { CityContainer } from './components/CityContainer';
import { CitySummary } from './components/CitySummary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { CityDetails } from './components/CityDetails';
import { City, State } from '@prisma/client';

function App() {
  const [currentView, setCurrentView] = useState<'stateList' | 'citiesList' | 'cityDetails'>(
    'stateList'
  );

  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        // Fetch data from the json-server endpoint for states
        const response = await fetch('http://localhost:3000/states');

        if (!response.ok) {
          throw new Error(`In fetchStates - HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStates(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          // Handle cases where 'e' might not be an Error object
          setError('In fetchStates - An unknown error occurred');
        }
        console.error('Failed to fetch States:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleSelectState = async (state: State) => {
    setSelectedState(state);
    setCurrentView('citiesList');
    setLoading(true);
    setError(null);
    setCities([]);
    try {
      const response = await fetch(`http://localhost:3000/cities?stateId=${state?.id}`);
      if (!response.ok) {
        throw new Error(`In fetchCities - HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCities(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('In fetchCities - An unknown error occurred');
      }
      console.error('Failed to fetch Cities:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = async (city: City) => {
    setSelectedCity(city);
    setCurrentView('cityDetails');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/cities/${city.id}?_embed=places&_embed=events&_embed=neighborhoods&_embed=monthlyWeather&_embed=ageDemographics&_embed=ethnicDemographics&_embed=airports&_embed=allergenLevels`
      );
      if (!response.ok) {
        throw new Error(`in fetchCityDetails - HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedCity(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('In fetchCityDetails - An unknown error occurred');
      }
      console.error(`Failed to fetch CityDetails: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setCurrentView('stateList');
  };

  const handleBackToCities = () => {
    setCurrentView('citiesList');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'stateList':
        return (
          <main className="flex flex-row gap-2">
            {states.length > 0 ? (
              states.map((state) => (
                <StateContainer key={state.id}>
                  <StateDetails state={state} onSelectState={() => handleSelectState(state)} />
                </StateContainer>
              ))
            ) : (
              // Display a message if no states are found or the array is empty
              <p>No states found. Ensure your mock server is running and has data.</p>
            )}
          </main>
        );

      case 'citiesList':
        return (
          <div>
            <div className="flex flex-row gap-2">
              {cities.map((city) => (
                <StateContainer>
                  <CitySummary
                    city={city}
                    state={states.find((state) => state.id === selectedState?.id)?.name ?? 'N/A'}
                    onSelectCity={() => handleSelectCity(city)}
                  />
                </StateContainer>
              ))}
            </div>
            <button type="button" onClick={handleBackToStates}>
              Back to states
            </button>
          </div>
        );

      case 'cityDetails':
        return (
          <div>
            {selectedCity && <CityDetails city={selectedCity} />}
            <button type="button" onClick={handleBackToCities}>
              Back to Cities
            </button>
            <button type="button" onClick={handleBackToStates}>
              Back to States
            </button>
          </div>
        );

      default:
        return <div>something has gone wrong</div>;
    }
  };

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
        <p>Error fetching one of them: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen min-w-screen items-center">
      <Header />
      {renderContent()}
      <Footer />
    </div>
  );

  // <div className="App">
  //   <header className="App-header">
  //     <h1>City Tracker, i guess</h1>
  //   </header>
  //   {selectedStateId ? (
  //     <div>
  //       <div className="flex flex-row gap-2">
  //         {cities.map(({ name, population, salesTaxRate }) => (
  //           <StateContainer>
  //             <CityDetails
  //               name={name}
  //               population={population}
  //               taxRate={salesTaxRate}
  //               state={states.find((state) => state.id === selectedStateId)?.name ?? 'N/A'}
  //             />
  //           </StateContainer>
  //         ))}
  //       </div>
  //       <button type="button" onClick={() => setSelectedStateId(null)}>
  //         Back to states
  //       </button>
  //     </div>
  //   ) : (
  // <main className="flex flex-row gap-2">
  //   {states.length > 0 ? (
  //     states.map((state) => (
  //       <StateContainer key={state.id}>
  //         <StateDetails
  //           id={state.id}
  //           name={state.name}
  //           population={state.population}
  //           incomeTaxRate={state.incomeTaxRate}
  //           setSelectedStateId={setSelectedStateId}
  //         />
  //       </StateContainer>
  //     ))
  //   ) : (
  //     // Display a message if no states are found or the array is empty
  //     <p>No states found. Ensure your mock server is running and has data.</p>
  //   )}
  // </main>
  //   )}
  // </div>
}

export default App;
