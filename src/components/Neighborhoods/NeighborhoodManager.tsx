import { useState } from 'react';
import { NeighborhoodForm } from './NeighborhoodForm';
import { NeighborhoodList } from './NeighborhoodList';
import { Neighborhood } from '@prisma/client';
import { NeighborhoodFormData } from '../../types';
import {
  createNeighborhood,
  deleteNeighborhood,
  updateNeighborhood
} from '../../services/neighborhoodApiService';

type NeighborhoodManagerProps = {
  cityId: number;
  neighborhoods: Neighborhood[];
  setNeighborhoodsCallback: (newNeighborhoods: Neighborhood[]) => void;
};

export const NeighborhoodManager = ({
  cityId,
  neighborhoods,
  setNeighborhoodsCallback
}: NeighborhoodManagerProps) => {
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingNeighborhoodId, setDeletingNeighborhoodId] = useState<number | null>(null);

  const handleSubmit = async (data: NeighborhoodFormData, id?: number) => {
    console.log('actual start of handle NEIGHBORHOOD submit');

    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateNeighborhood(data, id);
        setNeighborhoodsCallback(
          neighborhoods.map((neighborhood) => (neighborhood.id === id ? updated : neighborhood))
        );
      } else {
        console.log('handle submit start');

        const created = await createNeighborhood(data);
        setNeighborhoodsCallback([...neighborhoods, created]);
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
        setNeighborhoodsCallback(neighborhoods.filter((neighborhood) => neighborhood.id !== id));
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

  if (neighborhoods == null) return <p>Loading Neighborhoods...</p>;

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
