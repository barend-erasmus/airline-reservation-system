import { COLLECTIONS } from '../constants/collections';
import { EventType } from '../enums/event-type';
import { IAirline } from '../interfaces/airline';
import { IEvent } from '../interfaces/event';
import { hydrate, hydrateFromEventStore } from '../persistence/event-store';

export function applyEventToAirline(airline: IAirline, event: IEvent<any>): IAirline {
  switch (event.type) {
    case EventType.AIRLINE_REGISTRATION_REQUEST_SUCCEEDED:
      return {
        ...event.payload,
        lastAppliedEventId: event.eventId,
      };
    default:
      return airline;
  }
}

export async function hydrateAirlineFromEventStore(aggregateId: string): Promise<IAirline> {
  return hydrateFromEventStore(applyEventToAirline, null, aggregateId) as Promise<IAirline>;
}

export async function hydrateAirline(aggregateId: string): Promise<IAirline> {
  return hydrate(COLLECTIONS.AIRLINE_SNAPSHOT, applyEventToAirline, aggregateId) as Promise<IAirline>;
}
