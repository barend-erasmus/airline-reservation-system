import { EventBus } from '../persistence/event-bus';
import { IEvent } from './event';

export interface IEventHandler {
  handle(eventBus: EventBus, event: IEvent<any>): Promise<void>;
}
