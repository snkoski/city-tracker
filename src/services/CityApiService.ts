import { CityFormData, CityFullDetails, CitySummaryFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchAllCities = async (): Promise<CityFullDetails[]> => {
  const response = await fetch(`${API_BASE_URL}/cities`);
  if (!response.ok) {
    throw new Error(`In fetchAllCities - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as CityFullDetails[];
};

export const fetchStateCities = async (stateId: number): Promise<CityFullDetails[]> => {
  const response = await fetch(`${API_BASE_URL}/states/${stateId}/cities`);
  if (!response.ok) {
    throw new Error(`In fetchStateCities - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as CityFullDetails[];
};

// TODO: How should adding a new city be handled? All data or just pop/tax and use update for rest of data?
export const createCity = async (cityData: CitySummaryFormData): Promise<CityFullDetails> => {
  console.log('createCity');

  const response = await fetch(`${API_BASE_URL}/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cityData)
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
      `In createCity - HTTP error status: ${response.status}, message: ${errorDetails}`
    );
  }

  const data = await response.json();
  return data as CityFullDetails;
};

export const updateCity = async (cityData: CityFormData, id: number): Promise<CityFullDetails> => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cityData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateCity - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as CityFullDetails;
};

export const deleteCity = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteCity - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
