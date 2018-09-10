import { IEvent } from '../interfaces/event';
import { EventType } from '../enums/event-type';
import { ITrip } from '../interfaces/trip';
import { hydrateTrip } from '../aggregates/trip';
import { publishToEventBus } from '../event-bus';

export async function handleTripRegisterRequestEvent(event: IEvent<any>): Promise<void> {
  const existingTrip: ITrip = await hydrateTrip(event.aggregateId);

  if (existingTrip) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.TRIP_REGISTER_FAIL,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.TRIP_REGISTER_SUCCESS,
    payload: event.payload,
  });
}

export async function handleTripSeatReserveRequestEvent(event: IEvent<any>): Promise<void> {
  const existingTrip: ITrip = await hydrateTrip(event.aggregateId);

  if (!existingTrip) {
    return;
  }

  if (existingTrip.numberOfSeatRemaining < 0) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.TRIP_SEAT_RESERVE_FAIL,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.TRIP_SEAT_RESERVE_SUCCESS,
    payload: event.payload,
  });
}
