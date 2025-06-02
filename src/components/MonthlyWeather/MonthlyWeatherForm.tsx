import { MonthlyWeather } from '@prisma/client';
import { MonthlyWeatherFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';

type MonthlyWeatherFormProps = {
  onSubmit: (data: MonthlyWeatherFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: MonthlyWeather | null;
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
  const [month, setMonth] = useState<number>();
  const [avgHighTempF, setAvgHighTempF] = useState<string | null>('');
  const [avgLowTempF, setAvgLowTempF] = useState<string | null>('');
  const [avgTempF, setAvgTempF] = useState<string | null>('');
  const [avgRainfallInch, setAvgRainfallInch] = useState<string | null>('');
  const [humiditiy, setHumiditiy] = useState<string | null>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setMonth(initialData.month);
      setAvgHighTempF(initialData.avgHighTempF || '');
      setAvgLowTempF(initialData.avgLowTempF || '');
      setAvgTempF(initialData.avgTempF || '');
      setAvgRainfallInch(initialData.avgRainfallInch || '');
      setHumiditiy(initialData.humiditiy || '');
    } else {
      setMonth(0);
      setAvgHighTempF(null);
      setAvgLowTempF(null);
      setAvgTempF(null);
      setAvgRainfallInch(null);
      setHumiditiy(null);
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('monthly weather form handle submit start');
    if (!month) {
      alert('At least need a month!');
      return;
    }
    event.preventDefault();
    const formData: MonthlyWeatherFormData = {
      cityId,
      month,
      avgHighTempF: avgHighTempF || null,
      avgLowTempF: avgLowTempF || null,
      avgTempF: avgTempF || null,
      avgRainfallInch: avgRainfallInch || null,
      humiditiy: humiditiy || null
    };
    console.log('monthly weather form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Airport' : 'New Airport'}</h3>
      <div>
        <label htmlFor="month">Mo</label>
        <input
          type="number"
          name="month"
          id="month"
          disabled={isLoading}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="avgHighTempF">Avg High Temp</label>
        <input
          type="text"
          name="avgHighTempF"
          id="avgHighTempF"
          disabled={isLoading}
          value={avgHighTempF || ''}
          onChange={(e) => setAvgHighTempF(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="avgLowTempF">Avg Low Temp</label>
        <input
          type="text"
          name="avgLowTempF"
          id="avgLowTempF"
          disabled={isLoading}
          value={avgLowTempF || ''}
          onChange={(e) => setAvgLowTempF(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="avgTempF">avgTempF</label>
        <input
          type="text"
          name="avgTempF"
          id="avgTempF"
          disabled={isLoading}
          value={avgTempF || 0}
          onChange={(e) => setAvgTempF(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="avgRainfallInch">avgRainfallInch</label>
        <input
          type="text"
          name="avgRainfallInch"
          id="avgRainfallInch"
          disabled={isLoading}
          value={avgRainfallInch || ''}
          onChange={(e) => setAvgRainfallInch(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="humiditiy">Humidity</label>
        <input
          type="text"
          name="humiditiy"
          id="humiditiy"
          disabled={isLoading}
          value={humiditiy || ''}
          onChange={(e) => setHumiditiy(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  );
};
