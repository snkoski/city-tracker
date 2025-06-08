import { AllergenLevel } from '@prisma/client';
import { AllergenLevelFormData } from '../../types';
import { FormEvent, useEffect, useState } from 'react';
import { MonthSelect } from '../Inputs/MonthSelect';
import { NumberSelect } from '../Inputs/NumberSelect';

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
  const [month, setMonth] = useState<number | ''>('');
  const [pollen, setPollen] = useState<number | ''>('');
  const [dust, setDust] = useState<number | ''>('');
  const [mold, setMold] = useState<number | ''>('');
  const [ragweed, setRagweed] = useState<number | ''>('');
  const [grass, setGrass] = useState<number | ''>('');
  const [trees, setTrees] = useState<number | ''>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setMonth(initialData.month || '');
      setPollen(initialData.pollen || '');
      setDust(initialData.dust || '');
      setMold(initialData.mold || '');
      setRagweed(initialData.ragweed || '');
      setGrass(initialData.grass || '');
      setTrees(initialData.trees || '');
    } else {
      setMonth('');
      setPollen('');
      setDust('');
      setMold('');
      setRagweed('');
      setGrass('');
      setTrees('');
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
      pollen: pollen === '' ? null : pollen,
      dust: dust === '' ? null : dust,
      mold: mold === '' ? null : mold,
      ragweed: ragweed === '' ? null : ragweed,
      grass: grass === '' ? null : grass,
      trees: trees === '' ? null : trees
    };
    console.log('allergen level form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Allergen Level' : 'New Allergen Level'}</h3>
      <div>
        <label htmlFor="month">Month</label>
        <MonthSelect
          name="month"
          id="month"
          value={month}
          onChange={(newMonth) => setMonth(newMonth)}
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="pollen">Pollen</label>
        <NumberSelect
          name="pollen"
          id="pollen"
          value={pollen}
          onChange={(newValue) => setPollen(newValue)}
          placeholder="-- Pollen Level --"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="dust">Dust</label>
        <NumberSelect
          name="dust"
          id="dust"
          value={dust}
          onChange={(newValue) => setDust(newValue)}
          placeholder="-- Dust Level --"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="mold">Mold</label>
        <NumberSelect
          name="mold"
          id="mold"
          value={mold}
          onChange={(newValue) => setMold(newValue)}
          placeholder="-- Mold Level --"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="ragweed">Ragweed</label>
        <NumberSelect
          name="ragweed"
          id="ragweed"
          value={ragweed}
          onChange={(newValue) => setRagweed(newValue)}
          placeholder="-- Ragweed Level --"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="grass">Grass</label>
        <NumberSelect
          name="grass"
          id="grass"
          value={grass}
          onChange={(newValue) => setGrass(newValue)}
          placeholder="-- Grass Level --"
          disabled={isLoading}
        />
      </div>
      <div>
        <label htmlFor="trees">Trees</label>
        <NumberSelect
          name="trees"
          id="trees"
          value={trees}
          onChange={(newValue) => setTrees(newValue)}
          placeholder="-- Trees Level --"
          disabled={isLoading}
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
