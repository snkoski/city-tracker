import { useCallback, useEffect, useState } from 'react';
import { NeighborhoodForm } from './NeighborhoodForm';
import { NeighborhoodList } from './NeighborhoodList';
import { Neighborhood } from '@prisma/client';
import { NeighborhoodFormData } from '../../types';
import {
  createNeighborhood,
  deleteNeighborhood,
  fetchCityNeighborhoods,
  updateNeighborhood
} from '../../services/neighborhoodApiService';

type NeighborhoodManagerProps = {
  cityId: number;
};

export const NeighborhoodManager = ({ cityId }: NeighborhoodManagerProps) => {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingNeighborhoodId, setDeletingNeighborhoodId] = useState<number | null>(null);

  const loadNeighborhoods = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityNeighborhoods(cityId);
      setNeighborhoods(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadNeighborhoods - an unknown error occured`);
      }
      console.error(`Failed to fetch Neighborhoods: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadNeighborhoods();
  }, [loadNeighborhoods]);

  const handleSubmit = async (data: NeighborhoodFormData, id?: number) => {
    console.log('actual start of handle NEIGHBORHOOD submit');

    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateNeighborhood(data, id);
        setNeighborhoods((previousNeighborhoods) =>
          previousNeighborhoods.map((neighborhood) =>
            neighborhood.id === id ? updated : neighborhood
          )
        );
      } else {
        console.log('handle submit start');

        const created = await createNeighborhood(data);
        setNeighborhoods((previousNeighborhoods) => [...previousNeighborhoods, created]);
        console.log('handle submit after setNeighborhoods');
      }
      setIsFormVisible(false);
      setEditingNeighborhood(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the neighborhood. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteNeighborhood = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingNeighborhoodId(id);
      setError(null);
      try {
        await deleteNeighborhood(id);
        setNeighborhoods((previousNeighborhoods) =>
          previousNeighborhoods.filter((neighborhood) => neighborhood.id !== id)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting an neighborhood...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddNeighborhoodClick = () => {
    setEditingNeighborhood(null);
    setIsFormVisible(true);
  };

  const handleEditNeighborhoodClick = (event: Neighborhood) => {
    setEditingNeighborhood(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingNeighborhood(null);
    setError(null);
  };

  if (isLoading && !neighborhoods.length) return <p>Loading Neighborhoods...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddNeighborhoodClick}>
          Add new neighborhood
        </button>
      )}
      {isFormVisible && (
        <NeighborhoodForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingNeighborhood}
          cityId={cityId}
        />
      )}
      <NeighborhoodList
        neighborhoods={neighborhoods}
        onEdit={handleEditNeighborhoodClick}
        onDelete={handleDeleteNeighborhood}
        isLoadingDelete={deletingNeighborhoodId}
      />
    </div>
  );
};
