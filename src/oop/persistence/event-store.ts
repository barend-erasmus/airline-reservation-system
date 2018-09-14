import * as mongodb from 'mongodb';
import { CollectionNames } from '../constants/collection-names';
import { IAggregate } from '../interfaces/aggregate';
import { IEvent } from '../interfaces/event';
import { MongoStore } from './mongodb-store';

export class EventStore {
  public async hydrate<T extends IAggregate>(aggregate: T, aggregateId: string): Promise<T> {
    const collection: mongodb.Collection = await MongoStore.getCollection(CollectionNames.EVENTS);

    const query: any = { aggregateId };

    if (aggregate.getLastAppliedEventId()) {
      query._id = { $gt: aggregate.getLastAppliedEventId() };
    }

    const cursor: mongodb.Cursor = collection.find(query).sort({ _id: 1 });

    while (await cursor.hasNext()) {
      const document: any = await cursor.next();

      const event: IEvent<any> = {
        aggregateId: document.aggregateId,
        eventId: document._id.toHexString(),
        payload: document.payload,
        type: document.type,
      };

      aggregate.applyEvent(event);
    }

    return aggregate.getId() ? aggregate : null;
  }

  public async persist(event: IEvent<any>): Promise<IEvent<any>> {
    const collection: mongodb.Collection = await MongoStore.getCollection(CollectionNames.EVENTS);

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
}
