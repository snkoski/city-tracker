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
  const [currentView, setCurrentView] = useState<'stateList' | 'cityList' | 'cityDetails'>(
    'stateList'
  );

  const [states, setStates] = useState<State[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number>(101);
  const [cityDetails, setCityDetails] = useState<City | null>(null);
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
    const fetchCityDetails = async () => {
      try {
        // Fetch data from the json-server endpoint for cities of a specific state
        const response = await fetch(
          `http://localhost:3000/cities/${selectedCityId}?_embed=places&_embed=events&_embed=neighborhoods&_embed=monthlyWeather&_embed=ageDemographics&_embed=ethnicDemographics&_embed=airports&_embed=allergenLevels`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCityDetails(data);
        console.log('CITY Details DATA', data);
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

    fetchCityDetails();
  }, [selectedCityId]);

  const handleSelectState = (stateId: number) => {
    setSelectedStateId(stateId);
    setCurrentView('cityList');
  };

  const handleBackToStates = () => {
    setSelectedStateId(null);
    setCurrentView('stateList');
  };

  const handleBackToCities = () => {
    setCurrentView('cityList');
  };

  const handleSelectCity = (cityId: number) => {
    setSelectedCityId(cityId);
    setCurrentView('cityDetails');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'stateList':
        return (
          <main className="flex flex-row gap-2">
            {states.length > 0 ? (
              states.map((state) => (
                <StateContainer key={state.id}>
                  <StateDetails state={state} onSelectState={() => handleSelectState(state.id)} />
                </StateContainer>
              ))
            ) : (
              // Display a message if no states are found or the array is empty
              <p>No states found. Ensure your mock server is running and has data.</p>
            )}
          </main>
        );

      case 'cityList':
        return (
          <div>
            <div className="flex flex-row gap-2">
              {cities.map((city) => (
                <StateContainer>
                  <CitySummary
                    city={city}
                    state={states.find((state) => state.id === selectedStateId)?.name ?? 'N/A'}
                    onSelectCity={() => handleSelectCity(city.id)}
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
            <CityDetails name={cityDetails?.name ?? 'N/A'} id={selectedCityId} />
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
