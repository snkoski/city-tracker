import { AllergenLevel } from '@prisma/client';
import { AllergenLevelFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchAllAllergenLevels = async (): Promise<AllergenLevel[]> => {
  const response = await fetch(`${API_BASE_URL}/allergenLevels`);
  if (!response.ok) {
    throw new Error(`In fetchAllAllergenLevels - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as AllergenLevel[];
};

export const fetchCityAllergenLevels = async (cityId: number): Promise<AllergenLevel[]> => {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}/allergenLevels`);
  if (!response.ok) {
    throw new Error(`In fetchCityAllergenLevels - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as AllergenLevel[];
};

export const createAllergenLevel = async (
  AllergenLevelData: AllergenLevelFormData
): Promise<AllergenLevel> => {
  const response = await fetch(`${API_BASE_URL}/allergenLevels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AllergenLevelData)
  });
  if (!response.ok) {
    let errorDetails = response.statusText;
    try {
      const errorData = await response.json();
      errorDetails = errorData?.message || errorData?.error || response.statusText;
    } catch (error) {
      console.error('Could not parse error response JSON:', error);
    }
    throw new Error(
      `In createAllergenLevel - HTTP error status: ${response.status}, message: ${errorDetails}`
    );
  }

  const data = await response.json();
  return data as AllergenLevel;
};

export const updateAllergenLevel = async (
  AllergenLevelData: AllergenLevelFormData,
  id: number
): Promise<AllergenLevel> => {
  const response = await fetch(`${API_BASE_URL}/allergenLevels/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AllergenLevelData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateAllergenLevel - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as AllergenLevel;
};

export const deleteAllergenLevel = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/allergenLevels/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteAllergenLevel - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
