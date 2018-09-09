import * as mongodb from 'mongodb';
import { IEvent } from '../interfaces/event';
import { EventType } from '../enums/event-type';
import { handleAirlineRegisterRequestEvent } from '../handlers/airline';
import { handlePassengerRegisterRequestEvent } from '../handlers/passenger';

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
    case EventType.PASSENGER_REGISTER_REQUEST:
      await handlePassengerRegisterRequestEvent({
        ...event,
        eventId: insertOneWriteOpResult.insertedId.toHexString(),
      });
      break;
  }
}

export async function hydrateFromEventStore(
  applyEvent: (obj: any, event: IEvent<any>) => any,
  obj: any,
  aggregateId: string,
): Promise<any> {
  const collection: mongodb.Collection = await getCollection();

  const cursor: mongodb.Cursor = collection
    .find({
      aggregateId,
    })
    .sort({ _id: 1 });

  let appliedObj: any = obj;

  while (await cursor.hasNext()) {
    const document: any = await cursor.next();

    const event: IEvent<any> = {
      eventId: document._id,
      aggregateId: document.aggregateId,
      type: document.type,
      payload: document.payload,
    };

    appliedObj = applyEvent(obj, event);
  }

  return appliedObj;
}

// export async function getCollection(): Promise<mongodb.Collection> {
//   const client: mongodb.MongoClient = await mongodb.connect(
//     'mongodb+srv://airline-reservation-system:9j8r7YMAQyn^ZmfH@m001-sandbox-5lrbk.mongodb.net/test',
//     { useNewUrlParser: true },
//   );

//   const database: mongodb.Db = client.db('airline-reservation-system');

//   const collection: mongodb.Collection = database.collection('events');

//   return collection;
// }

export async function getCollection(): Promise<mongodb.Collection> {
  const client: mongodb.MongoClient = await mongodb.connect(
    'mongodb://127.0.0.1:27017/test',
    { useNewUrlParser: true },
  );

  const database: mongodb.Db = client.db('airline-reservation-system');

  const collection: mongodb.Collection = database.collection('events');

  return collection;
}
