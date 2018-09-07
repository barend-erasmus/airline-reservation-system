import { EventType } from '../enums/event-type';

export interface IEvent<T> {
  id: string;

  type: EventType;

  payload: T;
}
