import { City } from '@prisma/client';
import { FormEvent, useState } from 'react';

type CitySummary = Pick<City, 'name' | 'population' | 'salesTaxRate' | 'stateId'>;

type CitySummaryFormProps = {
  onSubmit: (data: CitySummary) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  stateId: number;
};

export const CitySummaryForm = ({
  onSubmit,
  onCancel,
  isLoading,
  stateId
}: CitySummaryFormProps) => {
  const [newCityInfo, setNewCityInfo] = useState<CitySummary>({
    stateId,
    name: '',
    population: null,
    salesTaxRate: null
  });

  const handleSubmit = async (event: FormEvent) => {
    console.log('new city form handle submit start');
    if (!newCityInfo.name) {
      alert('You better at least have a name for this place lol');
      return;
    }
    event.preventDefault();
    const formData: CitySummary = {
      stateId: stateId,
      name: newCityInfo.name,
      population: newCityInfo.population || null,
      salesTaxRate: newCityInfo.salesTaxRate || null
    };
    console.log('new city formData', formData);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New City</h3>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          disabled={isLoading}
          value={newCityInfo?.name}
          onChange={(e) =>
            setNewCityInfo((prevInfo) => {
              return { ...prevInfo, name: e.target.value };
            })
          }
        />
        <label htmlFor="population">Population</label>
        <input
          type="text"
          name="population"
          id="population"
          disabled={isLoading}
          value={Number(newCityInfo.population)}
          onChange={(e) =>
            setNewCityInfo((prevInfo) => {
              return { ...prevInfo, population: Number(e.target.value) };
            })
          }
        />
        <label htmlFor="salesTaxRate">Sales Tax Rate</label>
        <input
          type="text"
          name="salesTaxRate"
          id="salesTaxRate"
          disabled={isLoading}
          value={newCityInfo.salesTaxRate || ''}
          onChange={(e) =>
            setNewCityInfo((prevInfo) => {
              return { ...prevInfo, salesTaxRate: e.target.value };
            })
          }
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
