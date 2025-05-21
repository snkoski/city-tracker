import { City, State } from '@prisma/client';
import { CityFullDetails } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';
const IS_MOCK_SERVER = false; // set this to false when using real data

export const fetchStates = async (): Promise<State[]> => {
  // Fetch data from the json-server endpoint for states
  const response = await fetch(`${API_BASE_URL}/states`);

  if (!response.ok) {
    throw new Error(`In fetchStates - HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as State[];
  return data;
};

export const fetchCities = async (stateId: number): Promise<City[]> => {
  const response = await fetch(`${API_BASE_URL}/states/${stateId}/cities`);
  if (!response.ok) {
    throw new Error(`In fetchCities - HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as City[];
  return data;
};

export const fetchFullCityDetails = async (cityId: number): Promise<CityFullDetails> => {
  const response = await fetch(`${API_BASE_URL}/cities/${cityId}`);
  if (!response.ok) {
    throw new Error(`in fetchCityDetails - HTTP error! status: ${response.status}`);
  }
  const data = (await response.json()) as CityFullDetails;

  if (IS_MOCK_SERVER) {
    const places = data.places;
    for (const event of data.events) {
      const eventPlace = places.find((place) => place.id === event.placeId);
      if (eventPlace) {
        event.place = eventPlace;
      }
    }
  }
  return data;
};
