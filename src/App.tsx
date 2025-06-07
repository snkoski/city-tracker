import { useState, useEffect } from 'react';
import StateContainer from './components/StateContainer';
import { StateDetails } from './components/StateDetails';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { CityDetails } from './components/CityDetails';
import { City, State } from '@prisma/client';
import { CityFullDetails } from './types';
import { fetchCities, fetchFullCityDetails, fetchStates } from './services/apiService';
import { ResourceManager } from './components/Resources/ResourceManager';
import { CitySummaryManager } from './components/Cities/CitySummary/CitySummaryManager';

export const App = () => {
  const [currentView, setCurrentView] = useState<
    'stateList' | 'citiesList' | 'cityDetails' | 'resources'
  >('stateList');

  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityFullDetails | null>(null);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchStates();
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
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  const handleSelectState = async (state: State) => {
    setSelectedState(state);
    setCurrentView('citiesList');
    setLoadingCities(true);
    setError(null);
    setCities([]);
    try {
      const data = await fetchCities(state.id);
      setCities(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('In fetchCities - An unknown error occurred');
      }
      console.error('Failed to fetch Cities:', e);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSelectCity = async (city: City) => {
    setCurrentView('cityDetails');
    setLoadingCity(true);
    setError(null);
    try {
      const data = await fetchFullCityDetails(city.id);
      setSelectedCity(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('In fetchCityDetails - An unknown error occurred');
      }
      console.error(`Failed to fetch CityDetails: ${e}`);
    } finally {
      setLoadingCity(false);
    }
  };

  const handleShowResources = () => {
    setCurrentView('resources');
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
        if (loadingStates) {
          return <p>Loading states...</p>;
        }
        return (
          <main className="flex flex-row gap-2 max-w-dvw flex-wrap flex-1">
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
        if (loadingCities) return <p>Loading cities...</p>;
        if (!selectedState) return <p>something has gone wrong with the state you selected</p>;
        return (
          <div>
            <CitySummaryManager
              cities={cities}
              state={selectedState}
              onSelectCity={handleSelectCity}
            />
            <button type="button" onClick={handleBackToStates}>
              Back to states
            </button>
          </div>
        );

      case 'cityDetails':
        if (loadingCity) return <p>Loading city...</p>;
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

      case 'resources':
        return <ResourceManager />;

      default:
        return <div>something has gone wrong</div>;
    }
  };

  if (error) {
    return (
      <div className="container">
        <p>Error fetching one of them: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen min-w-fit items-center m-4">
      <Header
        onShowResources={handleShowResources}
        onShowStates={handleBackToStates}
        showResources={currentView === 'resources'}
      />
      {renderContent()}
      <Footer />
    </div>
  );
};
