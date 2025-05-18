import { Event } from '@prisma/client';
import { FormEvent, useEffect, useState } from 'react';
import { EventFormData } from '../../types';

type EventFormProps = {
  onSubmit: (data: EventFormData, id?: number) => Promise<void>;
  onCancel: () => void;
  initialData?: Event | null;
  isLoading: boolean;
  cityId: number;
};

export const EventForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
  cityId
}: EventFormProps) => {
  const [placeId, setPlace] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [dateTimeString, setDateTimeString] = useState<string>('');
  const [startTimeString, setStartTimeString] = useState<string>('');
  const [endTimeString, setEndTimeString] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [website, setWebsite] = useState<string | null>('');
  const [ticketUrl, setTicketUrl] = useState<string | null>('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setPlace(initialData.placeId);
      setName(initialData.name);
      setDateTimeString(initialData.date.toString());
      setStartTimeString(initialData.startTime?.toString() || '');
      setEndTimeString(initialData.endTime?.toString() || '');
      setDetails(initialData.details || '');
      setWebsite(initialData.website);
      setTicketUrl(initialData.ticketUrl);
    } else {
      setPlace(null);
      setName('');
      setDateTimeString('');
      setStartTimeString('');
      setEndTimeString('');
      setDetails('');
      setWebsite('');
      setTicketUrl('');
    }
  }, [initialData, cityId]);

  const handleSubmit = async (event: FormEvent) => {
    console.log('event form handle submit start');

    event.preventDefault();
    if (!name || !dateTimeString) {
      alert("How can I go if I don't have basic information like a name or a date you goober...");
      return;
    }
    const formData: EventFormData = {
      name,
      date: new Date(dateTimeString),
      cityId,
      placeId: placeId || 0,
      startTime: startTimeString ? new Date(startTimeString) : null,
      endTime: endTimeString ? new Date(startTimeString) : null,
      details: details || null,
      website: website || null,
      ticketUrl: ticketUrl || null
    };
    console.log('event form after form data creation', formData);

    await onSubmit(formData, initialData?.id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditMode ? 'Edit Event' : 'New Event'}</h3>
      <div>
        <label htmlFor="name"></label>
        <input
          type="text"
          name="name"
          id="name"
          disabled={isLoading}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          disabled={isLoading}
          value={dateTimeString}
          onChange={(e) => setDateTimeString(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="details">Details</label>
        <input
          type="text"
          name="details"
          id="details"
          disabled={isLoading}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  );
};
// name,
// date: new Date(dateTimeString),
// cityId: cityId || null,
// placeId: placeId || null,
// startTime: startTimeString ? new Date(startTimeString) : null,
// endTime: endTimeString ? new Date(startTimeString) : null,
// details: details || null,
// website: website || null,
// ticketUrl: ticketUrl || null
