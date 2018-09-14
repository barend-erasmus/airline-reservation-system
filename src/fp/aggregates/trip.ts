import { COLLECTIONS } from '../constants/collections';
import { EventType } from '../enums/event-type';
import { IEvent } from '../interfaces/event';
import { ITrip } from '../interfaces/trip';
import { hydrate, hydrateFromEventStore } from '../persistence/event-store';

export function applyEventToTrip(trip: ITrip, event: IEvent<any>): ITrip {
  switch (event.type) {
    case EventType.TRIP_REGISTRATION_REQUEST_SUCCEEDED:
      return {
        ...event.payload,
        lastAppliedEventId: event.eventId,
      };
    case EventType.TRIP_SEAT_RESERVATION_REQUEST:
      return {
        ...trip,
        lastAppliedEventId: event.eventId,
        numberOfSeatRemaining: trip.numberOfSeatRemaining - 1,
      };
    case EventType.TRIP_SEAT_RESERVATION_REQUEST_FAILED:
      return {
        ...trip,
        lastAppliedEventId: event.eventId,
        numberOfSeatRemaining: trip.numberOfSeatRemaining + 1,
      };
    default:
      return trip;
  }
}

export async function hydrateTripFromEventStore(aggregateId: string): Promise<ITrip> {
  return hydrateFromEventStore(applyEventToTrip, null, aggregateId) as Promise<ITrip>;
}

export async function hydrateTrip(aggregateId: string): Promise<ITrip> {
  return hydrate(COLLECTIONS.TRIP_SNAPSHOT, applyEventToTrip, aggregateId) as Promise<ITrip>;
}
