import { City, State } from '@prisma/client';
import { CitySummaryList } from './CitySummaryList';
import { useState } from 'react';
import { CitySummaryForm } from './CitySummaryForm';
import { CitySummaryFormData } from '../../../types';
import { createCity } from '../../../services/CityApiService';

type CitySummaryManagerProps = {
  cities: City[];
  state: State;
  onSelectCity: (city: City) => void;
};

export const CitySummaryManager = ({ cities, state, onSelectCity }: CitySummaryManagerProps) => {
  const [stateCities, setStateCities] = useState<City[]>(cities);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: move fetching cities into this component

  const handleSubmit = async (data: CitySummaryFormData) => {
    setError(null);
    try {
      const created = await createCity(data);
      setStateCities((prevCities) => {
        return [...prevCities, created];
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while creating the city. Oh no...`);
      }
    }
    setIsLoading(false);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
  };

  if (isLoading && !stateCities.length) return <p>Loading Cities...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={() => setIsFormVisible(true)}>
          Add New City
        </button>
      )}
      {isFormVisible && (
        <CitySummaryForm
          onCancel={handleCancelClick}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          stateId={state.id}
        />
      )}
      <CitySummaryList cities={stateCities} state={state} handleSelectCity={onSelectCity} />
    </div>
  );
};
