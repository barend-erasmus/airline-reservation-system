import { hydrateTrip } from '../aggregates/trip';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';
import { IEvent } from '../interfaces/event';
import { ITrip } from '../interfaces/trip';

export async function handleTripRegistrationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingTrip: ITrip = await hydrateTrip(event.aggregateId);

  if (existingTrip) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.TRIP_REGISTRATION_REQUEST_FAILED,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.TRIP_REGISTRATION_REQUEST_SUCCEEDED,
    payload: event.payload,
  });
}

export async function handleTripSeatReservationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingTrip: ITrip = await hydrateTrip(event.aggregateId);

  if (!existingTrip) {
    return;
  }

  if (existingTrip.numberOfSeatRemaining < 0) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.TRIP_SEAT_RESERVATION_REQUEST_FAILED,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.TRIP_SEAT_RESERVATION_REQUEST_SUCCEEDED,
    payload: event.payload,
  });
}
