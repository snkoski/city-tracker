import { AllergenLevel } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

import { AllergenLevelFormData } from '../../types';
import { AllergenLevelsList } from './AllergenLevelsList';
import { AllergenLevelsForm } from './AllergenLevelsForm';
import {
  createAllergenLevel,
  deleteAllergenLevel,
  fetchCityAllergenLevels,
  updateAllergenLevel
} from '../../services/allergenLevelApiService';

type AllergenLevelsManagerProps = {
  cityId: number;
};

export const AllergenLevelsManager = ({ cityId }: AllergenLevelsManagerProps) => {
  const [allergenLevels, setAllergenLevels] = useState<AllergenLevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingAllergenLevel, setEditingAllergenLevel] = useState<AllergenLevel | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingAllergenLevelId, setDeletingAllergenLevelId] = useState<number | null>(null);

  const loadAllergenLevels = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityAllergenLevels(cityId);
      setAllergenLevels(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadAllergenLevels - an unknown error occured`);
      }
      console.error(`Failed to fetch AllergenLevels: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadAllergenLevels();
  }, [loadAllergenLevels]);

  const handleSubmit = async (data: AllergenLevelFormData, id?: number) => {
    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateAllergenLevel(data, id);
        setAllergenLevels((previousAllergenLevels) =>
          previousAllergenLevels.map((allergenLevel) =>
            allergenLevel.id === id ? updated : allergenLevel
          )
        );
      } else {
        console.log('handle submit start');

        const created = await createAllergenLevel(data);
        setAllergenLevels((previousAllergenLevels) => [...previousAllergenLevels, created]);
        console.log('handle submit after setAllergenLevels');
      }
      setIsFormVisible(false);
      setEditingAllergenLevel(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the AllergenLevel. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteAllergenLevel = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingAllergenLevelId(id);
      setError(null);
      try {
        await deleteAllergenLevel(id);
        setAllergenLevels((previousAllergenLevels) =>
          previousAllergenLevels.filter((allergenLevel) => allergenLevel.id !== id)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting an allergenLevel...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddAllergenLevelClick = () => {
    setEditingAllergenLevel(null);
    setIsFormVisible(true);
  };

  const handleEditAllergenLevelClick = (event: AllergenLevel) => {
    setEditingAllergenLevel(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingAllergenLevel(null);
    setError(null);
  };

  if (isLoading && !allergenLevels.length) return <p>Loading Allergen Levels...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddAllergenLevelClick}>
          Add new Allergen Level
        </button>
      )}
      {isFormVisible && (
        <AllergenLevelsForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingAllergenLevel}
          cityId={cityId}
        />
      )}
      <AllergenLevelsList
        allergenLevels={allergenLevels}
        onEdit={handleEditAllergenLevelClick}
        onDelete={handleDeleteAllergenLevel}
        isLoadingDelete={deletingAllergenLevelId}
      />
    </div>
  );
};
