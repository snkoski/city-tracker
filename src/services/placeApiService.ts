import { Place } from '@prisma/client';
import { PlaceFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchAllPlaces = async (): Promise<Place[]> => {
  const response = await fetch(`${API_BASE_URL}/places`);
  if (!response.ok) {
    throw new Error(`In fetchAllPlaces - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Place[];
};

export const fetchCityPlaces = async (cityId: number): Promise<Place[]> => {
  const response = await fetch(`${API_BASE_URL}/places?cityId=${cityId}`);
  if (!response.ok) {
    throw new Error(`In fetchCityPlaces - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Place[];
};

export const createPlace = async (PlaceData: PlaceFormData): Promise<Place> => {
  const response = await fetch(`${API_BASE_URL}/places`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(PlaceData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In createPlace - HTTP error status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Place;
};

export const updatePlace = async (PlaceData: PlaceFormData, id: number): Promise<Place> => {
  const response = await fetch(`${API_BASE_URL}/places/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(PlaceData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updatePlace - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Place;
};

export const deletePlace = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/places/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deletePlace - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
