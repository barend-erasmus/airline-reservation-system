import * as mongodb from 'mongodb';
import { getCollection } from './persistence/event-store';
import { MOCKS } from './constants/mocks';
import { EventType } from './enums/event-type';
import { COLLECTIONS } from './constants/collections';
import { publishToEventBus } from './event-bus';

export async function initialize() {
  const collectionEvents: mongodb.Collection = await getCollection();

  try {
    await collectionEvents.drop();
  } catch {}

  const collectionEventBus: mongodb.Collection = await getCollection('event-bus');

  try {
    await collectionEventBus.drop();
  } catch {}

  const collectionAirlines: mongodb.Collection = await getCollection(COLLECTIONS.AIRLINE);

  try {
    await collectionAirlines.drop();
  } catch {}

  const collectionPassengers: mongodb.Collection = await getCollection(COLLECTIONS.PASSENGER);

  try {
    await collectionPassengers.drop();
  } catch {}

  const collectionTrips: mongodb.Collection = await getCollection(COLLECTIONS.TRIP);

  try {
    await collectionTrips.drop();
  } catch {}

  for (const airline of MOCKS.airlines) {
    await publishToEventBus({
      eventId: null,
      aggregateId: airline.id,
      type: EventType.AIRLINE_REGISTER_REQUEST,
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
      type: EventType.PASSENGER_REGISTER_REQUEST,
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
      type: EventType.TRIP_REGISTER_REQUEST,
      payload: trip,
    });
  }
}
