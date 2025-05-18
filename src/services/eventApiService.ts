import { Event } from '@prisma/client';
import { EventFormData, EventWithPlaceDetails } from '../types';

const API_BASE_URL = 'http://localhost:3000';

export const fetchAllEvents = async (): Promise<Event[]> => {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error(`In fetchEvents - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Event[];
};

export const fetchCityEvents = async (cityId: number): Promise<EventWithPlaceDetails[]> => {
  const response = await fetch(`${API_BASE_URL}/events?cityId=${cityId}&_expand=place`);
  if (!response.ok) {
    throw new Error(`In fetchCityEvents - HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as EventWithPlaceDetails[];
};

export const createEvent = async (eventData: EventFormData): Promise<EventWithPlaceDetails> => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In createEvent - HTTP error status: ${response.status}, message: ${
          errorData?.message || response.statusText
        }`
      );
    }
  }
  console.log('createEvent before response.json()');

  const data = await response.json();
  return data as EventWithPlaceDetails;
};

export const updateEvent = async (
  eventData: EventFormData,
  id: number
): Promise<EventWithPlaceDetails> => {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(
        `In updateEvent - HTTP error status: ${response.status}, message: ${
          errorData?.messages || response.statusText
        }`
      );
    }
  }

  const data = await response.json();
  return data as EventWithPlaceDetails;
};

export const deleteEvent = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error(
      `In deleteEvent - HTTP error! status: ${response.status} ${response.statusText}`
    );
  }
};
