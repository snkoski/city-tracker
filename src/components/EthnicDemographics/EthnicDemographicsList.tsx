import { EthnicDemographic } from '@prisma/client';

type EthnicDemographicsListProps = {
  ethnicDemographics: EthnicDemographic[];
  onEdit: (data: EthnicDemographic) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const EthnicDemographicsList = ({
  ethnicDemographics,
  onEdit,
  onDelete,
  isLoadingDelete
}: EthnicDemographicsListProps) => {
  if (!ethnicDemographics.length) {
    return <p>No ethnic demographics yet. Is there diversity!</p>;
  }
  return (
    <div className="border-cyan-400 border-2 rounded-2xl p-4">
      {ethnicDemographics.map((ethnicDemographic) => (
        <div key={ethnicDemographic.id}>
          <p>{ethnicDemographic.group}</p>
          <p>{ethnicDemographic.percent}%</p>
          <div>
            <button type="button" onClick={() => onEdit(ethnicDemographic)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(ethnicDemographic.id)}
              disabled={isLoadingDelete === ethnicDemographic.id}
            >
              {isLoadingDelete === ethnicDemographic.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
