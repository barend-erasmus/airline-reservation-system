import { EventType } from '../enums/event-type';

export interface IEvent<T> {
  eventId: string;

  aggregateId: string;

  type: EventType;

  payload: T;
}
