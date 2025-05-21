import { Resource } from '@prisma/client';
import { ResourceFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchResources = async (): Promise<Resource[]> => {
  const response = await fetch(`${API_BASE_URL}/resources`);
  if (!response.ok) {
    throw new Error(`In fetchResources - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Resource[];
};

export const createResource = async (resourceData: ResourceFormData): Promise<Resource> => {
  const response = await fetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resourceData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In createResource - HTTP error! status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Resource;
};

export const updateResource = async (
  resourceData: Partial<ResourceFormData>,
  id: number
): Promise<Resource> => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resourceData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateResource - HTTP error! status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Resource;
};

export const deleteResource = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteResource - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
