import * as mongodb from 'mongodb';
import { IEvent } from '../interfaces/event';
import { EventType } from '../enums/event-type';
import { handleAirlineRegisterRequestEvent } from '../handlers/airline';

export async function publishEvent(event: IEvent<any>): Promise<void> {
  const collection: mongodb.Collection = await getCollection();

  const insertOneWriteOpResult: mongodb.InsertOneWriteOpResult = await collection.insertOne({
    aggregateId: event.aggregateId,
    type: event.type,
    payload: event.payload,
  });

  switch (event.type) {
    case EventType.AIRLINE_REGISTER_REQUEST:
      await handleAirlineRegisterRequestEvent({
        ...event,
        eventId: insertOneWriteOpResult.insertedId.toHexString(),
      });
      break;
  }
}

export async function hydrateFromEventStore(
  hydrate: (getEvent: () => Promise<IEvent<any>>) => Promise<any>,
  aggregateId: string,
): Promise<any> {
  const collection: mongodb.Collection = await getCollection();

  const cursor: mongodb.Cursor = collection
    .find({
      aggregateId,
    })
    .sort({ _id: 1 });

  return hydrateFromCursor(cursor, hydrate);
}

export async function hydrateFromCursor(
  cursor: mongodb.Cursor,
  hydrate: (getEvent: () => Promise<IEvent<any>>) => Promise<any>,
): Promise<any> {
  const getEvent: () => Promise<IEvent<any>> = async () => {
    const hasNext: boolean = await cursor.hasNext();

    if (!hasNext) {
      return null;
    }

    const event: any = await cursor.next();

    return {
      eventId: event._id,
      aggregateId: event.aggregateId,
      type: event.type,
      payload: event.payload,
    };
  };

  return hydrate(getEvent);
}

export async function getCollection(): Promise<mongodb.Collection> {
  const client: mongodb.MongoClient = await mongodb.connect(
    'mongodb+srv://airline-reservation-system:9j8r7YMAQyn^ZmfH@m001-sandbox-5lrbk.mongodb.net/test',
    { useNewUrlParser: true },
  );

  const database: mongodb.Db = client.db('airline-reservation-system');

  const collection: mongodb.Collection = database.collection('events');

  return collection;
}
