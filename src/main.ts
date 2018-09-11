import * as bodyParser from 'body-parser';
import * as cluster from 'cluster';
import * as express from 'express';
import * as mongodb from 'mongodb';
import * as os from 'os';
import { hydrateTrip } from './aggregates/trip';
import { COLLECTIONS } from './constants/collections';
import { MOCKS } from './constants/mocks';
import { EventType } from './enums/event-type';
import { initializeEventBus, publishToEventBus, subscribeToEventBus } from './event-bus';
import {
  handleAirlineRegistrationRequestEvent,
  handleAirlineRegistrationRequestSucceededEvent,
} from './handlers/airline';
import { handlePassengerRegistrationRequestEvent } from './handlers/passenger';
import { handleTripRegistrationRequestEvent, handleTripSeatReservationRequestEvent } from './handlers/trip';
import { IAirlineReadModel } from './interfaces/airline-read-model';
import { IEvent } from './interfaces/event';
import { ITrip } from './interfaces/trip';
import { getCollection } from './persistence/event-store';
import { readModelListAirlines } from './read-models/airline';

function configureEventHandlers(): void {
  subscribeToEventBus(EventType.AIRLINE_REGISTRATION_REQUEST, handleAirlineRegistrationRequestEvent);

  subscribeToEventBus(EventType.AIRLINE_REGISTRATION_REQUEST_SUCCEEDED, handleAirlineRegistrationRequestSucceededEvent);

  subscribeToEventBus(EventType.PASSENGER_REGISTRATION_REQUEST, handlePassengerRegistrationRequestEvent);

  subscribeToEventBus(EventType.TRIP_REGISTRATION_REQUEST, handleTripRegistrationRequestEvent);

  subscribeToEventBus(EventType.TRIP_SEAT_RESERVATION_REQUEST, handleTripSeatReservationRequestEvent);

  // Logging
  const loggingHandler = async (event: IEvent<any>) => {
    console.log(`[${cluster.worker.id}]: handling ${EventType[event.type]}`);
  };

  for (const event of Object.keys(EventType)
    .map((key: string) => parseInt(key, 10))
    .filter((value: number) => !isNaN(value))) {
    subscribeToEventBus(event, loggingHandler);
  }
}

async function dropAllCollections(): Promise<void> {
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
}

async function prepopulate(): Promise<void> {
  for (const airline of MOCKS.airlines) {
    await publishToEventBus({
      aggregateId: airline.id,
      eventId: null,
      payload: airline,
      type: EventType.AIRLINE_REGISTRATION_REQUEST,
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
      aggregateId: passenger.id,
      eventId: null,
      payload: passenger,
      type: EventType.PASSENGER_REGISTRATION_REQUEST,
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
      aggregateId: trip.id,
      eventId: null,
      payload: trip,
      type: EventType.TRIP_REGISTRATION_REQUEST,
    });
  }
}

(async () => {
  if (cluster.isMaster) {
    const cpus: number = os.cpus().length;
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
  } else {
    initializeEventBus();

    configureEventHandlers();

    const expressApplication: express.Application = express();

    expressApplication.use(bodyParser.json());

    expressApplication.route('/initialize').get(async (request: express.Request, response: express.Response) => {
      await dropAllCollections();

      await prepopulate();

      response.json('OK');
    });

    expressApplication.route('/airlines').get(async (request: express.Request, response: express.Response) => {
      const airlines: Array<IAirlineReadModel> = await readModelListAirlines();

      response.json(airlines);
    });

    expressApplication
      .route('/trip/seat/reserve')
      .post(async (request: express.Request, response: express.Response) => {
        await publishToEventBus({
          aggregateId: request.body.id,
          eventId: null,
          payload: {
            passengerId: request.body.passengerId,
          },
          type: EventType.TRIP_SEAT_RESERVATION_REQUEST,
        });

        response.json('OK');
      });

    expressApplication.route('/trip').get(async (request: express.Request, response: express.Response) => {
      const trip: ITrip = await hydrateTrip(request.query.id);

      response.json(trip);
    });

    expressApplication.listen(3000, () => {
      console.log('listening...');
    });
  }
})();
