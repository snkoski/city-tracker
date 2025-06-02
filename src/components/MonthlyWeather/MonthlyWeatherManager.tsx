import { useCallback, useEffect, useState } from 'react';
import { MonthlyWeatherList } from './MonthlyWeatherList';
import { MonthlyWeather } from '@prisma/client';
import {
  createMonthlyWeather,
  deleteMonthlyWeather,
  fetchCityMonthlyWeather,
  updateMonthlyWeather
} from '../../services/monthlyWeatherApiService';
import { MonthlyWeatherFormData } from '../../types';
import { MonthlyWeatherForm } from './MonthlyWeatherForm';

type MonthlyWeatherManagerProps = {
  cityId: number;
};

export const MonthlyWeatherManager = ({ cityId }: MonthlyWeatherManagerProps) => {
  const [monthlyWeather, setMonthlyWeather] = useState<MonthlyWeather[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingMonthlyWeather, setEditingMonthlyWeather] = useState<MonthlyWeather | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingMonthlyWeatherId, setDeletingMonthlyWeatherId] = useState<number | null>(null);

  const LoadMonthlyWeather = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityMonthlyWeather(cityId);
      setMonthlyWeather(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadMonthlyWeather - an unknown error occured`);
      }
      console.error(`Failed to fetch MonthlyWeather: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    LoadMonthlyWeather();
  }, [LoadMonthlyWeather]);

  const handleSubmit = async (data: MonthlyWeatherFormData, id?: number) => {
    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateMonthlyWeather(data, id);
        setMonthlyWeather((previousMonthlyWeather) =>
          previousMonthlyWeather.map((monthlyWeather) =>
            monthlyWeather.id === id ? updated : monthlyWeather
          )
        );
      } else {
        console.log('handle submit start');

        const created = await createMonthlyWeather(data);
        setMonthlyWeather((previousMonthlyWeather) => [...previousMonthlyWeather, created]);
        console.log('handle submit after setMonthlyWeather');
      }
      setIsFormVisible(false);
      setEditingMonthlyWeather(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the Monthly Weather. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteMonthlyWeather = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingMonthlyWeatherId(id);
      setError(null);
      try {
        await deleteMonthlyWeather(id);
        setMonthlyWeather((previousMonthlyWeather) =>
          previousMonthlyWeather.filter((monthlyWeather) => monthlyWeather.id !== id)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting Monthly Weather...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddMonthlyWeatherClick = () => {
    setEditingMonthlyWeather(null);
    setIsFormVisible(true);
  };

  const handleEditMonthlyWeatherClick = (event: MonthlyWeather) => {
    setEditingMonthlyWeather(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingMonthlyWeather(null);
    setError(null);
  };

  if (isLoading && !monthlyWeather.length) return <p>Loading Monthly Weather...</p>;

  return (
    <div className="flex flex-wrap w-full">
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddMonthlyWeatherClick}>
          Add Weather
        </button>
      )}
      {isFormVisible && (
        <MonthlyWeatherForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingMonthlyWeather}
          cityId={cityId}
        />
      )}
      <MonthlyWeatherList
        monthlyWeather={monthlyWeather}
        onEdit={handleEditMonthlyWeatherClick}
        onDelete={handleDeleteMonthlyWeather}
        isLoadingDelete={deletingMonthlyWeatherId}
      />
    </div>
  );
};
