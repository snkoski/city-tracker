import { useCallback, useEffect, useState } from 'react';
import { MonthlyWeatherList } from './MonthlyWeatherList';
import { MonthlyWeather } from '@prisma/client';
import { fetchCityMonthlyWeather } from '../../services/monthlyWeatherApiService';

type MonthlyWeatherManagerProps = {
  cityId: number;
};

export const MonthlyWeatherManager = ({ cityId }: MonthlyWeatherManagerProps) => {
  const [monthlyWeather, setMonthlyWeather] = useState<MonthlyWeather[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

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
  return (
    <div>
      <p>Monthly Weather Manager for {cityId}</p>
      <MonthlyWeatherList monthlyWeather={monthlyWeather} />
    </div>
  );
};
