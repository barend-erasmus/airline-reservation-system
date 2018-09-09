import * as mongodb from 'mongodb';
import { publishEvent, getCollection } from './persistence/event-store';
import { MOCKS } from './constants/mocks';
import { IAirline } from './interfaces/airline';
import { EventType } from './enums/event-type';
import { hydrateAirlineFromEventStore } from './aggregates/airline';
import { IPassenger } from './interfaces/passenger';
import { hydratePassengerFromEventStore } from './aggregates/passenger';

(async () => {
  const collection: mongodb.Collection = await getCollection();

  try {
    await collection.drop();
  } catch {}

  await publishEvent({
    eventId: null,
    aggregateId: MOCKS.airlines[0].iataCode,
    type: EventType.AIRLINE_REGISTER_REQUEST,
    payload: MOCKS.airlines[0],
  });

  const airline: IAirline = await hydrateAirlineFromEventStore(MOCKS.airlines[0].iataCode);

  console.log(airline);

  await publishEvent({
    eventId: null,
    aggregateId: MOCKS.passengers[0].passportNumber,
    type: EventType.PASSENGER_REGISTER_REQUEST,
    payload: MOCKS.passengers[0],
  });

  const passenger: IPassenger = await hydratePassengerFromEventStore(MOCKS.passengers[0].passportNumber);

  console.log(passenger);
})();
