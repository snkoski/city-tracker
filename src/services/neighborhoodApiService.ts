import { Neighborhood } from '@prisma/client';
import { NeighborhoodFormData } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export const fetchAllNeighborhoods = async (): Promise<Neighborhood[]> => {
  const response = await fetch(`${API_BASE_URL}/neighborhoods`);
  if (!response.ok) {
    throw new Error(`In fetchAllNeighborhoods - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Neighborhood[];
};

export const fetchCityNeighborhoods = async (cityId: number): Promise<Neighborhood[]> => {
  const response = await fetch(`${API_BASE_URL}/neighborhoods?cityId=${cityId}`);
  if (!response.ok) {
    throw new Error(`In fetchCityNeighborhoods - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Neighborhood[];
};

export const createEventNeighborhood = async (
  neighborhoodData: NeighborhoodFormData
): Promise<Neighborhood> => {
  const response = await fetch(`${API_BASE_URL}/neighborhoods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(neighborhoodData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In createEventNeighborhood - HTTP error status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Neighborhood;
};

export const updateNeighborhood = async (
  neighborhoodData: NeighborhoodFormData,
  id: number
): Promise<Neighborhood> => {
  const response = await fetch(`${API_BASE_URL}/neighborhoods/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(neighborhoodData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateNeighborhood - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Neighborhood;
};

export const deleteNeighborhood = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/neighborhoods/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteNeighborhood - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
