import { AgeDemographic } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import {
  createAgeDemographic,
  deleteAgeDemographic,
  fetchCityAgeDemographics,
  updateAgeDemographic
} from '../../services/ageDemographicApiService';
import { AgeDemographicFormData } from '../../types';
import { AgeDemographicsForm } from './AgeDemographicsForm';
import { AgeDemographicsList } from './AgeDemographicsList';

type AgeDemographicsManagerProps = {
  cityId: number;
};

export const AgeDemographicsManager = ({ cityId }: AgeDemographicsManagerProps) => {
  const [ageDemographics, setAgeDemographics] = useState<AgeDemographic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingAgeDemographic, setEditingAgeDemographic] = useState<AgeDemographic | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingAgeDemographicId, setDeletingAgeDemographicId] = useState<number | null>(null);

  const loadAgeDemographics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityAgeDemographics(cityId);
      setAgeDemographics(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadAgeDemographics - an unknown error occured`);
      }
      console.error(`Failed to fetch AgeDemographics: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadAgeDemographics();
  }, [loadAgeDemographics]);

  const handleSubmit = async (data: AgeDemographicFormData, id?: number) => {
    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateAgeDemographic(data, id);
        setAgeDemographics((previousAgeDemographics) =>
          previousAgeDemographics.map((ageDemographic) =>
            ageDemographic.id === id ? updated : ageDemographic
          )
        );
      } else {
        console.log('handle submit start');

        const created = await createAgeDemographic(data);
        setAgeDemographics((previousAgeDemographics) => [...previousAgeDemographics, created]);
        console.log('handle submit after setAgeDemographics');
      }
      setIsFormVisible(false);
      setEditingAgeDemographic(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the ageDemographic. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteAgeDemographic = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingAgeDemographicId(id);
      setError(null);
      try {
        await deleteAgeDemographic(id);
        setAgeDemographics((previousAgeDemographics) =>
          previousAgeDemographics.filter((ageDemographic) => ageDemographic.id !== id)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting an ageDemographic...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddAgeDemographicClick = () => {
    setEditingAgeDemographic(null);
    setIsFormVisible(true);
  };

  const handleEditAgeDemographicClick = (event: AgeDemographic) => {
    setEditingAgeDemographic(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingAgeDemographic(null);
    setError(null);
  };

  if (isLoading && !ageDemographics.length) return <p>Loading Age Demographics...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddAgeDemographicClick}>
          Add new Age Demographic
        </button>
      )}
      {isFormVisible && (
        <AgeDemographicsForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingAgeDemographic}
          cityId={cityId}
        />
      )}
      <AgeDemographicsList
        ageDemographics={ageDemographics}
        onEdit={handleEditAgeDemographicClick}
        onDelete={handleDeleteAgeDemographic}
        isLoadingDelete={deletingAgeDemographicId}
      />
    </div>
  );
};
