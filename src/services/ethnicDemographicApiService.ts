import { EthnicDemographic } from '@prisma/client';
import { EthnicDemographicFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchAllEthnicDemographics = async (): Promise<EthnicDemographic[]> => {
  const response = await fetch(`${API_BASE_URL}/ethnicDemographics`);
  if (!response.ok) {
    throw new Error(`In fetchAllEthnicDemographics - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as EthnicDemographic[];
};

export const fetchCityEthnicDemographics = async (cityId: number): Promise<EthnicDemographic[]> => {
  const response = await fetch(`${API_BASE_URL}/ethnicDemographics?cityId=${cityId}`);
  if (!response.ok) {
    throw new Error(`In fetchCityEthnicDemographics - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as EthnicDemographic[];
};

export const createEthnicDemographic = async (
  EthnicDemographicData: EthnicDemographicFormData
): Promise<EthnicDemographic> => {
  const response = await fetch(`${API_BASE_URL}/ethnicDemographics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(EthnicDemographicData)
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
      `In createEthnicDemographic - HTTP error status: ${response.status}, message: ${errorDetails}`
    );
  }

  const data = await response.json();
  return data as EthnicDemographic;
};

export const updateEthnicDemographic = async (
  EthnicDemographicData: EthnicDemographicFormData,
  id: number
): Promise<EthnicDemographic> => {
  const response = await fetch(`${API_BASE_URL}/ethnicDemographics/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(EthnicDemographicData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateEthnicDemographic - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as EthnicDemographic;
};

export const deleteEthnicDemographic = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/ethnicDemographics/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteEthnicDemographic - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
