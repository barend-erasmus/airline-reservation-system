import * as mongodb from 'mongodb';
import { hydrateAirline } from '../aggregates/airline';
import { COLLECTIONS } from '../constants/collections';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';
import { IAirline } from '../interfaces/airline';
import { IEvent } from '../interfaces/event';
import { getCollection } from '../persistence/event-store';

export async function handleAirlineRegistrationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingAirline: IAirline = await hydrateAirline(event.aggregateId);

  if (existingAirline) {
    await publishToEventBus({
      eventId: null,
      aggregateId: event.aggregateId,
      type: EventType.AIRLINE_REGISTRATION_REQUEST_FAILED,
      payload: event.payload,
    });

    return;
  }

  await publishToEventBus({
    eventId: null,
    aggregateId: event.aggregateId,
    type: EventType.AIRLINE_REGISTRATION_REQUEST_SUCCEEDED,
    payload: event.payload,
  });
}

export async function handleAirlineRegistrationRequestSucceededEvent(event: IEvent<any>): Promise<void> {
  const collection: mongodb.Collection = await getCollection(COLLECTIONS.AIRLINE);

  console.log(event.payload);

  await collection.insert({
    ...event.payload,
  });
}
