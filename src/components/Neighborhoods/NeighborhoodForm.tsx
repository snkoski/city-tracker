import { Neighborhood } from '@prisma/client';
import { NeighborhoodFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';

type NeighborhoodFormProps = {
  onSubmit: (data: NeighborhoodFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: Neighborhood | null;
  isLoading: boolean;
  cityId: number;
};

export const NeighborhoodForm = ({
  onCancel,
  onSubmit,
  initialData,
  isLoading,
  cityId
}: NeighborhoodFormProps) => {
  const [name, setName] = useState<string>('');
  const [population, setPopulation] = useState<number | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [walkabilityScore, setWalkabilityScore] = useState<number | null>(null);
  const [bikeScore, setBikeScore] = useState<number | null>(null);
  const [transitScore, setTransitScore] = useState<number | null>(null);
  const [schoolRating, setSchoolRating] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPopulation(initialData.population);
      setArea(initialData.area);
      setDescription(initialData.description || '');
      setWalkabilityScore(initialData.walkabilityScore);
      setBikeScore(initialData.bikeScore);
      setTransitScore(initialData.transitScore);
      setSchoolRating(initialData.schoolRating);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setPopulation(null);
      setArea(null);
      setDescription('');
      setWalkabilityScore(null);
      setBikeScore(null);
      setTransitScore(null);
      setSchoolRating(null);
      setNotes('');
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('neighborhood form handle submit start');

    event.preventDefault();
    if (!name) {
      alert('The should have a name bro...');
      return;
    }

    const formData: NeighborhoodFormData = {
      name,
      cityId,
      population,
      area,
      description,
      walkabilityScore: walkabilityScore || null,
      bikeScore: bikeScore || null,
      transitScore: transitScore || null,
      schoolRating: schoolRating || null,
      notes
    };

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Edit Neighborhood' : 'Add Neighborhood'}</h2>
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
        <label htmlFor="population">Population</label>
        <input
          type="number"
          name="population"
          id="population"
          disabled={isLoading}
          value={population || 0}
          onChange={(e) => setPopulation(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="area">Area</label>
        <input
          type="number"
          name="area"
          id="area"
          disabled={isLoading}
          value={area || 0}
          onChange={(e) => setArea(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          disabled={isLoading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="walkabilityScore">Walkability Score</label>
        <input
          type="number"
          name="walkabilityScore"
          id="walkabilityScore"
          disabled={isLoading}
          value={walkabilityScore || 0}
          onChange={(e) => setWalkabilityScore(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="bikeScore">Bike Score</label>
        <input
          type="number"
          name="bikeScore"
          id="bikeScore"
          disabled={isLoading}
          value={bikeScore || 0}
          onChange={(e) => setBikeScore(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="transitScore">Transit Score</label>
        <input
          type="number"
          name="transitScore"
          id="transitScore"
          disabled={isLoading}
          value={transitScore || 0}
          onChange={(e) => setTransitScore(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="schoolRating">School Rating</label>
        <input
          type="number"
          name="schoolRating"
          id="schoolRating"
          disabled={isLoading}
          value={schoolRating || 0}
          onChange={(e) => setSchoolRating(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <input
          type="text"
          name="notes"
          id="notes"
          disabled={isLoading}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
