import * as mongodb from 'mongodb';
import { CollectionNames } from './constants/collection-names';
import { EventType } from './enums/event-type';
import { AirlineRegistrationRequestEventHandler } from './handlers/airline-registration-request-event';
import { Initialization } from './initialization/initialization';
import { EventBus } from './persistence/event-bus';
import { EventStore } from './persistence/event-store';
import { MongoStore } from './persistence/mongodb-store';
import { Server } from './server';

(async () => {
  for (const collectionName of Object.keys(CollectionNames)) {
    const collection: mongodb.Collection = await MongoStore.getCollection(collectionName);

    try {
      await collection.drop();
    } catch {}
  }

  const eventStore: EventStore = new EventStore();

  const eventBus: EventBus = new EventBus(eventStore);

  eventBus.subscribe(EventType.AIRLINE_REGISTRATION_REQUEST, new AirlineRegistrationRequestEventHandler(eventStore));

  await Initialization.executeAirlines(eventBus);

  new Server().start();

  // MongoStore.close();
})();
