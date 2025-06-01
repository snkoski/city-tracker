import { AgeDemographic } from '@prisma/client';

type AgeDemographicsListProps = {
  ageDemographics: AgeDemographic[];
  onEdit: (data: AgeDemographic) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const AgeDemographicsList = ({
  ageDemographics,
  onEdit,
  onDelete,
  isLoadingDelete
}: AgeDemographicsListProps) => {
  if (!ageDemographics.length) {
    return <p>No age demographics yet. How old are these people!</p>;
  }
  return (
    <div className="border-cyan-400 border-2 rounded-2xl p-4">
      {ageDemographics.map((ageDemographic) => (
        <div key={ageDemographic.id}>
          <p>{ageDemographic.ageRange}</p>
          <p>{ageDemographic.percent.toString()}%</p>
          <div>
            <button type="button" onClick={() => onEdit(ageDemographic)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(ageDemographic.id)}
              disabled={isLoadingDelete === ageDemographic.id}
            >
              {isLoadingDelete === ageDemographic.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
