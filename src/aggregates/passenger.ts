import { IEvent } from '../interfaces/event';
import { EventType } from '../enums/event-type';
import { hydrateFromEventStore, hydrate } from '../persistence/event-store';
import { IPassenger } from '../interfaces/passenger';
import { COLLECTIONS } from '../constants/collections';

export function applyEventToPassenger(passenger: IPassenger, event: IEvent<any>): IPassenger {
  switch (event.type) {
    case EventType.PASSENGER_REGISTRATION_REQUEST_SUCCEEDED:
      return {
        ...event.payload,
        lastAppliedEventId: event.eventId,
      };
    default:
      return passenger;
  }
}

export async function hydratePassengerFromEventStore(aggregateId: string): Promise<IPassenger> {
  return hydrateFromEventStore(applyEventToPassenger, null, aggregateId) as Promise<IPassenger>;
}

export async function hydratePassenger(
  aggregateId: string,
): Promise<IPassenger> {
  return hydrate(COLLECTIONS.PASSENGER, applyEventToPassenger, aggregateId) as Promise<IPassenger>;
}
