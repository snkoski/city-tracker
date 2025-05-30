import { Airport } from '@prisma/client';
import { AirportFormData } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export const fetchAllAirports = async (): Promise<Airport[]> => {
  const response = await fetch(`${API_BASE_URL}/airports`);
  if (!response.ok) {
    throw new Error(`In fetchAllAirports - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Airport[];
};

export const fetchCityAirports = async (cityId: number): Promise<Airport[]> => {
  const response = await fetch(`${API_BASE_URL}/airports?cityId=${cityId}`);
  if (!response.ok) {
    throw new Error(`In fetchCityAirports - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Airport[];
};

export const createAirport = async (AirportData: AirportFormData): Promise<Airport> => {
  const response = await fetch(`${API_BASE_URL}/airports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AirportData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In createAirport - HTTP error status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Airport;
};

export const updateAirport = async (AirportData: AirportFormData, id: number): Promise<Airport> => {
  const response = await fetch(`${API_BASE_URL}/airports/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(AirportData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateAirport - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as Airport;
};

export const deleteAirport = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/airports/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteAirport - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
