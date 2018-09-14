import * as mongodb from 'mongodb';
import { hydrateTrip } from '../aggregates/trip';
import { COLLECTIONS } from '../constants/collections';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';
import { IEvent } from '../interfaces/event';
import { ITrip } from '../interfaces/trip';
import { ITripReadModel } from '../interfaces/trip-read-model';
import { getCollection } from '../persistence/event-store';

export async function handleTripRegistrationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingTrip: ITrip = await hydrateTrip(event.aggregateId);

  if (existingTrip) {
    await publishToEventBus({
      aggregateId: event.aggregateId,
      eventId: null,
      payload: event.payload,
      type: EventType.TRIP_REGISTRATION_REQUEST_FAILED,
    });

    return;
  }

  await publishToEventBus({
    aggregateId: event.aggregateId,
    eventId: null,
    payload: event.payload,
    type: EventType.TRIP_REGISTRATION_REQUEST_SUCCEEDED,
  });
}

export async function handleTripRegistrationRequestSucceededEvent(event: IEvent<any>): Promise<void> {
  const collection: mongodb.Collection = await getCollection(COLLECTIONS.TRIP);

  const tripReadModel: ITripReadModel = {
    departureDate: event.payload.departureDate,
    flight: event.payload.flight,
    id: event.payload.id,
    numberOfSeatRemaining: event.payload.numberOfSeatRemaining,
    route: event.payload.route,
  };

  await collection.insertOne(tripReadModel);
}

export async function handleTripSeatReservationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingTrip: ITrip = await hydrateTrip(event.aggregateId);

  if (!existingTrip) {
    return;
  }

  if (existingTrip.numberOfSeatRemaining < 0) {
    await publishToEventBus({
      aggregateId: event.aggregateId,
      eventId: null,
      payload: event.payload,
      type: EventType.TRIP_SEAT_RESERVATION_REQUEST_FAILED,
    });

    return;
  }

  await publishToEventBus({
    aggregateId: event.aggregateId,
    eventId: null,
    payload: event.payload,
    type: EventType.TRIP_SEAT_RESERVATION_REQUEST_SUCCEEDED,
  });
}

export async function handleTripSeatReservationRequestSucceededEvent(event: IEvent<any>): Promise<void> {
  const collection: mongodb.Collection = await getCollection(COLLECTIONS.TRIP);

  await collection.updateOne(
    {
      id: event.aggregateId,
    },
    {
      $inc: {
        numberOfSeatRemaining: 1,
      },
    },
  );
}
