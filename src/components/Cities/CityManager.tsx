import { useState } from 'react';
import { updateCity } from '../../services/CityApiService';
import { CityFormData, CityFullDetails } from '../../types';
import { CityInfo } from './CityInfo';

type CityManagerProps = {
  city: CityFullDetails;
};

export const CityManager = ({ city }: CityManagerProps) => {
  const [cityInfo, setCityInfo] = useState<CityFullDetails>(city);

  const onSubmit = async (data: CityFormData, id: number) => {
    console.log(data, id);
    try {
      const updated = await updateCity(data, id);
      setCityInfo(updated);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(`An unknown error occurred while updating the city`);
      }
    }
  };

  return <CityInfo city={cityInfo} onSubmit={onSubmit} />;
};
