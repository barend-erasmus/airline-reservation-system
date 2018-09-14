import { IEvent } from '../interfaces/event';

export interface IAirlineRegistrationRequestEvent
  extends IEvent<{ iataCode: string; icaoCode: string; callsign: string; company: string }> {}
