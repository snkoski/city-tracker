import { useState } from 'react';
import { PlacesForm } from './PlacesForm';
import { PlacesList } from './PlacesList';
import { Neighborhood, Place } from '@prisma/client';
import { createPlace, deletePlace, updatePlace } from '../../services/placeApiService';
import { PlaceFormData } from '../../types';

type PlacesManagerProps = {
  cityId: number;
  places: Place[];
  neighborhoods: Neighborhood[];
  setPlacesCallback: (newPlaces: Place[]) => void;
};

export const PlacesManager = ({
  cityId,
  places,
  neighborhoods,
  setPlacesCallback
}: PlacesManagerProps) => {
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingPlaceId, setDeletingPlaceId] = useState<number | null>(null);

  const handleSubmit = async (data: PlaceFormData, id?: number) => {
    console.log('actual start of handle submit - data', data);

    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updatePlace(data, id);
        const newPlacesArray = places.map((place) => (place.id === id ? updated : place));
        setPlacesCallback(newPlacesArray);
      } else {
        console.log('handle submit start');

        const created = await createPlace(data);
        setPlacesCallback([...places, created]);
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
        setPlacesCallback(places.filter((place) => place.id !== id));
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

  if (places == null) return <p>Loading Places...</p>;

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
        neighborhoods={neighborhoods}
        onEdit={handleEditPlaceClick}
        onDelete={handleDeletePlace}
        isLoadingDelete={deletingPlaceId}
      />
    </div>
  );
};
