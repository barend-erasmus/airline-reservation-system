import { IAggregate } from './aggregate';

export interface IAirline extends IAggregate {
  iataCode: string;
  icaoCode: string;

  callsign: string;

  company: string;
}
