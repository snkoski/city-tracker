import { useState, useEffect } from 'react';
import StateContainer from './components/StateContainer';
import { StateDetails } from './components/StateDetails';

import { State } from './types';

import './App.css';

function App() {
  // State to store the array of states fetched from the API
  const [states, setStates] = useState<State[]>([]);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors during fetching
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchStates = async () => {
      try {
        // Fetch data from the json-server endpoint for states
        // Make sure your json-server is running and accessible at this URL
        const response = await fetch('http://localhost:3000/states');

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStates(data); // Update the states state with the fetched data
      } catch (e) {
        // If an error occurs during fetch, update the error state
        // Check if 'e' is an instance of Error to safely access e.message
        if (e instanceof Error) {
          setError(e.message);
        } else {
          // Handle cases where 'e' might not be an Error object
          setError('An unknown error occurred');
        }
        console.error('Failed to fetch states:', e);
      } finally {
        // Whether successful or not, set loading to false
        setLoading(false);
      }
    };

    fetchStates(); // Call the function to fetch states
  }, []); // The empty dependency array [] means this effect runs only once after the initial render

  // Display a loading message while data is being fetched
  if (loading) {
    return (
      <div className="container">
        <p>Loading states...</p>
      </div>
    );
  }

  // Display an error message if fetching failed
  if (error) {
    return (
      <div className="container">
        <p>Error fetching states: {error}</p>
      </div>
    );
  }

  // Render the list of states once data is fetched
  return (
    <div className="App">
      <header className="App-header">
        <h1>United States Information</h1>
      </header>
      <main className="container">
        {states.length > 0 ? (
          states.map((state) => (
            // Use StateContainer for each state, ensuring a unique key
            <StateContainer key={state.id}>
              <StateDetails
                name={state.name}
                population={state.population}
                incomeTaxRate={state.incomeTaxRate}
              />
            </StateContainer>
          ))
        ) : (
          // Display a message if no states are found or the array is empty
          <p>No states found. Ensure your mock server is running and has data.</p>
        )}
      </main>
    </div>
  );
}

export default App;
