import { EventEmitter } from 'events';
import * as mongodb from 'mongodb';
import { COLLECTIONS } from './constants/collections';
import { EventType } from './enums/event-type';
import { IEvent } from './interfaces/event';
import { getCollection, persistEvent } from './persistence/event-store';

const subscriptions: {} = {};

export function initializeEventBus(): void {
  // const eventEmmiter: EventEmitter = new EventEmitter();

  // eventEmmiter.on('event', (event: IEvent<any>) => {
  //   console.log(`handling ${EventType[event.type]}`);

  //   if (!subscriptions[event.type]) {
  //     subscriptions[event.type] = [];
  //   }

  //   for (const handler of subscriptions[event.type] as Array<(event: IEvent<any>) => Promise<void>>) {
  //     handler(event);
  //   }
  // });

  setInterval(async () => {
    const collection: mongodb.Collection = await getCollection(COLLECTIONS.EVENT_BUS);

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

    if (!subscriptions[event.type]) {
      subscriptions[event.type] = [];
    }

    for (const handler of subscriptions[event.type] as Array<(event: IEvent<any>) => Promise<void>>) {
      handler(event);
    }
  }, 200);
}

export function subscribeToEventBus(eventType: EventType, handler: (event: IEvent<any>) => Promise<void>): void {
  if (!subscriptions[eventType]) {
    subscriptions[eventType] = [];
  }

  subscriptions[eventType].push(handler);
}

// export async function publishToEventBus(event: IEvent<any>): Promise<void> {
//   const persistedEvent: IEvent<any> = await persistEvent(event);

//   eventEmmiter.emit('event', persistedEvent);
// }

export async function publishToEventBus(event: IEvent<any>): Promise<void> {
  const persistedEvent: IEvent<any> = await persistEvent(event);

  const collection: mongodb.Collection = await getCollection(COLLECTIONS.EVENT_BUS);

  await collection.insertOne(persistedEvent);
}
