import { useCallback, useEffect, useState } from 'react';
import { EventFormData, EventWithPlaceDetails } from '../../types';
import { EventList } from './EventList';
import {
  createEvent,
  deleteEvent,
  fetchCityEvents,
  updateEvent
} from '../../services/eventApiService';
import { EventForm } from './EventForm';

type EventManagerProps = {
  cityId: number;
};

export const EventManager = ({ cityId }: EventManagerProps) => {
  const [events, setEvents] = useState<EventWithPlaceDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventWithPlaceDetails | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCityEvents(cityId);
      setEvents(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`In loadEvents - an unknown error occured`);
      }
      console.error(`Failed to fetch Events: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSubmit = async (data: EventFormData, id?: number) => {
    console.log('actual start of handle submit');

    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateEvent(data, id);
        setEvents((previousEvents) =>
          previousEvents.map((event) => (event.id === id ? updated : event))
        );
      } else {
        console.log('handle submit start');

        const created = await createEvent(data);
        setEvents((previousEvents) => [...previousEvents, created]);
        console.log('handle submit after setEvents');
      }
      setIsFormVisible(false);
      setEditingEvent(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(`An unknown error occurred while saving the event. WTF did you do?!?!?`);
        console.error(error);
      }
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm(`I hope to god you know what you're doing...`)) {
      setDeletingEventId(id);
      setError(null);
      try {
        await deleteEvent(id);
        setEvents((previousEvents) => previousEvents.filter((event) => event.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(`An unknown error occurred while deleting an event...`);
          console.error(error);
        }
      } finally {
        setIsFormSubmitting(false);
      }
    }
  };

  const handleAddEventClick = () => {
    setEditingEvent(null);
    setIsFormVisible(true);
  };

  const handleEditEventClick = (event: EventWithPlaceDetails) => {
    setEditingEvent(event);
    setIsFormVisible(true);
  };

  const handleCancelClick = () => {
    setIsFormVisible(false);
    setEditingEvent(null);
    setError(null);
  };

  if (isLoading && !events.length) return <p>Loading Events...</p>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {!isFormVisible && (
        <button type="button" onClick={handleAddEventClick}>
          Add new event
        </button>
      )}
      {isFormVisible && (
        <EventForm
          onSubmit={handleSubmit}
          onCancel={handleCancelClick}
          isLoading={isFormSubmitting}
          initialData={editingEvent}
          cityId={cityId}
        />
      )}
      <EventList
        events={events}
        onEdit={handleEditEventClick}
        onDelete={handleDeleteEvent}
        isLoadingDelete={deletingEventId}
      />
    </div>
  );
};
