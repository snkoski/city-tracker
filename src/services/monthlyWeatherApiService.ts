import { MonthlyWeather } from '@prisma/client';
import { MonthlyWeatherFormData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const fetchAllMonthlyWeather = async (): Promise<MonthlyWeather[]> => {
  const response = await fetch(`${API_BASE_URL}/monthlyWeather`);
  if (!response.ok) {
    throw new Error(`In fetchAllMonthlyWeather - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as MonthlyWeather[];
};

export const fetchCityMonthlyWeather = async (cityId: number): Promise<MonthlyWeather[]> => {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}/monthlyWeather`);
  if (!response.ok) {
    throw new Error(`In fetchCityMonthlyWeather - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as MonthlyWeather[];
};

export const createMonthlyWeather = async (
  monthlyWeatherData: MonthlyWeatherFormData
): Promise<MonthlyWeather> => {
  const response = await fetch(`${API_BASE_URL}/monthlyWeather`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(monthlyWeatherData)
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
      `In createMonthlyWeather - HTTP error status: ${response.status}, message: ${errorDetails}`
    );
  }

  const data = await response.json();
  return data as MonthlyWeather;
};

export const updateMonthlyWeather = async (
  monthlyWeatherData: MonthlyWeatherFormData,
  id: number
): Promise<MonthlyWeather> => {
  const response = await fetch(`${API_BASE_URL}/monthlyWeather/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(monthlyWeatherData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateMonthlyWeather - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as MonthlyWeather;
};

export const deleteMonthlyWeather = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/monthlyWeather/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteMonthlyWeather - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
