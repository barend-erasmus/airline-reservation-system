import * as mongodb from 'mongodb';
import { IEvent } from '../interfaces/event';

export async function publishEvent(
  getColllection: () => Promise<mongodb.Collection>,
  eventHandlers: {},
  event: IEvent<any>,
): Promise<void> {
  const collection: mongodb.Collection = await getColllection();

  await collection.insertOne(event);

  const eventHandler: (event: IEvent<any>) => Promise<void> = eventHandlers[event.type];

  if (!eventHandler) {
    return;
  }

  await eventHandler(event);
}

export async function hydrateFromEventStore(
  getColllection: () => Promise<mongodb.Collection>,
  hydrate: (getEvent: () => Promise<IEvent<any>>, obj: any) => Promise<any>,
  id: string,
): Promise<any> {
  const collection: mongodb.Collection = await getColllection();

  const cursor: mongodb.Cursor = collection.find({
    id: id,
  });

  const getEvent: () => Promise<IEvent<any>> = async () => {
    const hasNext: boolean = await cursor.hasNext();
    
    if (!hasNext) {
      return null;
    }

    const event: any = await cursor.next();

    return {
      id: event._id,
      type: event.type,
      payload: event.payload,
    };
  };

  return hydrate(getEvent, null);
}

export function getCollectionBuilder(): () => Promise<mongodb.Collection> {
  let collection: mongodb.Collection = null;

  return async () => {
    if (collection) {
      return collection;
    }

    const client: mongodb.MongoClient = await mongodb.connect(
      'mongodb+srv://airline-reservation-system:9j8r7YMAQyn^ZmfH@m001-sandbox-5lrbk.mongodb.net/test',
      { useNewUrlParser: true },
    );

    const database: mongodb.Db = client.db('airline-reservation-system');

    collection = database.collection('events');

    return collection;
  };
}
