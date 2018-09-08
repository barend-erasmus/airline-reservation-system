import * as R from 'ramda';
import { IEvent } from '../interfaces/event';
import { IAirline } from '../interfaces/airline';
import { EventType } from '../enums/event-type';
import { hydrateFromEventStore } from '../persistence/event-store';
import { hydrate } from './base';

export async function applyEventToAirline(airline: IAirline, event: IEvent<any>): Promise<IAirline> {
  switch (event.type) {
    case EventType.AIRLINE_REGISTER_SUCCESS:
      return {
        ...event.payload,
      };
    default:
      return airline;
  }
}

export async function hydrateAirlineFromEventStore(
  id: string,
): Promise<IAirline> {
  return hydrateFromEventStore(R.curry(hydrate)(applyEventToAirline, null), id);
}
