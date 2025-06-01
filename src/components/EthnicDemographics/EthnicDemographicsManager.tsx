import { EthnicDemographic } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';
import { EthnicDemographicFormData } from '../../types';
import {
  createEthnicDemographic,
  deleteEthnicDemographic,
  fetchCityEthnicDemographics,
  updateEthnicDemographic
} from '../../services/ethnicDemographicApiService';
import { EthnicDemographicsForm } from './EthnicDemographicsForm';
import { EthnicDemographicsList } from './EthnicDemographicsList';

type EthnicDemographicsManagerProps = {
  cityId: number;
};

export const EthnicDemographicsManager = ({ cityId }: EthnicDemographicsManagerProps) => {
  const [ethnicDemographics, setEthnicDemographics] = useState<EthnicDemographic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingEthnicDemographic, setEditingEthnicDemographic] =
    useState<EthnicDemographic | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingEthnicDemographicId, setDeletingEthnicDemographicId] = useState<number | null>(
    null
  );

  const loadEthnicDemographics = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityEthnicDemographics(cityId);
      setEthnicDemographics(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadEthnicDemographics - an unknown error occured`);
      }
      console.error(`Failed to fetch EthnicDemographics: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadEthnicDemographics();
  }, [loadEthnicDemographics]);

  const handleSubmit = async (data: EthnicDemographicFormData, id?: number) => {
    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateEthnicDemographic(data, id);
        setEthnicDemographics((previousEthnicDemographics) =>
          previousEthnicDemographics.map((ethnicDemographic) =>
            ethnicDemographic.id === id ? updated : ethnicDemographic
          )
        );
      } else {
        console.log('handle submit start');

        const created = await createEthnicDemographic(data);
        setEthnicDemographics((previousEthnicDemographics) => [
          ...previousEthnicDemographics,
          created
        ]);
        console.log('handle submit after setEthnicDemographics');
      }
      setIsFormVisible(false);
      setEditingEthnicDemographic(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          `An unknown error occurred while saving the ethnicDemographic. WTF did you do?!?!?`
        );
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteEthnicDemographic = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingEthnicDemographicId(id);
      setError(null);
      try {
        await deleteEthnicDemographic(id);
        setEthnicDemographics((previousEthnicDemographics) =>
          previousEthnicDemographics.filter((ethnicDemographic) => ethnicDemographic.id !== id)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting an ethnicDemographic...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddEthnicDemographicClick = () => {
    setEditingEthnicDemographic(null);
    setIsFormVisible(true);
  };

  const handleEditEthnicDemographicClick = (event: EthnicDemographic) => {
    setEditingEthnicDemographic(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingEthnicDemographic(null);
    setError(null);
  };

  if (isLoading && !ethnicDemographics.length) return <p>Loading Ethnic Demographics...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddEthnicDemographicClick}>
          Add new Ethnic Demographic
        </button>
      )}
      {isFormVisible && (
        <EthnicDemographicsForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingEthnicDemographic}
          cityId={cityId}
        />
      )}
      <EthnicDemographicsList
        ethnicDemographics={ethnicDemographics}
        onEdit={handleEditEthnicDemographicClick}
        onDelete={handleDeleteEthnicDemographic}
        isLoadingDelete={deletingEthnicDemographicId}
      />
    </div>
  );
};
