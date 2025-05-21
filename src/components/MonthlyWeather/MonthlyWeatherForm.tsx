import { MonthlyWeather } from '@prisma/client';
import { MonthlyWeatherFormData } from '../../types';

type MonthlyWeatherFormProps = {
  onSubmit: (data: MonthlyWeatherFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: MonthlyWeather[] | null;
  isLoading: boolean;
  cityId: number;
};

export const MonthlyWeatherForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: MonthlyWeatherFormProps) => {
  const isEditMode = Boolean(initialData);

  const handleSubmit = () => {
    console.log('submitting weather data');
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Weather' : 'Add Weather'}</h3>
      <div></div>
    </form>
  );
};
