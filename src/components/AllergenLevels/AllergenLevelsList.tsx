import { AllergenLevel } from '@prisma/client';
import { getLocalizedMonthName } from '../../utils/dateUtils';

type AgeDemographicsListProps = {
  allergenLevels: AllergenLevel[];
  onEdit: (data: AllergenLevel) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const AllergenLevelsList = ({
  allergenLevels,
  onEdit,
  onDelete,
  isLoadingDelete
}: AgeDemographicsListProps) => {
  if (!allergenLevels.length) {
    return <p>No Allergen Levels yet. Will I be sneezy!</p>;
  }
  return (
    <div className="flex flex-row border-cyan-400 border-2 rounded-2xl p-4">
      {allergenLevels.map((allergenLevel) => (
        <div key={allergenLevel.id}>
          <div className="flex flex-col border-amber-600 border-2 p-1 rounded-md">
            <p>{getLocalizedMonthName(allergenLevel.month)}</p>
            <p>Pollen: {allergenLevel.pollen}</p>
            <p>Dust: {allergenLevel.dust}</p>
            <p>Mold: {allergenLevel.mold}</p>
            <p>Ragweed: {allergenLevel.ragweed}</p>
            <p>Grass: {allergenLevel.grass}</p>
            <p>Trees: {allergenLevel.trees}</p>
          </div>
          <div>
            <button type="button" onClick={() => onEdit(allergenLevel)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(allergenLevel.id)}
              disabled={isLoadingDelete === allergenLevel.id}
            >
              {isLoadingDelete === allergenLevel.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
