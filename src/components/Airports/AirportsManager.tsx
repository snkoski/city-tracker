import { Airport } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { AirportFormData } from '../../types';
import { AirportsForm } from './AirportsForm';
import { AirportsList } from './AirportsList';
import {
  createAirport,
  deleteAirport,
  fetchCityAirports,
  updateAirport
} from '../../services/airportApiService';

type AirportsManagerProps = {
  cityId: number;
};

export const AirportsManager = ({ cityId }: AirportsManagerProps) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingAirportId, setDeletingAirportId] = useState<number | null>(null);

  const loadAirports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityAirports(cityId);
      setAirports(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadAirports - an unknown error occured`);
      }
      console.error(`Failed to fetch Airports: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadAirports();
  }, [loadAirports]);

  const handleSubmit = async (data: AirportFormData, id?: number) => {
    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateAirport(data, id);
        setAirports((previousAirports) =>
          previousAirports.map((airport) => (airport.id === id ? updated : airport))
        );
      } else {
        console.log('handle submit start');

        const created = await createAirport(data);
        setAirports((previousAirports) => [...previousAirports, created]);
        console.log('handle submit after setAirports');
      }
      setIsFormVisible(false);
      setEditingAirport(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the Airport. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteAirport = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingAirportId(id);
      setError(null);
      try {
        await deleteAirport(id);
        setAirports((previousAirports) => previousAirports.filter((airport) => airport.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting an airport...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddAirportClick = () => {
    setEditingAirport(null);
    setIsFormVisible(true);
  };

  const handleEditAirportClick = (event: Airport) => {
    setEditingAirport(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingAirport(null);
    setError(null);
  };

  if (isLoading && !airports.length) return <p>Loading Airports...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddAirportClick}>
          Add new Airport
        </button>
      )}
      {isFormVisible && (
        <AirportsForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingAirport}
          cityId={cityId}
        />
      )}
      <AirportsList
        airports={airports}
        onEdit={handleEditAirportClick}
        onDelete={handleDeleteAirport}
        isLoadingDelete={deletingAirportId}
      />
    </div>
  );
};
