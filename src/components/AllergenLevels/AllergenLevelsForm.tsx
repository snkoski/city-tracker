import { AllergenLevel } from '@prisma/client';
import { AllergenLevelFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';

type AllergenLevelsFormProps = {
  onSubmit: (data: AllergenLevelFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: AllergenLevel | null;
  isLoading: boolean;
  cityId: number;
};

export const AllergenLevelsForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: AllergenLevelsFormProps) => {
  const [month, setMonth] = useState<number | null>(null);
  const [pollen, setPollen] = useState<number | null>(null);
  const [dust, setDust] = useState<number | null>(null);
  const [mold, setMold] = useState<number | null>(null);
  const [ragweed, setRagweed] = useState<number | null>(null);
  const [grass, setGrass] = useState<number | null>(null);
  const [trees, setTrees] = useState<number | null>(null);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setMonth(initialData.month || null);
      setPollen(initialData.pollen || null);
      setDust(initialData.dust || null);
      setMold(initialData.mold || null);
      setRagweed(initialData.ragweed || null);
      setGrass(initialData.grass || null);
      setTrees(initialData.trees || null);
    } else {
      setMonth(null);
      setPollen(null);
      setDust(null);
      setMold(null);
      setRagweed(null);
      setGrass(null);
      setTrees(null);
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('allergen level form handle submit start');
    if (!month) {
      alert('A month is required');
      return;
    }
    event.preventDefault();
    const formData: AllergenLevelFormData = {
      cityId,
      month: month,
      pollen: pollen,
      dust: dust,
      mold: mold,
      ragweed: ragweed,
      grass: grass,
      trees: trees
    };
    console.log('allergen level form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Allergen Level' : 'New Allergen Level'}</h3>
      <div>
        <label htmlFor="month">Month</label>
        <input
          type="text"
          name="month"
          id="month"
          disabled={isLoading}
          value={Number(month)}
          onChange={(e) => setMonth(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="pollen">Pollen</label>
        <input
          type="number"
          name="pollen"
          id="pollen"
          disabled={isLoading}
          value={pollen || 0}
          onChange={(e) => setPollen(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="dust">Dust</label>
        <input
          type="number"
          name="dust"
          id="dust"
          disabled={isLoading}
          value={dust || 0}
          onChange={(e) => setDust(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="mold">Mold</label>
        <input
          type="number"
          name="mold"
          id="mold"
          disabled={isLoading}
          value={mold || 0}
          onChange={(e) => setMold(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="ragweed">Ragweed</label>
        <input
          type="number"
          name="ragweed"
          id="ragweed"
          disabled={isLoading}
          value={ragweed || 0}
          onChange={(e) => setRagweed(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="grass">Grass</label>
        <input
          type="number"
          name="grass"
          id="grass"
          disabled={isLoading}
          value={grass || 0}
          onChange={(e) => setGrass(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="trees">Trees</label>
        <input
          type="number"
          name="trees"
          id="trees"
          disabled={isLoading}
          value={trees || 0}
          onChange={(e) => setTrees(Number(e.target.value))}
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
