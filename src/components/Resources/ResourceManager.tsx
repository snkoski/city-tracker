import { Resource } from '@prisma/client';
import { ResourceList } from './ResourceList';
import { ResourceForm } from './ResourceForm';
import { useCallback, useEffect, useState } from 'react';
import {
  createResource,
  deleteResource,
  fetchResources,
  updateResource
} from '../../services/resourceApiService';
import { ResourceFormData } from '../../types';

export const ResourceManager = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResourceId, setDeletingResourceId] = useState<number | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchResources();
      setResources(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadResources - an unknown error occured`);
      }
      console.error(`Failed to fetch Resources: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleSubmit = async (data: ResourceFormData, id?: number) => {
    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateResource(data, id);
        setResources((previousResources) =>
          previousResources.map((resource) => (resource.id === id ? updated : resource))
        );
      } else {
        const created = await createResource(data);
        setResources((previousResources) => [...previousResources, created]);
      }
      setIsFormVisible(false);
      setEditingResource(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the resource. Fuck :(`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (window.confirm('Bruh, you sure you want to delete this shit?')) {
      setDeletingResourceId(id);
      setError(null);
      try {
        await deleteResource(id);
        setResources((previousResources) =>
          previousResources.filter((resource) => resource.id !== id)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting a resource...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddResourceClick = () => {
    setEditingResource(null);
    setIsFormVisible(true);
  };

  const handleEditResourceClick = (resource: Resource) => {
    setEditingResource(resource);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingResource(null);
    setError(null);
  };

  if (isLoading && !resources.length) return <p>Loading Resources...</p>;
  return (
    <>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && <button onClick={handleAddResourceClick}>Add new resource</button>}
      {isFormVisible && (
        <ResourceForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          initialData={editingResource}
          isLoading={isFormSubmitting}
        />
      )}
      <ResourceList
        resources={resources}
        onEdit={handleEditResourceClick}
        onDelete={handleDeleteResource}
        isLoadingDelete={deletingResourceId}
      />
    </>
  );
};
