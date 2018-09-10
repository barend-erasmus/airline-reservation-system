import { IEvent } from '../interfaces/event';
import { EventType } from '../enums/event-type';
import { hydratePassenger } from '../aggregates/passenger';
import { IPassenger } from '../interfaces/passenger';
import { publishToEventBus } from '../event-bus';

export async function handlePassengerRegisterRequestEvent(event: IEvent<any>): Promise<void> {
  const existingPassenger: IPassenger = await hydratePassenger(event.aggregateId);

  if (existingPassenger) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.PASSENGER_REGISTER_FAIL,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.PASSENGER_REGISTER_SUCCESS,
    payload: event.payload,
  });
}
