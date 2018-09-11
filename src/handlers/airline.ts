import * as mongodb from 'mongodb';
import { hydrateAirline } from '../aggregates/airline';
import { COLLECTIONS } from '../constants/collections';
import { EventType } from '../enums/event-type';
import { publishToEventBus } from '../event-bus';
import { IAirline } from '../interfaces/airline';
import { IAirlineReadModel } from '../interfaces/airline-read-model';
import { IEvent } from '../interfaces/event';
import { getCollection } from '../persistence/event-store';

export async function handleAirlineRegistrationRequestEvent(event: IEvent<any>): Promise<void> {
  const existingAirline: IAirline = await hydrateAirline(event.aggregateId);

  if (existingAirline) {
    await publishToEventBus({
      aggregateId: event.aggregateId,
      eventId: null,
      payload: event.payload,
      type: EventType.AIRLINE_REGISTRATION_REQUEST_FAILED,
    });

    return;
  }

  await publishToEventBus({
    aggregateId: event.aggregateId,
    eventId: null,
    payload: event.payload,
    type: EventType.AIRLINE_REGISTRATION_REQUEST_SUCCEEDED,
  });
}

export async function handleAirlineRegistrationRequestSucceededEvent(event: IEvent<any>): Promise<void> {
  const collection: mongodb.Collection = await getCollection(COLLECTIONS.AIRLINE);

  const airlineReadModel: IAirlineReadModel = {
    callsign: event.payload.callsign,
    company: event.payload.company,
    iataCode: event.payload.iataCode,
    icaoCode: event.payload.icaoCode,
  };

  await collection.insertOne(airlineReadModel);
}
