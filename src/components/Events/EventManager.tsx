import { useState } from 'react';
import { EventFormData, EventWithPlaceDetails } from '../../types';
import { EventList } from './EventList';
import { createEvent, deleteEvent, updateEvent } from '../../services/eventApiService';
import { EventForm } from './EventForm';
import { Place } from '@prisma/client';

type EventManagerProps = {
  cityId: number;
  events: EventWithPlaceDetails[];
  places: Place[];
  setEventsCallback: (newEvents: EventWithPlaceDetails[]) => void;
};

export const EventManager = ({ cityId, events, places, setEventsCallback }: EventManagerProps) => {
  const [error, setError] = useState<string | null>(null);

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<EventWithPlaceDetails | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);

  const handleSubmit = async (data: EventFormData, id?: number) => {
    console.log('actual start of handle submit');

    setIsFormSubmitting(true);
    setError(null);
    try {
      if (id) {
        const updated = await updateEvent(data, id);
        setEventsCallback(events.map((event) => (event.id === id ? updated : event)));
      } else {
        console.log('handle submit start');

        const created = await createEvent(data);
        setEventsCallback([...events, created]);
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
        setEventsCallback(events.filter((event) => event.id !== id));
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
          places={places}
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
