import * as mongodb from 'mongodb';
import { CollectionNames } from '../constants/collection-names';
import { EventType } from '../enums/event-type';
import { IEvent } from '../interfaces/event';
import { IEventHandler } from '../interfaces/event-handler';
import { EventStore } from './event-store';
import { MongoStore } from './mongodb-store';

export class EventBus {
  protected subscriptions: {} = {};

  constructor(protected eventStore: EventStore) {
    setInterval(() => this.onTick(), 100);
  }

  public async subscribe(eventType: EventType, handler: IEventHandler): Promise<void> {
    if (!this.subscriptions[eventType]) {
      this.subscriptions[eventType] = [];
    }

    this.subscriptions[eventType].push(handler);
  }

  public async publish(event: IEvent<any>): Promise<void> {
    const persistedEvent: IEvent<any> = await this.eventStore.persist(event);

    const collection: mongodb.Collection = await MongoStore.getCollection(CollectionNames.EVENT_BUS);

    await collection.insertOne(persistedEvent);
  }

  protected async onTick(): Promise<void> {
    const collection: mongodb.Collection = await MongoStore.getCollection(CollectionNames.EVENT_BUS);

    const document: any = await collection.findOneAndDelete(
      {},
      {
        sort: {
          _id: 1,
        },
      },
    );

    if (!document.value) {
      return;
    }

    const event: IEvent<any> = {
      ...document.value,
    };

    console.log(`handling ${EventType[event.type]}`);

    if (!this.subscriptions[event.type]) {
      this.subscriptions[event.type] = [];
    }

    for (const handler of this.subscriptions[event.type] as Array<IEventHandler>) {
      handler.handle(this, event);
    }
  }
}
