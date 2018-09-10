import { hydratePassenger } from '../aggregates/passenger';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';
import { IEvent } from '../interfaces/event';
import { IPassenger } from '../interfaces/passenger';

export async function handlePassengerRegistrationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingPassenger: IPassenger = await hydratePassenger(event.aggregateId);

  if (existingPassenger) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.PASSENGER_REGISTRATION_REQUEST_FAILED,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.PASSENGER_REGISTRATION_REQUEST_SUCCEEDED,
    payload: event.payload,
  });
}
