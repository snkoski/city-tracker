import { useState } from 'react';
import { Neighborhood } from '@prisma/client';

interface NeighborhoodFormProps {
  initialData?: Partial<Neighborhood>;
  onSubmit: (data: Partial<Neighborhood>) => void;
  cityId: number;
}

export default function NeighborhoodForm({ initialData, onSubmit, cityId }: NeighborhoodFormProps) {
  const [formData, setFormData] = useState<Partial<Neighborhood>>({
    name: '',
    cityId,
    population: null,
    area: null,
    description: '',
    walkabilityScore: null,
    bikeScore: null,
    transitScore: null,
    schoolRating: null,
    notes: '',
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="population">Population</label>
        <input
          type="number"
          id="population"
          name="population"
          value={formData.population || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="area">Area (square miles)</label>
        <input
          type="number"
          step="0.01"
          id="area"
          name="area"
          value={formData.area || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="walkabilityScore">Walkability Score (0-100)</label>
        <input
          type="number"
          min="0"
          max="100"
          id="walkabilityScore"
          name="walkabilityScore"
          value={formData.walkabilityScore || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="bikeScore">Bike Score (0-100)</label>
        <input
          type="number"
          min="0"
          max="100"
          id="bikeScore"
          name="bikeScore"
          value={formData.bikeScore || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="transitScore">Transit Score (0-100)</label>
        <input
          type="number"
          min="0"
          max="100"
          id="transitScore"
          name="transitScore"
          value={formData.transitScore || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="schoolRating">School Rating (1-10)</label>
        <input
          type="number"
          min="1"
          max="10"
          id="schoolRating"
          name="schoolRating"
          value={formData.schoolRating || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="submit">{initialData ? 'Update' : 'Create'} Neighborhood</button>
      </div>
    </form>
  );
}
