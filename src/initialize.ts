import * as mongodb from 'mongodb';
import { COLLECTIONS } from './constants/collections';
import { MOCKS } from './constants/mocks';
import { EventType } from './enums/event-type';
import { publishToEventBus } from './event-bus';
import { getCollection } from './persistence/event-store';

export async function initialize() {
  const collectionEvents: mongodb.Collection = await getCollection();

  try {
    await collectionEvents.drop();
  } catch {}

  for (const collectionKey of Object.keys(COLLECTIONS)) {
    const collection: mongodb.Collection = await getCollection(COLLECTIONS[collectionKey]);

    try {
      await collection.drop();
    } catch {}
  }

  for (const airline of MOCKS.airlines) {
    await publishToEventBus({
      eventId: null,
      aggregateId: airline.id,
      type: EventType.AIRLINE_REGISTRATION_REQUEST,
      payload: airline,
    });
  }

  //   for (const flight of MOCKS.flights) {
  //     await publishToEventBus({
  //       eventId: null,
  //       aggregateId: flight.id,
  //       type: null,
  //       payload: flight,
  //     });
  //   }

  for (const passenger of MOCKS.passengers) {
    await publishToEventBus({
      eventId: null,
      aggregateId: passenger.id,
      type: EventType.PASSENGER_REGISTRATION_REQUEST,
      payload: passenger,
    });
  }

  //   for (const route of MOCKS.routes) {
  //     await publishEvent({
  //       eventId: null,
  //       aggregateId: route.id,
  //       type: null,
  //       payload: route,
  //     });
  //   }

  for (const trip of MOCKS.trips) {
    await publishToEventBus({
      eventId: null,
      aggregateId: trip.id,
      type: EventType.TRIP_REGISTRATION_REQUEST,
      payload: trip,
    });
  }
}
