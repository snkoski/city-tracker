import { FormEvent, useEffect, useState } from 'react';
import { Resource } from '@prisma/client';
import { ResourceFormData } from '../../types';

type ResourceFormProps = {
  onSubmit: (data: ResourceFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: Resource | null;
  isLoading: boolean;
};

export const ResourceForm = ({ onSubmit, onCancel, initialData, isLoading }: ResourceFormProps) => {
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setDescription(initialData?.description || '');
      setCategory(initialData?.category || '');
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setCategory('');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !url) {
      alert('Title and URL are required! Ya dummy you made this!');
      return;
    }
    const formData: ResourceFormData = {
      title,
      url,
      description: description || null,
      category: category || null
    };
    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Resource' : 'New Resource'}</h3>
      <div>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          required
          disabled={isLoading}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">URL</label>
        <input
          type="text"
          name="url"
          id="url"
          required
          disabled={isLoading}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          required
          disabled={isLoading}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          id="category"
          required
          disabled={isLoading}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditMode
              ? 'Saving...'
              : 'Adding...'
            : isEditMode
            ? 'Save Updates'
            : 'Save New'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  );
};
