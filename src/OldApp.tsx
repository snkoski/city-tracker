import CityForm from './components/Old/CityForm';
import CityList from './components/Old/CityList';
import CityDetail from './components/Old/CityDetail';
import './App.css';
import { useEffect, useState } from 'react';
import { City, State } from '@prisma/client';

function App() {
  const [darkMode, setColorMode] = useState(false);
  const [hotdogMode, setHotdogMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState<(City & { state: State }) | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('hotdog', hotdogMode);
  }, [hotdogMode]);

  return (
    <>
      <div className="menu-bar">
        <button className="p-8" onClick={() => setColorMode(!darkMode)}>
          Toggle {darkMode ? 'Light' : 'Dark'} Mode
        </button>
        <button className="m-12" onClick={() => setHotdogMode(!hotdogMode)}>
          Toggle {hotdogMode ? 'Be Boring' : 'Have Fun'}
        </button>
      </div>
      <div className="container mx-auto p-">
        <h1 className="text-3xl font-bold mb-4">City Tracker</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <CityForm
              onSubmit={(data) => {
                console.log('City created successfully:', data);
                // You can add success handling here (e.g., show a success message, refresh the list, etc.)
              }}
            />
            <CityList onCitySelect={setSelectedCity} />
          </div>
          <div>
            {selectedCity ? (
              <CityDetail city={selectedCity} />
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center mt-4">
                Select a city to view its details
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
