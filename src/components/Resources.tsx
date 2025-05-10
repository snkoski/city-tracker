import { Resource } from '@prisma/client';

type ResourcesProps = {
  resources: Resource[];
};

export const Resources = ({ resources }: ResourcesProps) => {
  return (
    <div>
      {resources.map((resource) => (
        <div>
          <p>
            <strong>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            </strong>
          </p>
          <p>Category: {resource.category}</p>
          <p>Description: {resource.description}</p>
        </div>
      ))}
    </div>
  );
};
