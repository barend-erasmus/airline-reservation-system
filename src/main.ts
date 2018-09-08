import * as mongodb from 'mongodb';
import { publishEvent, getCollection } from './persistence/event-store';
import { MOCKS } from './constants/mocks';
import { IAirline } from './interfaces/airline';
import { EventType } from './enums/event-type';
import { hydrateAirlineFromEventStore } from './aggregates/airline';

(async () => {
  const collection: mongodb.Collection = await getCollection();

  await collection.drop();

  await publishEvent({
    eventId: null,
    aggregateId: MOCKS.airlines[0].iataCode,
    type: EventType.AIRLINE_REGISTER_REQUEST,
    payload: MOCKS.airlines[0],
  });

  const airline: IAirline = await hydrateAirlineFromEventStore(MOCKS.airlines[0].iataCode);

  console.log(airline);
})();
