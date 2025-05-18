import { EventWithPlaceDetails } from '../../types';

type EventListProps = {
  events: EventWithPlaceDetails[];
  onEdit: (data: EventWithPlaceDetails) => void;
  onDelete: (id: number) => void;
  isLoadingDelete: number | null;
};

export const EventList = ({ events, onEdit, onDelete, isLoadingDelete }: EventListProps) => {
  if (!events.length) {
    return <p>No events yet. Find something fun to do!</p>;
  }
  return (
    <div className="border-cyan-400 border-2 rounded-2xl p-4">
      {events.map((event) => (
        <div key={event.id}>
          <p>
            <strong>{event.name}</strong>
            {event.place?.name && ` @ ${event.place.name}`}
          </p>
          {event.date && <p>{event.date.toString()}</p>}
          {(event.startTime || event.endTime) && (
            <p>
              {event.startTime && `From: ${event.startTime} `}
              {event.endTime && `Until: ${event.endTime}`}
            </p>
          )}
          {event.website && (
            <a href={`${event.website}`} target="_blank" rel="noopener noreferrer">
              <p>Website</p>
            </a>
          )}
          {event.ticketUrl && (
            <a href={`${event.ticketUrl}`} target="_blank" rel="noopener noreferrer">
              <p>Tickets</p>
            </a>
          )}
          {event.details && <p>{event.details}</p>}
          <div>
            <button type="button" onClick={() => onEdit(event)}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              disabled={isLoadingDelete === event.id}
            >
              {isLoadingDelete === event.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
