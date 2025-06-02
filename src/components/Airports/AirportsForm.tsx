import { Airport } from '@prisma/client';
import { AirportFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';

type AirportsFormProps = {
  onSubmit: (data: AirportFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: Airport | null;
  isLoading: boolean;
  cityId: number;
};

export const AirportsForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: AirportsFormProps) => {
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string | null>('');
  const [isInternational, setIsInternational] = useState<boolean | null>(null);
  const [travelTimeMinutes, setTravelTimeMinutes] = useState<number | null>(null);
  const [distanceMiles, setDistanceMiles] = useState<number | null>(null);
  const [transitOptions, setTransitOptions] = useState<string | null>('');
  const [website, setWebsite] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCode(initialData.code || '');
      setIsInternational(initialData.isInternational || null);
      setTravelTimeMinutes(initialData.travelTimeMinutes || null);
      setDistanceMiles(initialData.distanceMiles || null);
      setTransitOptions(initialData.transitOptions || null);
      setWebsite(initialData.website || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCode(null);
      setIsInternational(null);
      setTravelTimeMinutes(null);
      setDistanceMiles(null);
      setTransitOptions(null);
      setWebsite('');
      setDescription('');
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('airport form handle submit start');
    if (!name || !code || isInternational == null) {
      alert('Do some actual research before trying to add some data!');
      return;
    }
    event.preventDefault();
    const formData: AirportFormData = {
      cityId,

      name: name,
      code: code,
      isInternational: isInternational,
      travelTimeMinutes: travelTimeMinutes,
      distanceMiles: distanceMiles,
      transitOptions: transitOptions,
      website: website,
      description: description
    };
    console.log('airport form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Airport' : 'New Airport'}</h3>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          disabled={isLoading}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="code">Code</label>
        <input
          type="text"
          name="code"
          id="code"
          disabled={isLoading}
          value={code || ''}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="isInternational">International</label>
        <input
          type="checkbox"
          name="isInternational"
          id="isInternational"
          disabled={isLoading}
          checked={isInternational === true}
          onChange={(e) => setIsInternational(e.target.checked)}
        />
      </div>
      <div>
        <label htmlFor="travelTimeMinutes">Travel Time in Minutes (avg?)</label>
        <input
          type="number"
          name="travelTimeMinutes"
          id="travelTimeMinutes"
          disabled={isLoading}
          value={travelTimeMinutes || 0}
          onChange={(e) => setTravelTimeMinutes(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="distanceMiles">Distance (miles)</label>
        <input
          type="number"
          name="distanceMiles"
          id="distanceMiles"
          disabled={isLoading}
          value={distanceMiles || 0}
          onChange={(e) => setDistanceMiles(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="transitOptions">Transit Options</label>
        <input
          type="text"
          name="transitOptions"
          id="transitOptions"
          disabled={isLoading}
          value={transitOptions || ''}
          onChange={(e) => setTransitOptions(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input
          type="text"
          name="website"
          id="website"
          disabled={isLoading}
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          disabled={isLoading}
          value={description || ''}
          onChange={(e) => setDescription(e.target.value)}
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
