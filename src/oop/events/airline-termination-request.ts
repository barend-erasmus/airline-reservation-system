import { IEvent } from '../interfaces/event';

export interface IAirlineTerminationRequestEvent
  extends IEvent<{ icaoCode: string; }> {}
