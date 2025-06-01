import { AgeDemographic } from '@prisma/client';
import { AgeDemographicFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';

type AgeDemographicsFormProps = {
  onSubmit: (data: AgeDemographicFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: AgeDemographic | null;
  isLoading: boolean;
  cityId: number;
};

export const AgeDemographicsForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: AgeDemographicsFormProps) => {
  const [ageRange, setAgeRange] = useState<string>('');
  const [percent, setPercent] = useState<string>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setAgeRange(initialData.ageRange || '');
      setPercent(initialData.percent || '');
    } else {
      setAgeRange('');
      setPercent('');
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('age demographic form handle submit start');

    event.preventDefault();
    const formData: AgeDemographicFormData = {
      cityId,
      ageRange: ageRange,
      percent: percent
    };
    console.log('age demographic form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Event' : 'New Event'}</h3>
      <div>
        <label htmlFor="ageRange">Age Range</label>
        <input
          type="text"
          name="ageRange"
          id="ageRange"
          disabled={isLoading}
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="percent">Percent</label>
        <input
          type="percent"
          name="percent"
          id="percent"
          disabled={isLoading}
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
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
