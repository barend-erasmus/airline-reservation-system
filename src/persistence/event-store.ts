import * as mongodb from 'mongodb';
import { IAggregate } from '../interfaces/aggregate';
import { IEvent } from '../interfaces/event';

let client: mongodb.MongoClient = null;

let database: mongodb.Db = null;

export async function persistEvent(event: IEvent<any>): Promise<IEvent<any>> {
  const collection: mongodb.Collection = await getCollection();

  const insertOneWriteOpResult: mongodb.InsertOneWriteOpResult = await collection.insertOne({
    aggregateId: event.aggregateId,
    payload: event.payload,
    type: event.type,
  });

  return {
    ...event,
    eventId: insertOneWriteOpResult.insertedId.toHexString(),
  };
}

export async function hydrate(
  type: string,
  applyEvent: (aggregate: IAggregate, event: IEvent<any>) => IAggregate,
  aggregateId: string,
): Promise<IAggregate> {
  const snapshot: IAggregate = await getSnapshot(type, aggregateId);

  return hydrateFromEventStore(applyEvent, snapshot, aggregateId);
}

export async function hydrateFromEventStore(
  applyEvent: (aggregate: IAggregate, event: IEvent<any>) => IAggregate,
  aggregate: IAggregate,
  aggregateId: string,
): Promise<IAggregate> {
  const collection: mongodb.Collection = await getCollection();

  const query: any = { aggregateId };

  if (aggregate) {
    query._id = { $gt: aggregate.lastAppliedEventId };
  }

  const cursor: mongodb.Cursor = collection.find(query).sort({ _id: 1 });

  let appliedAggregate: IAggregate = aggregate;

  while (await cursor.hasNext()) {
    const document: any = await cursor.next();

    const event: IEvent<any> = {
      aggregateId: document.aggregateId,
      eventId: document._id.toHexString(),
      payload: document.payload,
      type: document.type,
    };

    appliedAggregate = applyEvent(appliedAggregate, event);
  }

  return appliedAggregate;
}

export async function getSnapshot(type: string, aggregateId: string): Promise<IAggregate> {
  const collection: mongodb.Collection = await getCollection(type);

  const document: any = await collection.findOne({ _id: aggregateId });

  if (!document) {
    return null;
  }

  return {
    ...document.aggregate,
  };
}

export async function persistSnapshot(type: string, aggregate: IAggregate): Promise<void> {
  const collection: mongodb.Collection = await getCollection(type);

  const document: any = await collection.findOne({ _id: aggregate.id });

  if (document) {
    await collection.replaceOne({ _id: aggregate.id }, { _id: aggregate.id, aggregate });
  } else {
    await collection.insertOne({ _id: aggregate.id, aggregate });
  }
}

export async function getCollection(collectionName: string = null): Promise<mongodb.Collection> {
  if (!client) {
    client = await mongodb.connect(
      // 'mongodb+srv://airline-reservation-system:9j8r7YMAQyn^ZmfH@m001-sandbox-5lrbk.mongodb.net/test',
      'mongodb://127.0.0.1:27017/test',
      { useNewUrlParser: true },
    );
  }

  if (!database) {
    database = client.db('airline-reservation-system');
  }

  const collection: mongodb.Collection = database.collection(collectionName || 'events');

  return collection;
}
