import { MonthlyWeather } from '@prisma/client';
import { getLocalizedMonthName } from '../../utils/dateUtils';

type MonthlyWeatherListProps = {
  monthlyWeather: MonthlyWeather[];
  onEdit: (data: MonthlyWeather) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const MonthlyWeatherList = ({
  monthlyWeather,
  onEdit,
  onDelete,
  isLoadingDelete
}: MonthlyWeatherListProps) => {
  if (!monthlyWeather.length) {
    return <p>No weather added yet. Hope it's not too cold</p>;
  }
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {monthlyWeather.map((month) => {
        return (
          <div key={month.id} className="flex:">
            <div className="flex flex-col  border-amber-600 border-2 p-1 rounded-md">
              <p>{getLocalizedMonthName(month.month)}</p>
              <p>Temp: {month.avgTempF?.toString()}&deg; F</p>
              <p>High: {month.avgHighTempF?.toString()}&deg; F</p>
              <p>Low: {month.avgLowTempF?.toString()}&deg; F</p>
              <p>Rain Fall: {month.avgRainfallInch?.toString()}"</p>
              <p>Humidity: {month.humiditiy?.toString()}%</p>
              <button type="button" onClick={() => onEdit(month)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(month.id)}
                disabled={isLoadingDelete === month.id}
              >
                {isLoadingDelete === month.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
