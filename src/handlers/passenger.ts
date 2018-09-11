import { hydratePassenger } from '../aggregates/passenger';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';
import { IEvent } from '../interfaces/event';
import { IPassenger } from '../interfaces/passenger';

export async function handlePassengerRegistrationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingPassenger: IPassenger = await hydratePassenger(event.aggregateId);

  if (existingPassenger) {
    await publishToEventBus({
      aggregateId: event.aggregateId,
      eventId: null,
      payload: event.payload,
      type: EventType.PASSENGER_REGISTRATION_REQUEST_FAILED,
    });

    return;
  }

  await publishToEventBus({
    aggregateId: event.aggregateId,
    eventId: null,
    payload: event.payload,
    type: EventType.PASSENGER_REGISTRATION_REQUEST_SUCCEEDED,
  });
}
