import { IEvent } from '../interfaces/event';

export interface IAirlineUpdateRequestEvent
  extends IEvent<{ iataCode: string; icaoCode: string; callsign: string; company: string }> {}
