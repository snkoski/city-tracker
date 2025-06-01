import { EthnicDemographic } from '@prisma/client';
import { EthnicDemographicFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';

type EthnicDemographicsFormProps = {
  onSubmit: (data: EthnicDemographicFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: EthnicDemographic | null;
  isLoading: boolean;
  cityId: number;
};

export const EthnicDemographicsForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: EthnicDemographicsFormProps) => {
  const [group, setGroup] = useState<string>('');
  const [percent, setPercent] = useState<string>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setGroup(initialData.group || '');
      setPercent(initialData.percent || '');
    } else {
      setGroup('');
      setPercent('');
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('ethnic demographic form handle submit start');

    event.preventDefault();
    const formData: EthnicDemographicFormData = {
      cityId,
      group: group,
      percent: percent
    };
    console.log('ethnic demographic form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Ethnic Demographic' : 'New Ethnic Demographic'}</h3>
      <div>
        <label htmlFor="group">Group</label>
        <input
          type="text"
          name="group"
          id="group"
          disabled={isLoading}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
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
