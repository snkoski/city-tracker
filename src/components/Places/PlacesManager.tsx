import { useCallback, useEffect, useState } from 'react';
import { PlacesForm } from './PlacesForm';
import { PlacesList } from './PlacesList';
import { Neighborhood, Place } from '@prisma/client';
import {
  createPlace,
  deletePlace,
  fetchCityPlaces,
  updatePlace
} from '../../services/placeApiService';
import { PlaceFormData } from '../../types';

type PlacesManagerProps = {
  cityId: number;
  neighborhoods: Neighborhood[];
};

export const PlacesManager = ({ cityId, neighborhoods }: PlacesManagerProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingPlaceId, setDeletingPlaceId] = useState<number | null>(null);

  const loadPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityPlaces(cityId);
      setPlaces(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadPlaces - an unknown error occured`);
      }
      console.error(`Failed to fetch Places: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const handleSubmit = async (data: PlaceFormData, id?: number) => {
    console.log('actual start of handle submit - data', data);

    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updatePlace(data, id);
        setPlaces((previousPlaces) =>
          previousPlaces.map((place) => (place.id === id ? updated : place))
        );
      } else {
        console.log('handle submit start');

        const created = await createPlace(data);
        setPlaces((previousPlaces) => [...previousPlaces, created]);
        console.log('handle submit after setPlaces');
      }
      setIsFormVisible(false);
      setEditingPlace(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the place. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeletePlace = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingPlaceId(id);
      setError(null);
      try {
        await deletePlace(id);
        setPlaces((previousPlaces) => previousPlaces.filter((place) => place.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting a place...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddPlaceClick = () => {
    setEditingPlace(null);
    setIsFormVisible(true);
  };

  const handleEditPlaceClick = (event: Place) => {
    setEditingPlace(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingPlace(null);
    setError(null);
  };

  if (isLoading && !places.length) return <p>Loading Places...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddPlaceClick}>
          Add new place
        </button>
      )}
      {isFormVisible && (
        <PlacesForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingPlace}
          cityId={cityId}
          neighborhoods={neighborhoods}
        />
      )}
      <PlacesList
        places={places}
        onEdit={handleEditPlaceClick}
        onDelete={handleDeletePlace}
        isLoadingDelete={deletingPlaceId}
      />
    </div>
  );
};
