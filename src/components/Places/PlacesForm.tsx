import { FormEvent, useEffect, useState } from 'react';
import { PlaceFormData } from '../../types';
import { Place, PlaceType } from '@prisma/client';

type PlacesFormProps = {
  onSubmit: (data: PlaceFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: Place | null;
  isLoading: boolean;
  cityId: number;
};

export const PlacesForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: PlacesFormProps) => {
  const [name, setName] = useState<string>('');
  const [website, setWebsite] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [type, setType] = useState<PlaceType>();
  const [neighborhoodId, setNeighborhoodId] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setWebsite(initialData.website || null);
      setDescription(initialData.description || null);
      setType(initialData.type);
      setNeighborhoodId(initialData.neighborhoodId);
      setAddress(initialData.address);
    } else {
      setName('');
      setWebsite(null);
      setDescription(null);
      setType(PlaceType.NOT_CATAGORIZED);
      setNeighborhoodId(null);
      setAddress('');
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('place form handle submit start');

    event.preventDefault();
    if (!name || !type || !address) {
      alert('name type and address are important I think?.?.?.');
      return;
    }
    console.log(`Address: ${address}`);

    const formData: PlaceFormData = {
      name,
      cityId,
      website: website || null,
      description: description || null,
      type,
      neighborhoodId: neighborhoodId || null,
      address
    };
    console.log('place form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Event' : 'New Event'}</h3>
      <div>
        <label htmlFor="name"></label>
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
        <label htmlFor="neighborhoodId">neighborhoodId</label>
        <input
          type="number"
          name="neighborhoodId"
          id="neighborhoodId"
          disabled={isLoading}
          value={neighborhoodId || ''}
          onChange={(e) => setNeighborhoodId(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          disabled={isLoading}
          value={address}
          onChange={(e) => setAddress(e.target.value.toString())}
        />
      </div>
      Address: {address}
      <div>
        <label htmlFor="type">Type</label>
        <select
          name="type"
          id="type"
          disabled={isLoading}
          value={type}
          onChange={(e) => setType(e.target.value as PlaceType)}
        >
          {Object.values(PlaceType).map((typeValue) => (
            <option key={typeValue} value={typeValue}>
              {typeValue}
            </option>
          ))}
        </select>
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
