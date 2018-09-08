import { IEvent } from '../interfaces/event';
import { hydrateAirlineFromEventStore } from '../aggregates/airline';
import { IAirline } from '../interfaces/airline';
import { publishEvent } from '../persistence/event-store';
import { EventType } from '../enums/event-type';

export async function handleAirlineRegisterEvent(event: IEvent<any>): Promise<void> {
  const existingAirline: IAirline = await hydrateAirlineFromEventStore(event.aggregateId);
  
  if (existingAirline) {
    return;
  }

  await publishEvent({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.AIRLINE_REGISTER_SUCCESS,
    payload: event.payload,
  });
}
