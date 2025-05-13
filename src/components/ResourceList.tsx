import { Resource } from '@prisma/client';

type ResourceListProps = {
  resources: Resource[];
  onEdit: (data: Resource) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const ResourceList = ({
  resources,
  onEdit,
  onDelete,
  isLoadingDelete
}: ResourceListProps) => {
  if (!resources.length) {
    return <p>No resources added yet</p>;
  }
  return (
    <div>
      {resources.map((resource) => (
        <div key={resource.id}>
          <p>
            <strong>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            </strong>
          </p>
          {resource.category && <p>Category: {resource.category}</p>}
          {resource.description && <p>Description: {resource.description}</p>}
          <div>
            <button type="button" onClick={() => onEdit(resource)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(resource.id)}
              disabled={isLoadingDelete === resource.id}
            >
              {isLoadingDelete === resource.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
