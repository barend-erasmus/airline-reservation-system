import { IEvent } from '../interfaces/event';
import { hydrateAirline } from '../aggregates/airline';
import { IAirline } from '../interfaces/airline';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';

export async function handleAirlineRegisterRequestEvent(event: IEvent<any>): Promise<void> {
  const existingAirline: IAirline = await hydrateAirline(event.aggregateId);
  
  if (existingAirline) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.AIRLINE_REGISTER_FAIL,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.AIRLINE_REGISTER_SUCCESS,
    payload: event.payload,
  });
}
