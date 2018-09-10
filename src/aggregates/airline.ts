import { IEvent } from '../interfaces/event';
import { IAirline } from '../interfaces/airline';
import { EventType } from '../enums/event-type';
import { hydrateFromEventStore, hydrate } from '../persistence/event-store';
import { COLLECTIONS } from '../constants/collections';

export function applyEventToAirline(airline: IAirline, event: IEvent<any>): IAirline {
  switch (event.type) {
    case EventType.AIRLINE_REGISTER_SUCCESS:
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
  return hydrate(COLLECTIONS.AIRLINE, applyEventToAirline, aggregateId) as Promise<IAirline>;
}
