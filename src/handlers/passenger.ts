import { IEvent } from '../interfaces/event';
import { publishEvent } from '../persistence/event-store';
import { EventType } from '../enums/event-type';
import { hydratePassengerFromEventStore } from '../aggregates/passenger';
import { IPassenger } from '../interfaces/passenger';

export async function handlePassengerRegisterRequestEvent(event: IEvent<any>): Promise<void> {
  const existingPassenger: IPassenger = await hydratePassengerFromEventStore(event.aggregateId);

  if (existingPassenger) {
    await publishEvent({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.PASSENGER_REGISTER_FAIL,
      payload: event.payload,
    });

    return;
  }

  await publishEvent({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.PASSENGER_REGISTER_SUCCESS,
    payload: event.payload,
  });
}
