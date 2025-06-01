import { AgeDemographic } from '@prisma/client';
import { AgeDemographicFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchAllAgeDemographics = async (): Promise<AgeDemographic[]> => {
  const response = await fetch(`${API_BASE_URL}/ageDemographics`);
  if (!response.ok) {
    throw new Error(`In fetchAllAgeDemographics - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as AgeDemographic[];
};

export const fetchCityAgeDemographics = async (cityId: number): Promise<AgeDemographic[]> => {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}/ageDemographics`);
  if (!response.ok) {
    throw new Error(`In fetchCityAgeDemographics - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as AgeDemographic[];
};

export const createAgeDemographic = async (
  AgeDemographicData: AgeDemographicFormData
): Promise<AgeDemographic> => {
  const response = await fetch(`${API_BASE_URL}/ageDemographics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AgeDemographicData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In createAgeDemographic - HTTP error status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as AgeDemographic;
};

export const updateAgeDemographic = async (
  AgeDemographicData: AgeDemographicFormData,
  id: number
): Promise<AgeDemographic> => {
  const response = await fetch(`${API_BASE_URL}/ageDemographics/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AgeDemographicData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateAgeDemographic - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as AgeDemographic;
};

export const deleteAgeDemographic = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/ageDemographics/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteAgeDemographic - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
